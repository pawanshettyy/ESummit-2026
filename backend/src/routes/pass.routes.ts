import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { generateQRCode } from '../services/qrcode.service';
import { generateUniqueIdentifiers } from '../utils/identifier.util';
import {
  canUpgradePass,
  getUpgradeOptions,
  upgradePass,
  getUpgradeHistory,
  isValidUpgrade,
  calculateUpgradeFee,
} from '../services/pass-upgrade.service';

const router = Router();

/**
 * Get all passes for a user by Clerk ID
 * GET /api/v1/passes/user/:clerkUserId
 */
router.get('/user/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;

    // First, find the user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Get all passes for this user
    const passes = await prisma.pass.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        passId: true,
        passType: true,
        bookingId: true,
        status: true,
        qrCodeUrl: true,
        qrCodeData: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    sendSuccess(res, 'Passes fetched successfully', { passes });
  } catch (error: any) {
    logger.error('Get user passes error:', error);
    sendError(res, error.message || 'Failed to fetch passes', 500);
  }
});

/**
 * Get single pass details by pass ID
 * GET /api/v1/passes/:passId
 */
router.get('/:passId', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;

    const pass = await prisma.pass.findUnique({
      where: { passId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
          },
        },
        transaction: true,
      },
    });

    if (!pass) {
      sendError(res, 'Pass not found', 404);
      return;
    }

    sendSuccess(res, 'Pass details fetched successfully', { pass });
  } catch (error: any) {
    logger.error('Get pass details error:', error);
    sendError(res, error.message || 'Failed to fetch pass details', 500);
  }
});

/**
 * Create a new pass (without payment - for testing/manual creation)
 * POST /api/v1/passes/create
 * 
 * WARNING: This endpoint bypasses payment verification.
 * For production, use /api/v1/payment/create-order and /api/v1/payment/verify-and-create-pass
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      passType,
      price,
      hasMeals = false,
      hasMerchandise = false,
      hasWorkshopAccess = false,
      konfhubData,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !passType || !price) {
      sendError(res, 'clerkUserId, passType, and price are required', 400);
      return;
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true, email: true },
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
      sendError(res, 'You already have a pass. Only one pass per user is allowed.', 400);
      return;
    }

    // Check if there's a pending/completed transaction for this user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        status: {
          in: ['pending', 'completed'],
        },
      },
    });

    if (existingTransaction) {
      if (existingTransaction.status === 'pending') {
        sendError(
          res,
          'You have a pending payment. Please complete or cancel it first.',
          400
        );
        return;
      }
      if (existingTransaction.status === 'completed') {
        sendError(res, 'You already have a completed purchase.', 400);
        return;
      }
    }

    // Generate unique pass ID
    const { passId, invoiceNumber, transactionNumber } = generateUniqueIdentifiers();

    // Generate QR code for the pass
    const qrCodeUrl = await generateQRCode(passId);

    // Create pass
    const pass = await prisma.pass.create({
      data: {
        userId: user.id,
        passType,
        passId,
        price,
        hasMeals,
        hasMerchandise,
        hasWorkshopAccess,
        status: 'Active',
        qrCodeUrl, // Store QR code data URL
      },
    });

    // Create a transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        passId: pass.id,
        // @ts-ignore - These fields will exist after migration
        invoiceNumber,
        // @ts-ignore - These fields will exist after migration
        transactionNumber,
        amount: price,
        currency: 'INR',
        status: 'completed',
        paymentMethod: konfhubData ? 'konfhub' : 'manual',
        konfhubOrderId: konfhubData?.orderId || null,
        konfhubTicketId: konfhubData?.ticketId || null,
        konfhubPaymentId: konfhubData?.paymentId || null,
        metadata: {
          note: konfhubData ? 'Pass purchased via KonfHub' : 'Manually created pass (test/demo)',
          createdVia: konfhubData ? 'konfhub_widget' : 'direct_api_call',
          konfhubData: konfhubData || null,
        },
      },
    });

    logger.info(`⚠️  Manual pass created: ${passId} for user: ${user.email} (TESTING MODE)`);
    logger.info(`Invoice: ${invoiceNumber}, Transaction: ${transactionNumber}`);

    sendSuccess(
      res,
      'Pass created successfully',
      { pass, transaction },
      201
    );
  } catch (error: any) {
    logger.error('Create pass error:', error);
    sendError(res, error.message || 'Failed to create pass', 500);
  }
});

/**
 * Get pass statistics for a user
 * GET /api/v1/passes/stats/:clerkUserId
 */
