import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { verifyQRCode } from '../services/qrcode.service';
import { scannerLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Apply scanner rate limiter to all check-in routes
router.use(scannerLimiter);

/**
 * Scan QR code and verify pass
 * POST /api/v1/checkin/scan
 */
router.post('/scan', async (req: Request, res: Response) => {
  try {
    const { qrData, eventId, adminUserId } = req.body;

    // Validate required fields
    if (!qrData) {
      sendError(res, 'QR code data is required', 400);
      return;
    }

    // Verify and parse QR code
    let verifiedData;
    try {
      verifiedData = verifyQRCode(qrData);
    } catch (error: any) {
      sendError(res, 'Invalid QR code', 400);
      return;
    }

    const { passId } = verifiedData;

    // Find the pass
    const pass = await prisma.pass.findUnique({
      where: { passId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            college: true,
          },
        },
        checkIns: {
          where: eventId ? { eventId: eventId } : undefined,
          orderBy: {
            checkInTime: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!pass) {
      sendError(res, 'Pass not found', 404);
      return;
    }

    // Check if pass is active
    if (pass.status !== 'Active') {
      sendError(res, `Pass is ${pass.status.toLowerCase()}`, 400);
      return;
    }

    // Check if already checked in for this specific event (if eventId provided)
    // NOTE: A pass can be scanned at multiple different events (all 30 events)
    // This only prevents duplicate scans at the SAME event within 30 minutes
    if (eventId && pass.checkIns.length > 0) {
      const lastCheckIn = pass.checkIns[0];
      // Allow re-entry after 30 minutes to prevent accidental double-scans
      const timeSinceLastCheckIn = Date.now() - new Date(lastCheckIn.checkInTime).getTime();
      const cooldownMinutes = 30;
      
      if (timeSinceLastCheckIn < cooldownMinutes * 60 * 1000) {
        logger.info(`Duplicate scan prevented: Pass ${passId} at event ${eventId} (scanned ${Math.floor(timeSinceLastCheckIn / 1000)}s ago)`);
        
        sendSuccess(res, `Already checked in to this event ${Math.floor(timeSinceLastCheckIn / 60000)} minutes ago`, {
          pass: {
            passId: pass.passId,
            passType: pass.passType,
            status: pass.status,
            bookingId: pass.bookingId,
            createdAt: pass.createdAt,
            user: pass.user,
          },
          checkIn: lastCheckIn,
          alreadyCheckedIn: true,
          cooldownRemaining: Math.ceil((cooldownMinutes * 60 * 1000 - timeSinceLastCheckIn) / 60000),
        });
        return;
      }
    }

    // Create check-in record (always create, regardless of eventId)
    // If eventId is provided, try to find the event by eventId or id
    let eventUuid: string | null = null;
    if (eventId) {
      const event = await prisma.event.findFirst({
        where: {
          OR: [
            { id: eventId },
            { eventId: eventId },
          ],
        },
        select: { id: true },
      });
      
      if (event) {
        eventUuid = event.id;
      } else {
        // Event not found, log warning but still create check-in without event link
        logger.warn(`Event not found: ${eventId}, creating check-in without event link`);
      }
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        passId: pass.id,
        userId: pass.userId,
        eventId: eventUuid, // Use UUID or null
        checkInType: eventId ? 'event_entry' : 'venue_entry',
        scannedBy: adminUserId || null,
      },
    });

    logger.info(`Check-in created: Pass ${passId}${eventId ? ` for event ${eventId}` : ' (general entry)'}`);

    sendSuccess(res, 'QR code verified successfully', {
      pass: {
        id: pass.id,
        passId: pass.passId,
        passType: pass.passType,
        status: pass.status,
        bookingId: pass.bookingId,
        createdAt: pass.createdAt,
        user: pass.user,
      },
      checkIn,
      alreadyCheckedIn: false,
    });
  } catch (error: any) {
    logger.error('QR scan error:', error);
    sendError(res, error.message || 'Failed to scan QR code', 500);
  }
});

/**
 * Get check-in history for a pass
 * GET /api/v1/checkin/pass/:passId
 */
router.get('/pass/:passId', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;

    const checkIns = await prisma.checkIn.findMany({
      where: { pass: { passId } },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            category: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    sendSuccess(res, 'Check-in history fetched successfully', {
      checkIns,
      total: checkIns.length,
    });
  } catch (error: any) {
    logger.error('Get check-in history error:', error);
    sendError(res, error.message || 'Failed to fetch check-in history', 500);
  }
});

/**
 * Get check-in statistics for an event
 * GET /api/v1/checkin/event/:eventId/stats
 */
router.get('/event/:eventId/stats', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const [totalCheckIns, uniqueAttendees, checkInsByPassType] = await Promise.all([
      // Total check-ins
      prisma.checkIn.count({
        where: { eventId: eventId },
      }),

      // Unique attendees
      prisma.checkIn.findMany({
        where: { eventId: eventId },
        distinct: ['passId'],
      }),

      // Check-ins by pass type
      prisma.checkIn.groupBy({
        by: ['passId'],
        where: { eventId: eventId },
        _count: true,
      }),
    ]);

    // Get pass types distribution
    const passIds = checkInsByPassType.map((item: any) => item.passId);
    const passes = await prisma.pass.findMany({
      where: { id: { in: passIds } },
      select: { id: true, passType: true },
    });

    const passTypeMap = new Map(passes.map(p => [p.id, p.passType]));
    const passTypeStats: { [key: string]: number } = {};

    checkInsByPassType.forEach((item: any) => {
      const passType = passTypeMap.get(item.passId) || 'Unknown';
      passTypeStats[passType] = (passTypeStats[passType] || 0) + 1;
    });

    sendSuccess(res, 'Event statistics fetched successfully', {
      stats: {
        totalCheckIns,
        uniqueAttendees: uniqueAttendees.length,
        passTypeDistribution: passTypeStats,
      },
    });
  } catch (error: any) {
    logger.error('Get event statistics error:', error);
    sendError(res, error.message || 'Failed to fetch statistics', 500);
  }
});

