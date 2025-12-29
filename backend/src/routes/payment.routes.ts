import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { generateQRCode } from '../services/qrcode.service';
import { generateUniqueIdentifiers } from '../utils/identifier.util';
import { paymentLimiter } from '../middleware/rateLimit.middleware';
import { konfhubService } from '../services/konfhub.service';

const router = Router();

// Apply payment rate limiter to all payment routes
router.use(paymentLimiter);

/**
 * Create KonfHub Order for Pass Purchase
 * POST /api/v1/payment/create-order
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      passType,
      price,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !passType || !price) {
      sendError(res, 'clerkUserId, passType, and price are required', 400);
      return;
    }

    // Validate price is positive
    if (price <= 0) {
      sendError(res, 'Invalid price amount', 400);
      return;
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true, email: true, fullName: true, phone: true },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Check if user already has a pass (ONE PASS PER USER LIMIT)
    const existingPass = await prisma.pass.findFirst({
      where: { userId: user.id },
    });

    if (existingPass) {
      sendError(
        res,
        'You already have a pass. Only one pass per user is allowed.',
        400
      );
      return;
    }

    // Generate unique identifiers
    const { invoiceNumber, transactionNumber } = generateUniqueIdentifiers();

    // Create KonfHub order
    const konfhubOrder = await konfhubService.createOrder({
      quantity: 1,
      customerInfo: {
        name: user.fullName || 'Guest',
        email: user.email || '',
        phone: user.phone || undefined,
      },
      metadata: {
        clerkUserId,
        passType,
        invoiceNumber,
        transactionNumber,
      },
    });

    // Create pending transaction in database
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        // passId will be set after pass creation in verify-and-create-pass
        invoiceNumber,
        transactionNumber,
        konfhubOrderId: konfhubOrder.orderId,
        konfhubTicketId: konfhubOrder.ticketId,
        amount: price,
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'konfhub',
        metadata: {
          passType,
          orderCreatedAt: new Date().toISOString(),
          checkoutUrl: konfhubOrder.checkoutUrl,
        },
      },
    });

    logger.info(`KonfHub order created: ${konfhubOrder.orderId} for user: ${clerkUserId}`);
    logger.info(`Invoice: ${invoiceNumber}, Transaction: ${transactionNumber}`);

    sendSuccess(
      res,
      'Order created successfully',
      {
        orderId: konfhubOrder.orderId,
        ticketId: konfhubOrder.ticketId,
        amount: price,
        currency: konfhubOrder.currency,
        transactionId: transaction.id,
        invoiceNumber,
        transactionNumber,
        checkoutUrl: konfhubOrder.checkoutUrl,
        paymentUrl: konfhubOrder.paymentUrl,
      },
      201
    );
  } catch (error: any) {
    logger.error('Create KonfHub order error:', error);
    sendError(res, error.message || 'Failed to create order', 500);
  }
});

/**
 * Verify Payment and Create Pass
 * POST /api/v1/payment/verify-and-create-pass
 */
