import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendError } from '../utils/response.util';
import path from 'path';
import fs from 'fs';
import pdfService from '../services/pdf.service';
import { generateQRCode } from '../services/qrcode.service';

const router = Router();

/**
 * Serve uploaded PDF ticket or generate on-the-fly
 * GET /api/v1/pdf/pass/:passId
 * 
 * Priority Order:
 * 1. If user uploaded a PDF during verification → serve that (always preferred)
 * 2. If no uploaded PDF exists → generate on-the-fly
 */
router.get('/pass/:passId', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;

    // Fetch pass data from database
    const pass = await prisma.pass.findUnique({
      where: { passId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            college: true,
          }
        }
      }
    });

    if (!pass) {
      sendError(res, 'Pass not found', 404);
      return;
    }

    // PRIORITY 1: If user uploaded PDF during verification, serve that
    if (pass.pdfUrl) {
      const filePath = path.join(__dirname, '../../', pass.pdfUrl);
      
      if (fs.existsSync(filePath)) {
        console.log(`Serving uploaded PDF for pass: ${passId}`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="ESUMMIT-2026-${passId}.pdf"`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
          console.error('Error streaming uploaded PDF:', error);
          if (!res.headersSent) {
            sendError(res, 'Error serving uploaded PDF', 500);
          }
        });
        return;
      } else {
        console.warn(`PDF file path exists in DB but file not found on disk: ${filePath}`);
      }
    }

    // PRIORITY 2: For passes without uploaded PDF, only generate if pass is NOT from claim approval
    const ticketDetails = pass.ticketDetails as any;
    const isApprovedClaim = ticketDetails?.source === 'admin_claim_approval';

    if (isApprovedClaim) {
      // For approved claims, PDF upload was mandatory - should not reach here
      console.error(`Approved claim pass missing PDF: ${passId}`);
      sendError(res, 'Pass PDF is missing. Please contact support.', 404);
      return;
    }

    // Generate PDF on-the-fly only for non-claim passes
    console.log(`No uploaded PDF found. Generating PDF on-the-fly for pass: ${passId}`);

    // Generate QR code data
    const qrData = await generateQRCode(passId);

    // Prepare PDF data
    const pdfData = {
      passId: pass.passId,
      passType: pass.passType,
      userName: pass.user.fullName || 'N/A',
      userEmail: pass.user.email,
      userCollege: pass.user.college || undefined,
      userPhone: pass.user.phone || undefined,
      purchaseDate: pass.createdAt.toLocaleDateString(),
      qrData: qrData,
      status: pass.status,
    };

    // Generate PDF buffer
    const pdfBuffer = await pdfService.generatePassPDF(pdfData);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ESUMMIT-2026-${passId}.pdf"`
    );

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error: any) {
    console.error('Error serving pass PDF:', error);
    sendError(res, error.message || 'Failed to serve pass PDF', 500);
  }
});

/**
 * Get PDF download URL for a pass
 * GET /api/v1/pdf/download/:passId
 * 
 * Note: This endpoint redirects to /pass/:passId for unified PDF handling
 * Uploaded PDFs are always prioritized over generated ones
 */
router.get('/download/:passId', async (req: Request, res: Response) => {
  try {
    const { passId } = req.params;

    // Verify pass exists
    const pass = await prisma.pass.findUnique({
      where: { passId },
      select: {
        passId: true,
        pdfUrl: true,
        status: true
      }
    });

    if (!pass) {
      sendError(res, 'Pass not found', 404);
      return;
    }

    // Redirect to main PDF endpoint which handles both uploaded and generated PDFs
    // This ensures uploaded PDFs are always prioritized
    res.redirect(`/api/v1/pdf/pass/${passId}`);
  } catch (error: any) {
    console.error('Error getting PDF download URL:', error);
    sendError(res, error.message || 'Failed to get PDF download URL', 500);
  }
});

export default router;
