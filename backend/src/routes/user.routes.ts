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

/**
 * Register user for an event
 * POST /api/v1/users/events/register
 */
router.post('/events/register', async (req: Request, res: Response) => {
  try {
    const { clerkUserId, eventId } = req.body;

    console.log('=== EVENT REGISTRATION REQUEST ===');
    console.log('Received eventId:', eventId);
    console.log('Received clerkUserId:', clerkUserId);

    if (!clerkUserId || !eventId) {
      sendError(res, 'clerkUserId and eventId are required', 400);
      return;
    }

    // Check if event exists
    console.log('Looking for event with eventId:', eventId);
    const event = await prisma.event.findFirst({
      where: { eventId },
    });

    console.log('Event found:', event ? `${event.title} (id: ${event.id})` : 'NULL');

    if (!event) {
      sendError(res, 'Event not found', 404);
      return;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        passes: {
          where: { status: 'Active' },
          orderBy: { purchaseDate: 'desc' },
        },
      },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Check if user has any active pass
    if (!user.passes || user.passes.length === 0) {
      sendError(res, 'NO_PASS', 403, {
        message: 'Please purchase a pass to register for events',
        requiresPass: true,
      });
      return;
    }

    // Get the highest tier pass (order: Quantum > Silicon > Pixel)
    const passTypeOrder = ['Quantum Pass', 'Silicon Pass', 'Pixel Pass'];
    const userPass = user.passes.sort((a, b) => {
      return passTypeOrder.indexOf(a.passType) - passTypeOrder.indexOf(b.passType);
    })[0];

    // Define event eligibility based on pass type
    const eventEligibility: Record<string, string[]> = {
      'd2-pitch-arena': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass'],
      'd1-ten-minute-million': ['Quantum Pass'],
      'd1-angel-roundtable': ['Quantum Pass'],
      'd2-incubator-summit': ['Quantum Pass'],
      'd1-design-thinking': ['Silicon Pass', 'Quantum Pass'],
      'd1-finance-marketing': ['Silicon Pass', 'Quantum Pass'],
      'd2-data-analytics': ['Silicon Pass', 'Quantum Pass'],
      'd2-ai-workshop': ['Quantum Pass'],
    };

    // Check if event requires specific pass eligibility
    const requiredPasses = eventEligibility[eventId];
    if (requiredPasses && !requiredPasses.includes(userPass.passType)) {
      // Determine the required pass tier
      const requiredPassType = requiredPasses[requiredPasses.length - 1];
      
      sendError(res, 'INSUFFICIENT_PASS', 403, {
        message: `This event requires ${requiredPassType} or higher. Please upgrade your pass to register.`,
        currentPass: userPass.passType,
        requiredPass: requiredPassType,
        requiresUpgrade: true,
      });
      return;
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: event.id,
        },
      },
    });

    if (existingRegistration) {
      sendError(res, 'Already registered for this event', 400);
      return;
    }

    // Debug logging
    console.log('Registration attempt:', {
      userId: user.id,
      eventId: event.id,
      eventIdField: event.eventId,
      passId: userPass.passId,
    });

    // Create event registration
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id, // Use the actual event.id from database instead of eventId
        passId: userPass.passId,
        participantName: user.fullName || undefined,
        participantEmail: user.email,
        participantPhone: user.phone || undefined,
        status: 'registered',
      },
    });

    logger.info(`User ${user.email} registered for event ${eventId}`);

    sendSuccess(res, 'Successfully registered for event', { registration }, 201);
  } catch (error: any) {
    logger.error('Event registration error:', error);
    sendError(res, error.message || 'Failed to register for event', 500);
  }
});

/**
 * Get user's registered events
 * GET /api/v1/users/events/registered/:clerkUserId
 */
router.get('/events/registered/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        eventRegistrations: {
          where: { status: 'registered' },
          include: {
            event: {
              select: {
                eventId: true, // Get the custom string ID like "d1-pitch-arena"
              },
            },
          },
          orderBy: { registrationDate: 'desc' },
        },
      },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Map to custom eventId strings instead of UUIDs
    const registeredEventIds = user.eventRegistrations
      .map(reg => reg.event.eventId)
      .filter(id => id !== null); // Filter out any null eventIds

    sendSuccess(res, 'Registered events fetched successfully', { 
      registeredEventIds,
      registrations: user.eventRegistrations,
    });
  } catch (error: any) {
    logger.error('Get registered events error:', error);
    sendError(res, error.message || 'Failed to fetch registered events', 500);
  }
});

export default router;
