import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendError } from '../utils/response.util';
import path from 'path';
import fs from 'fs';

const router = Router();

/**
 * Serve uploaded PDF ticket
 * GET /api/v1/pdf/pass/:passId
 */
router.get('/pass/:passId', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;

    // Fetch pass data from database
    const pass = await prisma.pass.findUnique({
      where: { passId },
      select: {
        pdfUrl: true,
        userId: true,
        status: true
      }
    });

    if (!pass || !pass.pdfUrl) {
      sendError(res, 'Pass PDF not found', 404);
      return;
    }

    // Construct file path
    const filePath = path.join(__dirname, '../../', pass.pdfUrl);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      sendError(res, 'PDF file not found on server', 404);
      return;
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="ESUMMIT-2026-${passId}.pdf"`
    );

    // Stream the PDF file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Error streaming PDF:', error);
      if (!res.headersSent) {
        sendError(res, 'Error serving PDF', 500);
      }
    });
  } catch (error: any) {
    console.error('Error serving pass PDF:', error);
    sendError(res, error.message || 'Failed to serve pass PDF', 500);
  }
});

/**
 * Get PDF download URL for a pass
 * GET /api/v1/pdf/download/:passId
 */
router.get('/download/:passId', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;

    // Fetch pass data from database
    const pass = await prisma.pass.findUnique({
      where: { passId },
      select: {
        pdfUrl: true,
        status: true
      }
    });

    if (!pass || !pass.pdfUrl) {
      sendError(res, 'Pass PDF not found', 404);
      return;
    }

    // Return the PDF URL for frontend to handle download
    res.json({
      success: true,
      pdfUrl: pass.pdfUrl,
      filename: `ESUMMIT-2026-${passId}.pdf`
    });
  } catch (error: any) {
    console.error('Error getting PDF download URL:', error);
    sendError(res, error.message || 'Failed to get PDF download URL', 500);
  }
});

export default router;
