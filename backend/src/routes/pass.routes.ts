import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';

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
          note: konfhubData ? 'Pass purchased via KonfHub' : 'Manual pass creation',
          createdVia: konfhubData ? 'konfhub_widget' : 'direct_api_call',
          konfhubData: konfhubData || null,
        },
      },
    });

    logger.info(`Manual pass created: ${passId} for user: ${user.email}`);
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

// Note: Pass purchases are handled through KonfHub.
// Pass upgrades can be done at the venue during check-in.
// Contact the registration desk for upgrade assistance.

export default router;
