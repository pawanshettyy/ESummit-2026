import { Router, Request, Response } from 'express';
import { Webhook } from 'svix';
import { prisma } from '../config/database';
import crypto from 'crypto';
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
      console.error('Webhook verification failed:', err);
      return res.status(400).json({ error: 'Webhook verification failed' });
    }

    const eventData = event.data as any;

    // Handle user.created event
    if (event.type === 'user.created') {
      console.log('Creating user from Clerk webhook:', eventData.id);

      const fullName = `${eventData.first_name || ''} ${eventData.last_name || ''}`.trim();

      await prisma.user.create({
        data: {
          clerkUserId: eventData.id,
          email: eventData.email_addresses?.[0]?.email_address || '',
          ...(fullName && { fullName }),
          ...(eventData.first_name && { firstName: eventData.first_name }),
          ...(eventData.last_name && { lastName: eventData.last_name }),
          ...(eventData.image_url && { imageUrl: eventData.image_url }),
        },
      });

      console.log('User created successfully:', eventData.id);
    }

    // Handle user.updated event
    if (event.type === 'user.updated') {
      console.log('Updating user from Clerk webhook:', eventData.id);

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

      console.log('User updated successfully:', eventData.id);
    }

    // Handle user.deleted event
    if (event.type === 'user.deleted') {
      console.log('Deleting user from Clerk webhook:', eventData.id);

      await prisma.user.deleteMany({
        where: { 
          clerkUserId: eventData.id 
        } as any,
      });

      console.log('User deleted successfully:', eventData.id);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * KonfHub Webhook Handler
 * 
 * SETUP INSTRUCTIONS:
 * 1. Add KONFHUB_WEBHOOK_SECRET to backend/.env
 * 2. Configure webhook in KonfHub Dashboard: https://tcetesummit.in/api/v1/webhooks/konfhub
 * 3. Enable events: ticket.issued, order.completed, order.cancelled
 * 4. Set KONFHUB_AUTO_SYNC=false in .env to disable automatic pass creation (use CSV import instead)
 * 
 * Production URL: https://tcetesummit.in/api/v1/webhooks/konfhub
 */
router.post('/konfhub', async (req: Request, res: Response) => {
  try {
    // Check if auto-sync is enabled
    const autoSyncEnabled = process.env.KONFHUB_AUTO_SYNC !== 'false';
    
    if (!autoSyncEnabled) {
      logger.info('KonfHub webhook received but auto-sync is disabled', { event: req.body.event });
      return res.status(200).json({ 
        success: true, 
        message: 'Webhook acknowledged but auto-sync disabled. Use CSV import instead.' 
      });
    }

    const webhookSecret = process.env.KONFHUB_WEBHOOK_SECRET;

    // Log incoming webhook for debugging (remove in production if needed)
    logger.info('KonfHub webhook received', {
      event: req.body.event,
      headers: {
        signature: req.headers['x-konfhub-signature'] ? 'present' : 'missing',
        contentType: req.headers['content-type'],
      }
    });

    // Signature verification - skip in development if secret not set
    const signature = req.headers['x-konfhub-signature'] as string;
    
    if (webhookSecret && signature) {
      const generatedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (generatedSignature !== signature) {
        logger.error('Invalid KonfHub webhook signature');
        return res.status(400).json({ error: 'Invalid signature' });
      }
      logger.info('Webhook signature verified');
    } else if (!webhookSecret) {
      logger.warn('KONFHUB_WEBHOOK_SECRET not set - skipping signature verification (DEVELOPMENT ONLY)');
    } else if (!signature) {
      logger.warn('Missing KonfHub signature header');
    }

    const event = req.body.event;
    const payload = req.body.payload || req.body.data || req.body;

    logger.info(`Processing KonfHub event: ${event}`, { 
      hasPayload: !!payload,
      payloadKeys: payload ? Object.keys(payload) : []
    });

    // Handle ticket.issued event - REGISTRATION
    // Triggered when a user successfully purchases/registers for a ticket
    if (event === 'ticket.issued' || event === 'order.completed' || event === 'registration.completed') {
      const ticketData = payload.ticket || payload;
      const orderData = payload.order || {};

      const email = ticketData.email || ticketData.customerEmail || ticketData.attendeeEmail;
      const ticketId = ticketData.id || ticketData.ticketId;
      
      logger.info('Processing ticket registration', { 
        ticketId, 
        email,
        ticketType: ticketData.ticketType || ticketData.ticketName 
      });

      if (!email) {
        logger.error('No email found in ticket data', { ticketData });
        return res.status(400).json({ error: 'Email is required in ticket data' });
      }

      // Find user by email (case-insensitive)
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        logger.warn(`User not found for email: ${email}. User needs to sign up first.`);
        return res.status(200).json({ 
          success: true, 
          message: 'User not found - they need to create an account first',
          email 
        });
      }

      // Check if pass already exists
      const existingPass = await prisma.pass.findFirst({
        where: {
          OR: [
            { konfhubTicketId: ticketId },
            { bookingId: ticketData.ticketNumber || ticketData.bookingId },
          ],
        },
      });

      const passData = {
        price: parseFloat(ticketData.price || ticketData.amount || 0),
        purchaseDate: ticketData.purchaseDate || ticketData.createdAt || ticketData.issuedAt 
          ? new Date(ticketData.purchaseDate || ticketData.createdAt || ticketData.issuedAt)
          : new Date(),
        ticketDetails: {
          ...ticketData,
          order: orderData,
          syncedAt: new Date().toISOString(),
        },
        qrCodeUrl: ticketData.qrCode || ticketData.qrCodeUrl || null,
        qrCodeData: ticketData.qrCodeData || ticketId,
        status: 'Active',
      };

      if (existingPass) {
        logger.info('Pass already exists, updating details', { passId: existingPass.passId });
        await prisma.pass.update({
          where: { id: existingPass.id },
          data: passData,
        });
        
        logger.info('Pass updated successfully', { 
          passId: existingPass.passId,
          userId: user.id 
        });
      } else {
        // Create new pass from KonfHub ticket
        const newPass = await prisma.pass.create({
          data: {
            userId: user.id,
            passType: ticketData.ticketType || ticketData.ticketName || ticketData.passType || 'General Pass',
            passId: ticketData.ticketNumber || `ESUMMIT-${Date.now()}`,
            bookingId: ticketData.ticketNumber || ticketData.bookingId || ticketId,
            konfhubTicketId: ticketId,
            konfhubOrderId: orderData.id || ticketData.orderId || null,
            ...passData,
          },
        });
        
        logger.info('Pass created successfully from KonfHub ticket', {
          passId: newPass.passId,
          userId: user.id,
          email: user.email,
          passType: newPass.passType,
        });
      }

      return res.status(200).json({ success: true, message: 'Pass created/updated successfully' });
    }

    // Handle order.cancelled event - CANCELLATION
    // Triggered when a user cancels their ticket/order
    if (event === 'order.cancelled' || event === 'ticket.cancelled' || event === 'registration.cancelled') {
      const orderData = payload.order || payload;
      const ticketData = payload.ticket || orderData;
      
      const orderId = orderData.id || orderData.orderId;
      const ticketId = ticketData.id || ticketData.ticketId;
      
      logger.info('Processing cancellation', { 
        orderId, 
        ticketId,
        email: ticketData.email || ticketData.customerEmail 
      });

      let cancelledCount = 0;

      // Cancel by order ID
      if (orderId) {
        const result = await prisma.pass.updateMany({
          where: { 
            konfhubOrderId: orderId,
            status: { not: 'Cancelled' } // Don't update already cancelled passes
          },
          data: { 
            status: 'Cancelled',
            ticketDetails: {
              ...(typeof payload === 'object' ? payload : {}),
              cancelledAt: new Date().toISOString(),
              cancellationReason: orderData.cancellationReason || 'Order cancelled',
            }
          },
        });
        cancelledCount += result.count;
        logger.info(`Cancelled ${result.count} pass(es) by order ID: ${orderId}`);
      }

      // Cancel by ticket ID
      if (ticketId && cancelledCount === 0) {
        const result = await prisma.pass.updateMany({
          where: { 
            konfhubTicketId: ticketId,
            status: { not: 'Cancelled' }
          },
          data: { 
            status: 'Cancelled',
            ticketDetails: {
              ...(typeof payload === 'object' ? payload : {}),
              cancelledAt: new Date().toISOString(),
            }
          },
        });
        cancelledCount += result.count;
        logger.info(`Cancelled ${result.count} pass(es) by ticket ID: ${ticketId}`);
      }

      if (cancelledCount === 0) {
        logger.warn('No passes found to cancel', { orderId, ticketId });
      }

      return res.status(200).json({ 
        success: true, 
        message: `Cancelled ${cancelledCount} pass(es)`,
        cancelledCount 
      });
    }

    // Handle payment.captured event
    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      
      // Find transaction by order ID
      const transaction = await prisma.transaction.findFirst({
        where: { konfhubOrderId: payment.order_id },
      });

      if (transaction && transaction.status === 'pending') {
        // Update transaction status
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            konfhubPaymentId: payment.id,
            status: 'completed',
            paymentMethod: payment.method,
            metadata: {
              ...((transaction.metadata as any) || {}),
              capturedAt: new Date().toISOString(),
              webhookProcessed: true,
            },
          },
        });

        logger.info(`Payment captured for order: ${payment.order_id}`);
      }
    }

    // Handle payment.failed event
    if (event === 'payment.failed') {
      const payment = payload.payment.entity;
      
      // Find transaction
      const transaction = await prisma.transaction.findFirst({
        where: { konfhubOrderId: payment.order_id },
      });

      if (transaction) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'failed',
            metadata: {
              ...((transaction.metadata as any) || {}),
              failedAt: new Date().toISOString(),
              failureReason: payment.error_description || 'Payment failed',
              webhookProcessed: true,
            },
          },
        });

        logger.warn(`Payment failed for order: ${payment.order_id}`);
      }
    }

    // Handle refund.processed event
    if (event === 'refund.processed') {
      const refund = payload.refund.entity;
      
      // Find transaction by payment ID
      const transaction = await prisma.transaction.findFirst({
        where: { konfhubPaymentId: refund.payment_id },
      });

      if (transaction) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'refunded',
            metadata: {
              ...((transaction.metadata as any) || {}),
              refundId: refund.id,
              refundedAt: new Date().toISOString(),
              refundAmount: refund.amount / 100, // Convert paise to rupees
              webhookProcessed: true,
            },
          },
        });

        // Cancel associated pass
        if (transaction.passId) {
          await prisma.pass.update({
            where: { id: transaction.passId },
            data: { status: 'Refunded' },
          });
        }

        logger.info(`Refund processed for payment: ${refund.payment_id}`);
      }
    }

    // Unknown/unhandled event - log and acknowledge
    logger.warn(`Unhandled KonfHub event: ${event}`, { 
      payload: JSON.stringify(payload).substring(0, 200) 
    });
    
    return res.status(200).json({ 
      success: true, 
      message: `Event '${event}' acknowledged but not processed` 
    });

  } catch (error: any) {
    logger.error('KonfHub webhook error:', { 
      error: error.message,
      stack: error.stack,
      event: req.body.event 
    });
    
    // Always return 200 to prevent webhook retries for application errors
    // KonfHub will retry on non-200 responses
    return res.status(200).json({ 
      success: false, 
      error: 'Internal error processing webhook',
      message: error.message 
    });
  }
});

export default router;
