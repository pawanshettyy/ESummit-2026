import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';

const router = Router();

/**
 * Get all passes with user details (Admin only)
 * GET /api/v1/admin/passes
 */
router.get('/passes', async (_req: Request, res: Response) => {
  try {
    // TODO: Add admin authentication middleware

    // Get all passes with user details
    const passes = await prisma.pass.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            college: true,
            yearOfStudy: true,
            clerkUserId: true,
          },
        },
        transaction: {
          select: {
            id: true,
            amount: true,
            status: true,
            razorpayPaymentId: true,
            createdAt: true,
          },
        },
        checkIns: {
          orderBy: {
            checkInTime: 'desc',
          },
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
      orderBy: {
        purchaseDate: 'desc',
      },
    });

    // Calculate statistics
    const totalPasses = passes.length;
    const activePasses = passes.filter((pass) => pass.status === 'Active').length;
    
    sendSuccess(res, 'Admin passes data fetched successfully', {
      passes,
      stats: {
        totalPasses,
        activePasses,
      },
    });
  } catch (error: any) {
    logger.error('Admin get passes error:', error);
    sendError(res, error.message || 'Failed to fetch passes', 500);
  }
});

/**
 * Get admin dashboard statistics
 * GET /api/v1/admin/stats
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    // TODO: Add admin authentication middleware

    // Get comprehensive statistics
    const [totalPasses, activePasses, passes] = await Promise.all([
      prisma.pass.count(),
      prisma.pass.count({
        where: { status: 'Active' },
      }),
      prisma.pass.findMany({
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
          transaction: {
            select: {
              amount: true,
              status: true,
            },
          },
          checkIns: {
            orderBy: {
              checkInTime: 'desc',
            },
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
      }),
    ]);

    // Get check-ins count (if check-ins table exists)
    let checkInsToday = 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      checkInsToday = await prisma.checkIn.count({
        where: {
          checkInTime: {
            gte: today,
          },
        },
      });
    } catch (error) {
      // Check-ins table might not exist yet
      logger.warn('Check-ins table not accessible');
    }

    sendSuccess(res, 'Admin statistics fetched successfully', {
      stats: {
        totalRegistrations: totalPasses,
        activePasses,
        checkInsToday,
      },
      passes,
    });
  } catch (error: any) {
    logger.error('Admin get stats error:', error);
    sendError(res, error.message || 'Failed to fetch statistics', 500);
  }
});

/**
 * Get pass type distribution
 * GET /api/v1/admin/pass-distribution
 */
router.get('/pass-distribution', async (_req: Request, res: Response) => {
  try {
    // TODO: Add admin authentication middleware

    const passes = await prisma.pass.groupBy({
      by: ['passType'],
      _count: {
        passType: true,
      },
    });

    const distribution = passes.map((item) => ({
      passType: item.passType,
      count: item._count.passType,
    }));

    sendSuccess(res, 'Pass distribution fetched successfully', { distribution });
  } catch (error: any) {
    logger.error('Admin get pass distribution error:', error);
    sendError(res, error.message || 'Failed to fetch pass distribution', 500);
  }
});

/**
 * Get college-wise registration stats
 * GET /api/v1/admin/college-stats
 */
router.get('/college-stats', async (_req: Request, res: Response) => {
  try {
    // TODO: Add admin authentication middleware

    const users = await prisma.user.groupBy({
      by: ['college'],
      _count: {
        college: true,
      },
      orderBy: {
        _count: {
          college: 'desc',
        },
      },
      take: 10, // Top 10 colleges
    });

    const collegeStats = users.map((item) => ({
      college: item.college || 'Not Specified',
      count: item._count.college,
    }));

    sendSuccess(res, 'College statistics fetched successfully', { collegeStats });
  } catch (error: any) {
    logger.error('Admin get college stats error:', error);
    sendError(res, error.message || 'Failed to fetch college statistics', 500);
  }
});

export default router;
