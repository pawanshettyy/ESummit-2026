
import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendError, sendSuccess } from '../utils/response.util';
import logger from '../utils/logger.util';
import { createClerkClient } from '@clerk/backend';

const router = Router();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Get user's passes
 * GET /api/v1/passes/user/:clerkUserId
 */
router.get('/user/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;
    const clerkUserIdStr = Array.isArray(clerkUserId) ? clerkUserId[0] : clerkUserId;

    // Find user
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserIdStr },
      select: { id: true }
    });

    // If user doesn't exist, try to create from Clerk data
    if (!user) {
      try {
        logger.info('User not found in DB, fetching from Clerk:', clerkUserIdStr);
        const clerkUser = await clerkClient.users.getUser(clerkUserIdStr);
        
        // Check if user exists by email
        const existingUser = await prisma.user.findUnique({
          where: { email: clerkUser.emailAddresses?.[0]?.emailAddress || '' },
          select: { id: true }
        });

        if (existingUser) {
          // Update existing user with Clerk data
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              clerkUserId: clerkUser.id,
              fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
              firstName: clerkUser.firstName || null,
              lastName: clerkUser.lastName || null,
              imageUrl: clerkUser.imageUrl || null,
            },
            select: { id: true }
          });
          logger.info('Updated existing user with Clerk data:', clerkUserId);
        } else {
          // Create user in database
          user = await prisma.user.create({
            data: {
              clerkUserId: clerkUser.id,
              email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
              fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
              firstName: clerkUser.firstName || null,
              lastName: clerkUser.lastName || null,
              imageUrl: clerkUser.imageUrl || null,
            },
            select: { id: true }
          });
          logger.info('User created from Clerk data:', clerkUserId);
        }
      } catch (clerkError) {
        logger.error('Failed to fetch/create user from Clerk:', clerkError);
        sendError(res, 'User not found and could not be created', 404);
        return;
      }
    }

    // Get user's passes
    const passes = await prisma.pass.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        passId: true,
        passType: true,
        status: true,
        bookingId: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    sendSuccess(res, 'Passes retrieved successfully', { passes });
  } catch (error: any) {
    logger.error('Get user passes error:', error);
    sendError(res, error.message || 'Failed to retrieve passes', 500);
  }
});

/**
 * Get pass statistics for a user
 * GET /api/v1/passes/stats/:clerkUserId
 */
router.get('/stats/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;
    const clerkUserIdStr = Array.isArray(clerkUserId) ? clerkUserId[0] : clerkUserId;

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserIdStr },
      select: { id: true }
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Get statistics
    const [totalPasses, activePasses] = await Promise.all([
      prisma.pass.count({
        where: { userId: user.id }
      }),
      prisma.pass.count({
        where: { userId: user.id, status: 'Active' }
      })
    ]);

    sendSuccess(res, 'Statistics fetched successfully', {
      stats: {
        totalPasses,
        activePasses
      }
    });
  } catch (error: any) {
    logger.error('Get pass statistics error:', error);
    sendError(res, error.message || 'Failed to fetch statistics', 500);
  }
});

// Note: Pass purchases are handled through KonfHub.
// This API handles pass retrieval for dashboard display.

/**
 * Create a pass directly (for immediate approval)
 * POST /api/v1/passes/create
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      email,
      fullName,
      passType,
      bookingId,
      status = 'Active',
      isThakurStudent = false,
      konfhubData = null,
    } = req.body;

    // Validate required fields - bookingId not required for Thakur students
    if (!clerkUserId || !passType) {
      sendError(res, 'clerkUserId and passType are required', 400);
      return;
    }

    // For Thakur students, we need email to identify them
    if (isThakurStudent && !email) {
      sendError(res, 'Email is required for Thakur student passes', 400);
      return;
    }

    // For paid passes, bookingId is required
    if (!isThakurStudent && !bookingId) {
      sendError(res, 'bookingId is required for paid passes', 400);
      return;
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      // For Thakur students, try to find by email first
      if (isThakurStudent && email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Update with Clerk ID if not already set
          if (!existingUser.clerkUserId) {
            user = await prisma.user.update({
              where: { id: existingUser.id },
              data: { clerkUserId },
            });
          } else {
            user = existingUser;
          }
        }
      }

      // Create new user if not found
      if (!user) {
        user = await prisma.user.create({
          data: {
            clerkUserId,
            email: email || null,
            fullName: fullName || null,
          },
        });
      }
    }

    // Check if user already has an active pass
    const existingPass = await prisma.pass.findFirst({
      where: { userId: user.id, status: 'Active' },
    });

    if (existingPass) {
      sendError(res, 'You already have an active pass', 400);
      return;
    }

    // Check if booking ID is already used (only for paid passes)
    if (!isThakurStudent && bookingId) {
      const existingBooking = await prisma.pass.findFirst({
        where: { bookingId },
      });

      if (existingBooking) {
        sendError(res, 'This booking ID is already associated with another pass', 400);
        return;
      }
    }

    // Generate unique pass ID
    const passId = `ES26-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create the pass
    const pass = await prisma.pass.create({
      data: {
        userId: user.id,
        passType,
        passId,
        bookingId: isThakurStudent ? null : bookingId, // No booking ID for Thakur students
        status,
        purchaseDate: new Date(),
        konfhubData: konfhubData ? JSON.stringify(konfhubData) : null,
        isThakurStudent,
      },
    });

    sendSuccess(res, 'Pass created successfully', { pass }, 201);
  } catch (error: any) {
    logger.error('Create pass error:', error);
    sendError(res, error.message || 'Failed to create pass', 500);
  }
});

export default router;
