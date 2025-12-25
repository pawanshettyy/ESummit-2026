import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import multer from 'multer';
import { generateQRCode } from '../services/qrcode.service';
import { generateUniqueIdentifiers } from '../utils/identifier.util';

const router = Router();

// Configure multer for PDF upload (in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  },
});

// 32 hours in milliseconds
const CLAIM_EXPIRY_HOURS = 32;
const CLAIM_EXPIRY_MS = CLAIM_EXPIRY_HOURS * 60 * 60 * 1000;

/**
 * Submit a pass claim with manual details
 * POST /api/v1/pass-claims/submit
 */
router.post('/submit', upload.single('ticketFile'), async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      email,
      fullName,
      passType,
      bookingId,
      konfhubOrderId,
      ticketNumber,
      qrCodeData,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !email) {
      sendError(res, 'clerkUserId and email are required', 400);
      return;
    }

    if (!bookingId && !konfhubOrderId && !ticketNumber) {
      sendError(res, 'At least one identifier (bookingId, konfhubOrderId, or ticketNumber) is required', 400);
      return;
    }

    // Check if user already has an active pass
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (user) {
      const existingPass = await prisma.pass.findFirst({
        where: { userId: user.id, status: 'Active' },
      });

      if (existingPass) {
        sendError(res, 'You already have an active pass', 400);
        return;
      }
    }

    // Check for existing pending claim with same booking ID
    if (bookingId) {
      const existingClaim = await prisma.pendingPassClaim.findFirst({
        where: {
          clerkUserId,
          bookingId,
          status: 'pending',
        },
      });

      if (existingClaim) {
        sendSuccess(res, 'You already have a pending claim for this booking', {
          claim: existingClaim,
          message: 'Please wait while we verify your pass. Check back later for updates.',
        });
        return;
      }
    }

    // Calculate expiry time (32 hours from now)
    const expiresAt = new Date(Date.now() + CLAIM_EXPIRY_MS);

    // Extract data from uploaded file if present
    let extractedData: any = {};
    if (req.file) {
      // For now, store file info - actual PDF parsing would require pdf-parse library
      extractedData = {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date().toISOString(),
      };
      logger.info(`File uploaded for pass claim: ${req.file.originalname}`);
    }

    // Create pending claim
    const claim = await prisma.pendingPassClaim.create({
      data: {
        clerkUserId,
        email,
        fullName: fullName || null,
        passType: passType || 'Unknown',
        bookingId: bookingId || null,
        konfhubOrderId: konfhubOrderId || null,
        ticketNumber: ticketNumber || null,
        qrCodeData: qrCodeData || null,
        extractedData,
        status: 'pending',
        expiresAt,
      },
    });

    // Immediately try to verify against database
    const verificationResult = await verifyClaimAgainstDatabase(claim);

    if (verificationResult.verified) {
      // Pass found in database - create the pass for user
      sendSuccess(res, 'Pass verified successfully!', {
        claim: { ...claim, status: 'verified' },
        pass: verificationResult.pass,
        message: 'Your pass has been verified and added to your account.',
      }, 201);
    } else {
      sendSuccess(res, 'Pass claim submitted successfully', {
        claim,
        message: `Your claim is being processed. Please check back within ${CLAIM_EXPIRY_HOURS} hours for updates. If we cannot verify your pass within this time, the claim will expire.`,
        expiresAt: expiresAt.toISOString(),
        hoursRemaining: CLAIM_EXPIRY_HOURS,
      }, 201);
    }
  } catch (error: any) {
    logger.error('Submit pass claim error:', error);
    sendError(res, error.message || 'Failed to submit pass claim', 500);
  }
});

/**
 * Get all pending claims for a user
 * GET /api/v1/pass-claims/user/:clerkUserId
 */
