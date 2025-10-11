import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { generateQRCode } from '../services/qrcode.service';

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
        price: true,
        purchaseDate: true,
        status: true,
        hasMeals: true,
        hasMerchandise: true,
        hasWorkshopAccess: true,
        qrCodeUrl: true,
        createdAt: true,
        transaction: {
          select: {
            id: true,
            amount: true,
            status: true,
            razorpayPaymentId: true,
          },
        },
      },
      orderBy: {
        purchaseDate: 'desc',
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
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !passType || !price) {
      sendError(res, 'clerkUserId, passType, and price are required', 400);
      return;
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
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

    // Generate unique pass ID
    const passId = `ESUMMIT-2025-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

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

    // Create a transaction record (marked as manual/test)
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        passId: pass.id,
        amount: price,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'manual',
        metadata: {
          note: 'Manually created pass (test/demo)',
        },
      },
    });

    logger.info(`Manual pass created: ${passId} for user: ${clerkUserId}`);

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

export default router;
