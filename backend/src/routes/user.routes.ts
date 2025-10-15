import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';

const router = Router();

/**
 * Sync/create user from Clerk (fallback if webhook didn't fire)
 * POST /api/v1/users/sync
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      email,
      fullName,
      firstName,
      lastName,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !email) {
      sendError(res, 'clerkUserId and email are required', 400);
      return;
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (user) {
      logger.info(`User already exists: ${email}`);
      sendSuccess(res, 'User already exists', { user }, 200);
      return;
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        clerkUserId,
        email,
        fullName: fullName || null,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
      },
    });

    logger.info(`New user synced from Clerk: ${email}`);
    sendSuccess(res, 'User created successfully', { user }, 201);
  } catch (error: any) {
    logger.error('User sync error:', error);
    sendError(res, error.message || 'Failed to sync user', 500);
  }
});

/**
 * Complete user profile after Clerk signup
 * POST /api/v1/users/complete-profile
 */
router.post('/complete-profile', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      email,
      fullName,
      firstName,
      lastName,
      imageUrl,
      phone,
      college,
      yearOfStudy,
      rollNumber,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !email) {
      sendError(res, 'clerkUserId and email are required', 400);
      return;
    }

    if (!phone || !college || !yearOfStudy) {
      sendError(res, 'phone, college, and yearOfStudy are required', 400);
      return;
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { clerkUserId },
        data: {
          phone,
          college,
          yearOfStudy,
          rollNumber: rollNumber || null,
          // Also update other fields in case they changed
          email,
          fullName: fullName || null,
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl: imageUrl || null,
        },
      });

      logger.info(`Profile completed for existing user: ${email}`);
    } else {
      // Create new user with complete profile
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          fullName: fullName || null,
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl: imageUrl || null,
          phone,
          college,
          yearOfStudy,
          rollNumber: rollNumber || null,
        },
      });

      logger.info(`New user created with complete profile: ${email}`);
    }

    sendSuccess(res, 'Profile completed successfully', { user }, 200);
  } catch (error: any) {
    logger.error('Complete profile error:', error);
    sendError(res, error.message || 'Failed to complete profile', 500);
  }
});

/**
 * Get user profile by Clerk ID
 * GET /api/v1/users/profile/:clerkUserId
 */
router.get('/profile/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        fullName: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        phone: true,
        college: true,
        yearOfStudy: true,
        rollNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, 'User profile fetched successfully', { user });
  } catch (error: any) {
    logger.error('Get user profile error:', error);
    sendError(res, error.message || 'Failed to fetch user profile', 500);
  }
});

/**
 * Check if user profile is complete
 * GET /api/v1/users/check-profile/:clerkUserId
 */
router.get('/check-profile/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: {
        phone: true,
        college: true,
        yearOfStudy: true,
      },
    });

    if (!user) {
      sendSuccess(res, 'User not found', { isComplete: false, exists: false });
      return;
    }

    // Check if all required fields are filled
    const isComplete = !!(user.phone && user.college && user.yearOfStudy);

    sendSuccess(res, 'Profile check completed', { isComplete, exists: true });
  } catch (error: any) {
    logger.error('Check profile error:', error);
    sendError(res, error.message || 'Failed to check profile', 500);
  }
});

export default router;