/**
 * Get all check-ins for an event with filters
 * GET /api/v1/checkin/event/:eventId
 */
router.get('/event/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { limit = '50', offset = '0' } = req.query;

    const checkIns = await prisma.checkIn.findMany({
      where: { eventId: eventId },
      include: {
        pass: {
          select: {
            passId: true,
            passType: true,
            user: {
              select: {
                email: true,
                fullName: true,
                phone: true,
                college: true,
              },
            },
          },
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.checkIn.count({
      where: { eventId: eventId },
    });

    sendSuccess(res, 'Check-ins fetched successfully', {
      checkIns,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    logger.error('Get event check-ins error:', error);
    sendError(res, error.message || 'Failed to fetch check-ins', 500);
  }
});

/**
 * Verify pass without checking in (dry run)
 * POST /api/v1/checkin/verify
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      sendError(res, 'QR code data is required', 400);
      return;
    }

    // Verify QR code
    let verifiedData;
    try {
      verifiedData = verifyQRCode(qrData);
    } catch (error: any) {
      sendError(res, 'Invalid QR code', 400);
      return;
    }

    const { passId } = verifiedData;

    // Find the pass
    const pass = await prisma.pass.findUnique({
      where: { passId },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
            phone: true,
            college: true,
            yearOfStudy: true,
          },
        },
        checkIns: {
          orderBy: {
            checkInTime: 'desc',
          },
          take: 5,
          include: {
            event: {
              select: {
                title: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!pass) {
      sendError(res, 'Pass not found', 404);
      return;
    }

    sendSuccess(res, 'Pass verified successfully', {
      valid: pass.status === 'Active',
      pass: {
        passId: pass.passId,
        passType: pass.passType,
        status: pass.status,
        purchaseDate: pass.purchaseDate,
        hasWorkshopAccess: pass.hasWorkshopAccess,
        user: pass.user,
      },
      recentCheckIns: pass.checkIns,
    });
  } catch (error: any) {
    logger.error('Verify pass error:', error);
    sendError(res, error.message || 'Failed to verify pass', 500);
  }
});

export default router;
