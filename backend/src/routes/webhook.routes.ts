import { Router, Request, Response } from 'express';
import { Webhook } from 'svix';
import { prisma } from '../config/database';
import logger from '../utils/logger.util';

const router = Router();

/**
 * Clerk Webhook Handler
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install svix: npm install svix
 * 2. Add CLERK_WEBHOOK_SECRET to backend/.env
 * 3. Configure webhook in Clerk Dashboard: http://localhost:5000/api/v1/webhooks/clerk
 */

router.post('/clerk', async (req: Request, res: Response) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      return res.status(500).json({ error: 'CLERK_WEBHOOK_SECRET is not set' });
    }

    // Get headers
    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: 'Missing svix headers' });
    }

    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let event: any;

    try {
      event = wh.verify(JSON.stringify(req.body), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      logger.error('Webhook verification failed:', err);
      return res.status(400).json({ error: 'Webhook verification failed' });
    }

    const eventData = event.data as any;

    // Handle user.created event
    if (event.type === 'user.created') {
      logger.info('Creating user from Clerk webhook:', eventData.id);

      const userEmail = eventData.email_addresses?.[0]?.email_address;
      const fullName = `${eventData.first_name || ''} ${eventData.last_name || ''}`.trim();

      if (!userEmail) {
        logger.warn('No email found for user creation:', eventData.id);
        return res.status(200).json({ success: true });
      }

      // Check if user already exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (existingUser) {
        // Update existing user with Clerk ID
        await prisma.user.update({
          where: { email: userEmail },
          data: {
            clerkUserId: eventData.id,
            ...(fullName && { fullName }),
            ...(eventData.first_name && { firstName: eventData.first_name }),
            ...(eventData.last_name && { lastName: eventData.last_name }),
            ...(eventData.image_url && { imageUrl: eventData.image_url }),
          },
        });
        logger.info('Updated existing user with Clerk data:', eventData.id);
      } else {
        // Create new user
        await prisma.user.create({
          data: {
            clerkUserId: eventData.id,
            email: userEmail,
            ...(fullName && { fullName }),
            ...(eventData.first_name && { firstName: eventData.first_name }),
            ...(eventData.last_name && { lastName: eventData.last_name }),
            ...(eventData.image_url && { imageUrl: eventData.image_url }),
          },
        });
        logger.info('User created successfully:', eventData.id);
      }
    }

    // Handle user.updated event
    if (event.type === 'user.updated') {
      logger.info('Updating user from Clerk webhook:', eventData.id);

      const fullName = `${eventData.first_name || ''} ${eventData.last_name || ''}`.trim();

      await prisma.user.updateMany({
        where: { 
          clerkUserId: eventData.id 
        } as any,
        data: {
          email: eventData.email_addresses?.[0]?.email_address || '',
          ...(fullName && { fullName }),
          ...(eventData.first_name && { firstName: eventData.first_name }),
          ...(eventData.last_name && { lastName: eventData.last_name }),
          ...(eventData.image_url && { imageUrl: eventData.image_url }),
        },
      });

      logger.info('User updated successfully:', eventData.id);
    }

    // Handle user.deleted event
    if (event.type === 'user.deleted') {
      logger.info('Deleting user from Clerk webhook:', eventData.id);

      await prisma.user.deleteMany({
        where: { 
          clerkUserId: eventData.id 
        } as any,
      });

      logger.info('User deleted successfully:', eventData.id);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    logger.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * KonfHub Webhook Handler
 * POST /api/v1/webhooks/konfhub
 */
router.post('/konfhub', async (req: Request, res: Response) => {
  try {
    const event = req.body.event;

    logger.info(`KonfHub webhook received: ${event} - acknowledged (processing disabled due to transaction removal)`);

    // Since transactions were removed and KonfHub handles payments,
    // we acknowledge the webhook without additional processing here.
    return res.json({
      success: true,
      message: 'Webhook acknowledged - no action required on server'
    });
  } catch (error: any) {
    logger.error('KonfHub webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