router.get('/user/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;

    // Clean up expired claims first
    await cleanupExpiredClaims(clerkUserId);

    const claims = await prisma.pendingPassClaim.findMany({
      where: {
        clerkUserId,
        status: { in: ['pending', 'verified'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Re-verify pending claims
    const updatedClaims = await Promise.all(
      claims.map(async (claim) => {
        if (claim.status === 'pending') {
          const result = await verifyClaimAgainstDatabase(claim);
          if (result.verified) {
            return { ...claim, status: 'verified', pass: result.pass };
          }
        }
        return claim;
      })
    );

    sendSuccess(res, 'Claims fetched successfully', { claims: updatedClaims });
  } catch (error: any) {
    logger.error('Get user claims error:', error);
    sendError(res, error.message || 'Failed to fetch claims', 500);
  }
});

/**
 * Check claim status
 * GET /api/v1/pass-claims/:claimId/status
 */
router.get('/:claimId/status', async (req: Request, res: Response) => {
  try {
    const { claimId } = req.params;

    const claim = await prisma.pendingPassClaim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      sendError(res, 'Claim not found', 404);
      return;
    }

    // Check if expired
    if (claim.status === 'pending' && new Date() > claim.expiresAt) {
      await prisma.pendingPassClaim.update({
        where: { id: claimId },
        data: { status: 'expired' },
      });
      
      sendSuccess(res, 'Claim has expired', {
        claim: { ...claim, status: 'expired' },
        message: 'Your claim has expired after 32 hours. Please try again or contact support.',
      });
      return;
    }

    // Re-verify if still pending
    if (claim.status === 'pending') {
      const result = await verifyClaimAgainstDatabase(claim);
      if (result.verified) {
        sendSuccess(res, 'Pass verified!', {
          claim: { ...claim, status: 'verified' },
          pass: result.pass,
          message: 'Your pass has been verified and added to your account!',
        });
        return;
      }
    }

    // Calculate time remaining
    const hoursRemaining = Math.max(0, 
      Math.round((claim.expiresAt.getTime() - Date.now()) / (60 * 60 * 1000))
    );

    sendSuccess(res, 'Claim status retrieved', {
      claim,
      hoursRemaining,
      message: claim.status === 'pending' 
        ? `Still verifying. ${hoursRemaining} hours remaining before expiry.`
        : claim.status === 'verified'
        ? 'Your pass has been verified!'
        : 'Claim status: ' + claim.status,
    });
  } catch (error: any) {
    logger.error('Check claim status error:', error);
    sendError(res, error.message || 'Failed to check claim status', 500);
  }
});

/**
 * Cancel a pending claim
 * DELETE /api/v1/pass-claims/:claimId
 */
router.delete('/:claimId', async (req: Request, res: Response) => {
  try {
    const { claimId } = req.params;
    const { clerkUserId } = req.body;

    const claim = await prisma.pendingPassClaim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      sendError(res, 'Claim not found', 404);
      return;
    }

    if (claim.clerkUserId !== clerkUserId) {
      sendError(res, 'Unauthorized', 403);
      return;
    }

    if (claim.status !== 'pending') {
      sendError(res, 'Can only cancel pending claims', 400);
      return;
    }

    await prisma.pendingPassClaim.delete({
      where: { id: claimId },
    });

    sendSuccess(res, 'Claim cancelled successfully');
  } catch (error: any) {
    logger.error('Cancel claim error:', error);
    sendError(res, error.message || 'Failed to cancel claim', 500);
  }
});

/**
 * Verify claim against database and create pass if found
 */
async function verifyClaimAgainstDatabase(claim: any): Promise<{ verified: boolean; pass?: any }> {
  try {
    // Search for matching pass in database by various identifiers
    let existingPass = null;

    // Try to find by booking ID
    if (claim.bookingId) {
      existingPass = await prisma.pass.findFirst({
        where: {
          OR: [
            { bookingId: claim.bookingId },
            { konfhubOrderId: claim.bookingId },
            { passId: claim.bookingId },
          ],
        },
      });
    }

    // Try by konfhub order ID
    if (!existingPass && claim.konfhubOrderId) {
      existingPass = await prisma.pass.findFirst({
        where: { konfhubOrderId: claim.konfhubOrderId },
      });
    }

    // Try by ticket number in pass ID
    if (!existingPass && claim.ticketNumber) {
      existingPass = await prisma.pass.findFirst({
        where: {
          OR: [
            { passId: { contains: claim.ticketNumber } },
            { bookingId: { contains: claim.ticketNumber } },
          ],
        },
      });
    }

    // Try by QR code data
    if (!existingPass && claim.qrCodeData) {
      existingPass = await prisma.pass.findFirst({
        where: { qrCodeData: claim.qrCodeData },
      });
    }

    if (existingPass) {
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { clerkUserId: claim.clerkUserId },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            clerkUserId: claim.clerkUserId,
            email: claim.email,
            fullName: claim.fullName,
          },
        });
      }

      // Check if this pass is already assigned to another user
      if (existingPass.userId !== user.id) {
        // Check if the email matches
        const passOwner = await prisma.user.findUnique({
          where: { id: existingPass.userId },
          select: { email: true },
        });

        if (passOwner?.email?.toLowerCase() !== claim.email.toLowerCase()) {
          // Different user - don't transfer
          logger.warn(`Pass ${existingPass.passId} belongs to different user`);
          return { verified: false };
        }

        // Same email, different clerk ID - update pass ownership
        await prisma.pass.update({
          where: { id: existingPass.id },
          data: { userId: user.id },
        });
      }

      // Update claim status
      await prisma.pendingPassClaim.update({
        where: { id: claim.id },
        data: {
          status: 'verified',
          verifiedAt: new Date(),
        },
      });

      return { verified: true, pass: existingPass };
    }

    return { verified: false };
  } catch (error) {
    logger.error('Verify claim error:', error);
    return { verified: false };
  }
}

/**
 * Clean up expired claims for a user
 */
async function cleanupExpiredClaims(clerkUserId: string): Promise<void> {
  try {
    await prisma.pendingPassClaim.updateMany({
      where: {
        clerkUserId,
        status: 'pending',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'expired' },
    });
  } catch (error) {
    logger.error('Cleanup expired claims error:', error);
  }
}

/**
 * Global cleanup job - run periodically to expire old claims
 * POST /api/v1/pass-claims/cleanup (admin only)
 */
router.post('/cleanup', async (req: Request, res: Response) => {
  try {
    const result = await prisma.pendingPassClaim.updateMany({
      where: {
        status: 'pending',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'expired' },
    });

    logger.info(`Cleaned up ${result.count} expired pass claims`);
    sendSuccess(res, `Cleaned up ${result.count} expired claims`, { count: result.count });
  } catch (error: any) {
    logger.error('Global cleanup error:', error);
    sendError(res, error.message || 'Failed to cleanup claims', 500);
  }
});

export default router;
