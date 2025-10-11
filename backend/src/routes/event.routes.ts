import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';

const router = Router();

/**
 * Get all events
 * GET /api/v1/events
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    sendSuccess(res, 'Events fetched successfully', { events });
  } catch (error: any) {
    logger.error('Get events error:', error);
    sendError(res, error.message || 'Failed to fetch events', 500);
  }
});

/**
 * Get single event by ID or eventId
 * GET /api/v1/events/:identifier
 */
router.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    // Try to find by UUID first, then by eventId
    const event = await prisma.event.findFirst({
      where: {
        OR: [
          { id: identifier },
          { eventId: identifier },
        ],
      },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      sendError(res, 'Event not found', 404);
      return;
    }

    sendSuccess(res, 'Event fetched successfully', { event });
  } catch (error: any) {
    logger.error('Get event error:', error);
    sendError(res, error.message || 'Failed to fetch event', 500);
  }
});

/**
 * Create a new event (Admin only)
 * POST /api/v1/events
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      eventId,
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      prizeAmount,
      eligibility,
      rules,
      judges,
      prerequisites,
      registrationDeadline,
      speakerName,
      speakerBio,
      speakerImageUrl,
      maxParticipants,
      status,
    } = req.body;

    // Validate required fields
    if (!title || !category || !date || !startTime || !endTime || !venue) {
      sendError(res, 'Missing required fields: title, category, date, startTime, endTime, venue', 400);
      return;
    }

    // Check if eventId already exists
    if (eventId) {
      const existingEvent = await prisma.event.findUnique({
        where: { eventId },
      });

      if (existingEvent) {
        sendError(res, `Event ID "${eventId}" already exists`, 400);
        return;
      }
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        eventId,
        title,
        description,
        category,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        venue,
        prizeAmount: prizeAmount ? parseFloat(prizeAmount) : null,
        eligibility,
        rules,
        judges,
        prerequisites,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        speakerName,
        speakerBio,
        speakerImageUrl,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        status: status || 'upcoming',
      },
    });

    logger.info(`Event created: ${event.eventId || event.id} - ${event.title}`);

    sendSuccess(res, 'Event created successfully', { event }, 201);
  } catch (error: any) {
    logger.error('Create event error:', error);
    sendError(res, error.message || 'Failed to create event', 500);
  }
});

/**
 * Update an event (Admin only)
 * PUT /api/v1/events/:identifier
 */
router.put('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    // Find event first
    const existingEvent = await prisma.event.findFirst({
      where: {
        OR: [
          { id: identifier },
          { eventId: identifier },
        ],
      },
    });

    if (!existingEvent) {
      sendError(res, 'Event not found', 404);
      return;
    }

    // Update event
    const event = await prisma.event.update({
      where: { id: existingEvent.id },
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
        startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
        endTime: req.body.endTime ? new Date(req.body.endTime) : undefined,
        registrationDeadline: req.body.registrationDeadline 
          ? new Date(req.body.registrationDeadline) 
          : undefined,
      },
    });

    logger.info(`Event updated: ${event.eventId || event.id}`);

    sendSuccess(res, 'Event updated successfully', { event });
  } catch (error: any) {
    logger.error('Update event error:', error);
    sendError(res, error.message || 'Failed to update event', 500);
  }
});

/**
 * Delete an event (Admin only)
 * DELETE /api/v1/events/:identifier
 */
router.delete('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    // Find event first
    const existingEvent = await prisma.event.findFirst({
      where: {
        OR: [
          { id: identifier },
          { eventId: identifier },
        ],
      },
    });

    if (!existingEvent) {
      sendError(res, 'Event not found', 404);
      return;
    }

    // Delete event
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });

    logger.info(`Event deleted: ${existingEvent.eventId || existingEvent.id}`);

    sendSuccess(res, 'Event deleted successfully');
  } catch (error: any) {
    logger.error('Delete event error:', error);
    sendError(res, error.message || 'Failed to delete event', 500);
  }
});

export default router;