router.get('/stats/:clerkUserId', async (req: Request, res: Response) => {
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

    // Get statistics
    const [totalPasses, activePasses, totalSpent] = await Promise.all([
      prisma.pass.count({
        where: { userId: user.id },
      }),
      prisma.pass.count({
        where: { userId: user.id, status: 'Active' },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          status: 'completed',
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    sendSuccess(res, 'Statistics fetched successfully', {
      stats: {
        totalPasses,
        activePasses,
        totalSpent: totalSpent._sum.amount || 0,
      },
    });
  } catch (error: any) {
    logger.error('Get pass statistics error:', error);
    sendError(res, error.message || 'Failed to fetch statistics', 500);
  }
});

/**
 * Check upgrade eligibility for a pass
 * GET /api/v1/passes/:passId/upgrade/eligibility
 */
router.get('/:passId/upgrade/eligibility', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;

    const eligibility = await canUpgradePass(passId);

    if (!eligibility.canUpgrade) {
      sendSuccess(res, eligibility.reason || 'Cannot upgrade pass', {
        canUpgrade: false,
        reason: eligibility.reason,
      });
      return;
    }

    const upgradeOptions = getUpgradeOptions(eligibility.currentPass.passType);

    sendSuccess(res, 'Upgrade options available', {
      canUpgrade: true,
      currentPass: {
        passId: eligibility.currentPass.passId,
        passType: eligibility.currentPass.passType,
        price: eligibility.currentPass.price,
      },
      upgradeOptions,
    });
  } catch (error: any) {
    logger.error('Check upgrade eligibility error:', error);
    sendError(res, error.message || 'Failed to check upgrade eligibility', 500);
  }
});

/**
 * Get upgrade history for a pass
 * GET /api/v1/passes/:passId/upgrade/history
 */
router.get('/:passId/upgrade/history', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;

    const history = await getUpgradeHistory(passId);

    sendSuccess(res, 'Upgrade history fetched successfully', { history });
  } catch (error: any) {
    logger.error('Get upgrade history error:', error);
    sendError(res, error.message || 'Failed to fetch upgrade history', 500);
  }
});

/**
 * Initiate pass upgrade (create upgrade order)
 * POST /api/v1/passes/:passId/upgrade/initiate
 * Body: { newPassType: string }
 * @deprecated This route uses legacy Razorpay integration. KonfHub now handles all pass purchases and upgrades.
 */
router.post('/:passId/upgrade/initiate', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;
    const { newPassType } = req.body;

    if (!newPassType) {
      sendError(res, 'New pass type is required', 400);
      return;
    }

    // Check eligibility
    const eligibility = await canUpgradePass(passId);

    if (!eligibility.canUpgrade) {
      sendError(res, eligibility.reason || 'Cannot upgrade pass', 400);
      return;
    }

    const currentPass = eligibility.currentPass;

    // Validate upgrade path
    if (!isValidUpgrade(currentPass.passType, newPassType)) {
      sendError(res, 'Invalid upgrade path. Can only upgrade to higher tier.', 400);
      return;
    }

    // Calculate upgrade fee
    const upgradeFee = calculateUpgradeFee(currentPass.passType, newPassType);

    if (upgradeFee <= 0) {
      sendError(res, 'Invalid upgrade fee', 400);
      return;
    }

    // Create Razorpay order
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { invoiceNumber, transactionNumber } = generateUniqueIdentifiers();

    const razorpayOrder = await razorpay.orders.create({
      amount: upgradeFee * 100, // Convert to paise
      currency: 'INR',
      receipt: transactionNumber,
      notes: {
        passId: currentPass.passId,
        userId: currentPass.userId,
        upgradeFrom: currentPass.passType,
        upgradeTo: newPassType,
        type: 'upgrade',
      },
    });

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: currentPass.userId,
        passId: currentPass.id,
        konfhubOrderId: razorpayOrder.id,
        amount: upgradeFee,
        currency: 'INR',
        status: 'pending',
        invoiceNumber,
        transactionNumber,
        transactionType: 'upgrade',
        metadata: {
          upgradeFrom: currentPass.passType,
          upgradeTo: newPassType,
          upgradeFee,
        },
      },
    });

    logger.info(`Upgrade order created for pass ${passId}: ${currentPass.passType} → ${newPassType}`);

    sendSuccess(res, 'Upgrade order created successfully', {
      orderId: razorpayOrder.id,
      amount: upgradeFee,
      currency: 'INR',
      transactionId: transaction.id,
      upgradeDetails: {
        from: currentPass.passType,
        to: newPassType,
        upgradeFee,
      },
    });
  } catch (error: any) {
    logger.error('Initiate upgrade error:', error);
    sendError(res, error.message || 'Failed to initiate upgrade', 500);
  }
});

/**
 * Complete pass upgrade after payment
 * POST /api/v1/passes/:passId/upgrade/complete
 * Body: { transactionId, razorpayPaymentId, razorpaySignature, newPassType }
 * @deprecated This route uses legacy Razorpay integration. KonfHub now handles all pass purchases and upgrades.
 */
router.post('/:passId/upgrade/complete', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;
    const { transactionId, razorpayPaymentId, razorpaySignature, newPassType } = req.body;

    if (!transactionId || !razorpayPaymentId || !razorpaySignature || !newPassType) {
      sendError(res, 'Missing required payment details', 400);
      return;
    }

    // Verify transaction exists and is pending
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        pass: true,
      },
    });

    if (!transaction) {
      sendError(res, 'Transaction not found', 404);
      return;
    }

    if (transaction.status !== 'pending') {
      sendError(res, 'Transaction already processed', 400);
      return;
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        konfhubPaymentId: razorpayPaymentId,
        status: 'completed',
        paymentMethod: 'konfhub',
      },
    });

    // Process upgrade
    const upgradeResult = await upgradePass(passId, newPassType, transactionId);

    if (!upgradeResult.success) {
      sendError(res, upgradeResult.error || 'Failed to upgrade pass', 500);
      return;
    }

    // Fetch updated pass with full details
    const updatedPass = await prisma.pass.findUnique({
      where: { passId },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    logger.info(`Pass upgrade completed: ${passId} upgraded to ${newPassType}`);

    sendSuccess(res, 'Pass upgraded successfully', {
      pass: updatedPass,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: 'completed',
      },
    });
  } catch (error: any) {
    logger.error('Complete upgrade error:', error);
    sendError(res, error.message || 'Failed to complete upgrade', 500);
  }
});

export default router;
