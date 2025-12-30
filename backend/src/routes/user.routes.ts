import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { createClerkClient } from '@clerk/backend';
import { eventRegistrationFormSchema } from '../validators/event-registration.validators';

const router = Router();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Helper function to ensure user exists in database
 */
async function ensureUserExists(clerkUserId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    try {
      logger.info('User not found in DB, fetching from Clerk:', clerkUserId);
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      
      user = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
          fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          imageUrl: clerkUser.imageUrl || null,
        },
      });
      
      logger.info('User created from Clerk data:', clerkUserId);
    } catch (clerkError) {
      logger.error('Failed to fetch/create user from Clerk:', clerkError);
      throw new Error('User not found and could not be created');
    }
  }

  return user;
}

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

    // Check if user already exists by clerkUserId
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (user) {
      logger.info(`User already exists: ${email}`);
      sendSuccess(res, 'User already exists', { user }, 200);
      return;
    }

    // Check if user exists by email (in case clerk_user_id was updated)
    user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // User exists with different clerkUserId - update it
      user = await prisma.user.update({
        where: { email },
        data: {
          clerkUserId,
          fullName: fullName || user.fullName,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          imageUrl: imageUrl || user.imageUrl,
        },
      });
      logger.info(`User updated with new clerkUserId: ${email}`);
      sendSuccess(res, 'User updated successfully', { user }, 200);
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
    // Handle race condition - user might have been created between our checks
    if (error.code === 'P2002') {
      // Unique constraint violation - try to fetch the user one more time
      const existingUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      
      if (existingUser) {
        logger.info(`User found after race condition: ${req.body.email}`);
        sendSuccess(res, 'User already exists', { user: existingUser }, 200);
        return;
      }
    }
    
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
    const { 
      clerkUserId, 
      eventId, 
      bookingId,
      formData
    } = req.body;


    if (!clerkUserId || !eventId) {
      sendError(res, 'clerkUserId and eventId are required', 400);
      return;
    }

    // Check if event exists
    const event = await prisma.event.findFirst({
      where: { eventId },
    });


    if (!event) {
      sendError(res, 'Event not found', 404);
      return;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Check if user has any active passes
    const activePasses = await prisma.pass.findMany({
      where: {
        userId: user.id,
        status: 'Active'
      }
    });

    if (activePasses.length === 0) {
      sendError(res, 'NO_ACTIVE_PASS', 403, {
        message: 'You need an active E-Summit pass to register for events. Please purchase or verify your pass.',
      });
      return;
    }

    // Verify booking ID and get pass type (optional for users with active passes)
    let userWithBooking = null;
    if (bookingId && bookingId.trim()) {
      userWithBooking = await prisma.user.findFirst({
        where: {
          clerkUserId,
          bookingId: bookingId.trim(),
        },
      });
    }

    // If bookingId is provided but doesn't match, still allow if user has active passes
    if (bookingId && bookingId.trim() && !userWithBooking && activePasses.length === 0) {
      sendError(res, 'INVALID_BOOKING_ID', 403, {
        message: 'The booking ID you entered is not valid or not associated with your account',
      });
      return;
    }

    // Get pass type from active passes or user booking
    let userPassType = userWithBooking?.bookedPassType;
    if (!userPassType && activePasses.length > 0) {
      userPassType = activePasses[0].passType;
    }
    
    if (!userPassType) {
      sendError(res, 'NO_PASS_TYPE', 403, {
        message: 'Unable to determine your pass type. Please contact support.',
      });
      return;
    }

    // Define event eligibility based on pass type
    const eventEligibility: Record<string, string[]> = {
      'd1-pitch-arena': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd2-pitch-arena': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd1-ten-minute-million': ['Quantum Pass'],
      'd1-angel-roundtable': ['Quantum Pass'],
      'd2-incubator-summit': ['Quantum Pass'],
      'd1-design-thinking': ['Silicon Pass', 'Quantum Pass'],
      'd1-finance-marketing': ['Silicon Pass', 'Quantum Pass'],
      'd2-data-analytics': ['Silicon Pass', 'Quantum Pass'],
      'd2-ai-workshop': ['Quantum Pass'],
      'd1-startup-expo': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd2-startup-expo': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd1-panel-discussion': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd1-ipl-auction': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd2-ipl-auction': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd1-ai-buildathon': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd2-ai-buildathon': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd1-biz-arena': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
      'd2-biz-arena': ['Pixel Pass', 'Silicon Pass', 'Quantum Pass', 'TCET Students'],
    };

    // Check if event requires specific pass eligibility
    const requiredPasses = eventEligibility[eventId];
    if (requiredPasses && !requiredPasses.includes(userPassType)) {
      // Determine the required pass tier
      const requiredPassType = requiredPasses[0]; // Get minimum required pass
      
      sendError(res, 'INSUFFICIENT_PASS', 403, {
        message: `This event requires ${requiredPassType} or higher. Your current pass (${userPassType}) does not provide access to this event.`,
        currentPass: userPassType,
        requiredPass: requiredPassType,
      });
      return;
    }

    // Validate formData if provided
    let validatedFormData = null;
    if (formData) {
      try {
        validatedFormData = eventRegistrationFormSchema.parse(formData);
      } catch (validationError: any) {
        logger.error('Form data validation error:', validationError.errors);
        sendError(res, 'Invalid form data: ' + validationError.errors.map((e: any) => e.message).join(', '), 400);
        return;
      }
    }

    // Get the actual pass ID from booking ID
    let passId = null;
    if (bookingId && bookingId.trim()) {
      const pass = await prisma.pass.findFirst({
        where: {
          userId: user.id,
          bookingId: bookingId.trim(),
          status: 'Active'
        }
      });
      if (pass) {
        passId = pass.id;
      }
    } else if (activePasses.length > 0) {
      // Use the first active pass if no bookingId provided
      passId = activePasses[0].id;
    }

    // Debug logging
    logger.info('Registration attempt:', {
      userId: user.id,
      eventId: event.id,
      eventIdField: event.eventId,
      bookingId: bookingId,
      passId: passId,
      passType: userPassType,
    });

    // Create event registration
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id,
        passId: passId,
        status: 'registered',
        formData: validatedFormData as any,
      },
    });

    logger.info(`User ${user.email} registered for event ${eventId} with booking ID ${bookingId}`);

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

    // Ensure user exists
    await ensureUserExists(clerkUserId);

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
