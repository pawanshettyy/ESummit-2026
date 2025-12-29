
import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendError, sendSuccess } from '../utils/response.util';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger.util';

const router = Router();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/passes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, _file, cb) => {
    // Generate filename: ESUMMIT-2026-{passId}.pdf
    const passId = req.body.passId || `UNKNOWN-${Date.now()}`;
    cb(null, `ESUMMIT-2026-${passId}.pdf`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * Upload PDF ticket from KonfHub
 * POST /api/v1/passes/upload
 */
router.post('/upload', upload.single('pdf'), async (req: Request, res: Response) => {
  try {
    const { passId, userId, passType, konfhubOrderId, konfhubTicketId } = req.body;

    if (!req.file) {
      sendError(res, 'PDF file is required', 400);
      return;
    }

    if (!passId || !userId) {
      sendError(res, 'passId and userId are required', 400);
      return;
    }

    // Check if pass already exists
    const existingPass = await prisma.pass.findUnique({
      where: { passId }
    });

    if (existingPass) {
      // Update existing pass with PDF path
      await prisma.pass.update({
        where: { passId },
        data: {
          pdfUrl: `/uploads/passes/${req.file.filename}`,
          konfhubOrderId,
          konfhubTicketId,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new pass record
      await prisma.pass.create({
        data: {
          userId,
          passType: passType || 'Standard',
          passId,
          status: 'Active',
          pdfUrl: `/uploads/passes/${req.file.filename}`,
          konfhubOrderId,
          konfhubTicketId
        }
      });
    }

    sendSuccess(res, 'PDF uploaded successfully', {
      passId,
      pdfUrl: `/uploads/passes/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (error: any) {
    logger.error('PDF upload error:', error);
    sendError(res, error.message || 'Failed to upload PDF', 500);
  }
});

/**
 * Get user's passes with PDF URLs
 * GET /api/v1/passes/user/:clerkUserId
 */
router.get('/user/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true }
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Get user's passes
    const passes = await prisma.pass.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        passId: true,
        passType: true,
        status: true,
        pdfUrl: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    sendSuccess(res, 'Passes retrieved successfully', { passes });
  } catch (error: any) {
    logger.error('Get user passes error:', error);
    sendError(res, error.message || 'Failed to retrieve passes', 500);
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
      select: { id: true }
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Get statistics
    const [totalPasses, activePasses] = await Promise.all([
      prisma.pass.count({
        where: { userId: user.id }
      }),
      prisma.pass.count({
        where: { userId: user.id, status: 'Active' }
      })
    ]);

    sendSuccess(res, 'Statistics fetched successfully', {
      stats: {
        totalPasses,
        activePasses
      }
    });
  } catch (error: any) {
    logger.error('Get pass statistics error:', error);
    sendError(res, error.message || 'Failed to fetch statistics', 500);
  }
});

// Note: Pass purchases are handled through KonfHub.
// This API only handles PDF storage and retrieval for dashboard display.

export default router;