router.post('/verify-and-create-pass', async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      ticketId,
      paymentId,
    } = req.body;

    // Validate required fields
    if (!orderId) {
      sendError(res, 'Order ID is required', 400);
      return;
    }

    // Verify order status with KonfHub
    const konfhubOrder = await konfhubService.getOrder(orderId);

    if (konfhubOrder.status !== 'completed') {
      logger.error('Payment not completed in KonfHub');
      
      // Update transaction status
      await prisma.transaction.updateMany({
        where: { konfhubOrderId: orderId },
        data: {
          status: 'failed',
          metadata: {
            error: 'Payment not completed',
            failedAt: new Date().toISOString(),
            konfhubStatus: konfhubOrder.status,
          },
        },
      });

      sendError(res, 'Payment verification failed - payment not completed', 400);
      return;
    }

    // Find the transaction
    const transaction = await prisma.transaction.findFirst({
      where: { konfhubOrderId: orderId },
      include: { user: true },
    });

    if (!transaction) {
      sendError(res, 'Transaction not found', 404);
      return;
    }

    // Check if transaction is already completed
    if (transaction.status === 'completed') {
      sendError(res, 'This payment has already been processed', 400);
      return;
    }

    // Check if user already has a pass (double-check to prevent race conditions)
    const existingPass = await prisma.pass.findFirst({
      where: { userId: transaction.userId },
    });

    if (existingPass) {
      // Mark transaction for manual review
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'refund_pending',
          metadata: {
            error: 'User already has a pass',
            needsRefund: true,
            refundReason: 'Duplicate purchase attempt',
          },
        },
      });

      sendError(
        res,
        'You already have a pass. This payment will be refunded.',
        400
      );
      return;
    }

    // Get pass details from transaction metadata
    const metadata = transaction.metadata as any;
    const passType = metadata.passType;

    // Generate unique pass ID
    const { passId } = generateUniqueIdentifiers();

    // Generate QR code
    const qrCodeUrl = await generateQRCode(passId);

    // Create pass and update transaction in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the pass
      const pass = await tx.pass.create({
        data: {
          userId: transaction.userId,
          passType,
          passId,
          price: transaction.amount,
          status: 'Active',
          qrCodeUrl,
        },
      });

      // Update transaction with payment details and link to pass
      const updatedTransaction = await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          passId: pass.id,
          konfhubTicketId: ticketId || transaction.konfhubTicketId,
          konfhubPaymentId: paymentId,
          status: 'completed',
          metadata: {
            ...metadata,
            completedAt: new Date().toISOString(),
            passId: pass.passId,
          },
        },
      });

      return { pass, transaction: updatedTransaction };
    });

    logger.info(
      `✅ Payment verified and pass created: ${passId} for user: ${transaction.user.email}`
    );

    sendSuccess(
      res,
      'Payment verified and pass created successfully',
      {
        pass: result.pass,
        transaction: result.transaction,
      },
      201
    );
  } catch (error: any) {
    logger.error('Payment verification error:', error);
    sendError(res, error.message || 'Failed to verify payment', 500);
  }
});

/**
 * Handle Payment Failure
 * POST /api/v1/payment/payment-failed
 */
router.post('/payment-failed', async (req: Request, res: Response) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      sendError(res, 'Order ID is required', 400);
      return;
    }

    // Update transaction status to failed
    const transaction = await prisma.transaction.findFirst({
      where: { konfhubOrderId: orderId },
    });

    if (!transaction) {
      sendError(res, 'Transaction not found', 404);
      return;
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'failed',
        metadata: {
          ...((transaction.metadata as any) || {}),
          error: error || 'Payment cancelled by user',
          failedAt: new Date().toISOString(),
        },
      },
    });

    logger.warn(`Payment failed for order: ${orderId}`);

    sendSuccess(res, 'Payment failure recorded', { transactionId: transaction.id });
  } catch (error: any) {
    logger.error('Payment failure handler error:', error);
    sendError(res, error.message || 'Failed to record payment failure', 500);
  }
});

