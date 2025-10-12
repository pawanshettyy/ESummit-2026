import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { generateQRCode } from '../services/qrcode.service';
import { generateUniqueIdentifiers } from '../utils/identifier.util';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = Router();

// Initialize Razorpay (ensure env variables are set)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
});

/**
 * Create Razorpay Order
 * POST /api/v1/payment/create-order
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      passType,
      price,
      hasMeals = false,
      hasMerchandise = false,
      hasWorkshopAccess = false,
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
      select: { id: true, email: true, fullName: true },
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

    // Convert price to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(price * 100);

    // Generate unique identifiers
    const { invoiceNumber, transactionNumber } = generateUniqueIdentifiers();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        clerkUserId,
        passType,
        hasMeals: String(hasMeals),
        hasMerchandise: String(hasMerchandise),
        hasWorkshopAccess: String(hasWorkshopAccess),
        email: user.email || '',
        name: user.fullName || '',
      },
    });

    // Create pending transaction in database
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        // passId will be set after pass creation in verify-and-create-pass
        invoiceNumber,
        transactionNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: price,
        currency: 'INR',
        status: 'pending',
        metadata: {
          passType,
          hasMeals,
          hasMerchandise,
          hasWorkshopAccess,
          orderCreatedAt: new Date().toISOString(),
        },
      },
    });

    logger.info(`Razorpay order created: ${razorpayOrder.id} for user: ${clerkUserId}`);
    logger.info(`Invoice: ${invoiceNumber}, Transaction: ${transactionNumber}`);

    sendSuccess(
      res,
      'Order created successfully',
      {
        orderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: razorpayOrder.currency,
        transactionId: transaction.id,
        invoiceNumber,
        transactionNumber,
      },
      201
    );
  } catch (error: any) {
    logger.error('Create Razorpay order error:', error);
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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      sendError(res, 'Payment verification details are missing', 400);
      return;
    }

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Payment verification failed
      logger.error('Payment signature verification failed');
      
      // Update transaction status to failed
      await prisma.transaction.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: 'failed',
          metadata: {
            error: 'Signature verification failed',
            failedAt: new Date().toISOString(),
          },
        },
      });

      sendError(res, 'Payment verification failed', 400);
      return;
    }

    // Find the transaction
    const transaction = await prisma.transaction.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
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
      // Refund the payment or mark for manual review
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
    const hasMeals = metadata.hasMeals === true || metadata.hasMeals === 'true';
    const hasMerchandise = metadata.hasMerchandise === true || metadata.hasMerchandise === 'true';
    const hasWorkshopAccess = metadata.hasWorkshopAccess === true || metadata.hasWorkshopAccess === 'true';

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
          hasMeals,
          hasMerchandise,
          hasWorkshopAccess,
          status: 'Active',
          qrCodeUrl,
        },
      });

      // Update transaction with payment details and link to pass
      const updatedTransaction = await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          passId: pass.id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
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
    const { razorpay_order_id, error } = req.body;

    if (!razorpay_order_id) {
      sendError(res, 'Order ID is required', 400);
      return;
    }

    // Update transaction status to failed
    const transaction = await prisma.transaction.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
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

    logger.warn(`Payment failed for order: ${razorpay_order_id}`);

    sendSuccess(res, 'Payment failure recorded', { transactionId: transaction.id });
  } catch (error: any) {
    logger.error('Payment failure handler error:', error);
    sendError(res, error.message || 'Failed to record payment failure', 500);
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
 * Initiate Refund
 * POST /api/v1/payment/refund
 * Admin only
 */
router.post('/refund', async (req: Request, res: Response) => {
  try {
    const { transactionId, reason } = req.body;

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

    if (transaction.status !== 'completed') {
      sendError(res, 'Only completed transactions can be refunded', 400);
      return;
    }

    if (!transaction.razorpayPaymentId) {
      sendError(res, 'Razorpay payment ID not found', 400);
      return;
    }

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(transaction.razorpayPaymentId, {
      amount: Math.round(Number(transaction.amount) * 100), // Convert to paise
      notes: {
        reason: reason || 'User requested refund',
        transactionId: transaction.id,
      },
    });

    // Update transaction and pass status
    await prisma.$transaction(async (tx) => {
      // Update transaction
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: 'refunded',
          metadata: {
            ...((transaction.metadata as any) || {}),
            refundId: refund.id,
            refundedAt: new Date().toISOString(),
            refundReason: reason,
          },
        },
      });

      // Cancel the pass if it exists
      if (transaction.pass) {
        await tx.pass.update({
          where: { id: transaction.pass.id },
          data: { status: 'Refunded' },
        });
      }
    });

    logger.info(`Refund initiated for transaction: ${transactionId}, Refund ID: ${refund.id}`);

    sendSuccess(res, 'Refund initiated successfully', { refund });
  } catch (error: any) {
    logger.error('Refund error:', error);
    sendError(res, error.message || 'Failed to initiate refund', 500);
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