/**
 * KonfHub Webhook Handler
 * POST /api/v1/payment/webhook
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-konfhub-signature'] as string;
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    const isValid = konfhubService.verifyWebhookSignature(payload, signature);

    if (!isValid) {
      logger.error('Invalid KonfHub webhook signature');
      sendError(res, 'Invalid signature', 401);
      return;
    }

    const webhookData = req.body;
    const { event, orderId, ticketId, paymentId } = webhookData;

    logger.info(`KonfHub webhook received: ${event} for order: ${orderId}`);

    // Find transaction
    const transaction = await prisma.transaction.findFirst({
      where: { konfhubOrderId: orderId },
      include: { user: true },
    });

    if (!transaction) {
      logger.warn(`Transaction not found for webhook order: ${orderId}`);
      sendSuccess(res, 'Webhook received but transaction not found');
      return;
    }

    // Handle different webhook events
    switch (event) {
      case 'order.completed':
        if (transaction.status !== 'completed') {
          // Automatically create pass when payment is completed
          const metadata = transaction.metadata as any;
          const passType = metadata.passType;
          const { passId } = generateUniqueIdentifiers();
          const qrCodeUrl = await generateQRCode(passId);

          await prisma.$transaction(async (tx) => {
            const pass = await tx.pass.create({
              data: {
                userId: transaction.userId,
                passType,
                passId,
                price: transaction.amount,
                hasWorkshopAccess: metadata.hasWorkshopAccess || false,
                status: 'Active',
                qrCodeUrl,
              },
            });

            await tx.transaction.update({
              where: { id: transaction.id },
              data: {
                passId: pass.id,
                konfhubTicketId: ticketId,
                konfhubPaymentId: paymentId,
                status: 'completed',
                metadata: {
                  ...metadata,
                  completedAt: new Date().toISOString(),
                  passId: pass.passId,
                  webhookProcessed: true,
                },
              },
            });
          });

          logger.info(`✅ Pass auto-created via webhook for order: ${orderId}`);
        }
        break;

      case 'order.cancelled':
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'cancelled',
            metadata: {
              ...((transaction.metadata as any) || {}),
              cancelledAt: new Date().toISOString(),
              webhookProcessed: true,
            },
          },
        });
        logger.info(`Order cancelled via webhook: ${orderId}`);
        break;

      case 'ticket.issued':
        // Update ticket information
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            konfhubTicketId: ticketId,
            metadata: {
              ...((transaction.metadata as any) || {}),
              ticketIssuedAt: new Date().toISOString(),
              webhookProcessed: true,
            },
          },
        });
        logger.info(`Ticket issued via webhook: ${ticketId} for order: ${orderId}`);
        break;

      default:
        logger.warn(`Unhandled webhook event: ${event}`);
    }

    sendSuccess(res, 'Webhook processed successfully');
  } catch (error: any) {
    logger.error('Webhook processing error:', error);
    sendError(res, error.message || 'Failed to process webhook', 500);
  }
});

/**
 * Get Transaction Status
 * GET /api/v1/payment/transaction/:transactionId
 */
router.get('/transaction/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
        pass: {
          select: {
            passId: true,
            passType: true,
            status: true,
            qrCodeUrl: true,
          },
        },
      },
    });

    if (!transaction) {
      sendError(res, 'Transaction not found', 404);
      return;
    }

    sendSuccess(res, 'Transaction details fetched successfully', { transaction });
  } catch (error: any) {
    logger.error('Get transaction error:', error);
    sendError(res, error.message || 'Failed to fetch transaction', 500);
  }
});

/**
 * Cancel Order
 * POST /api/v1/payment/cancel
 */
router.post('/cancel', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      sendError(res, 'Transaction ID is required', 400);
      return;
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { pass: true },
    });

    if (!transaction) {
      sendError(res, 'Transaction not found', 404);
      return;
    }

    if (transaction.status === 'completed') {
      sendError(res, 'Cannot cancel completed transactions. Request a refund instead.', 400);
      return;
    }

    if (!transaction.konfhubOrderId) {
      sendError(res, 'KonfHub order ID not found', 400);
      return;
    }

    // Cancel order in KonfHub
    await konfhubService.cancelOrder(transaction.konfhubOrderId);

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'cancelled',
        metadata: {
          ...((transaction.metadata as any) || {}),
          cancelledAt: new Date().toISOString(),
        },
      },
    });

    logger.info(`Order cancelled for transaction: ${transactionId}`);

    sendSuccess(res, 'Order cancelled successfully');
  } catch (error: any) {
    logger.error('Cancel order error:', error);
    sendError(res, error.message || 'Failed to cancel order', 500);
  }
});

/**
 * Get all transactions for a user
 * GET /api/v1/payment/user/:clerkUserId/transactions
 */
router.get('/user/:clerkUserId/transactions', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Get all transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        pass: {
          select: {
            passId: true,
            passType: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    sendSuccess(res, 'Transactions fetched successfully', { transactions });
  } catch (error: any) {
    logger.error('Get user transactions error:', error);
    sendError(res, error.message || 'Failed to fetch transactions', 500);
  }
});

export default router;
