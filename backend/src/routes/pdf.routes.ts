import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import pdfService from '../services/pdf.service';

const router = Router();

/**
 * @route   GET /api/v1/pdf/pass/:passId
 * @desc    Generate and download pass PDF
 * @access  Public (with pass validation)
 */
router.get('/pass/:passId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { passId } = req.params;

    // Fetch pass data from database
    const pass = await prisma.pass.findUnique({
      where: { passId },
      include: {
        user: true,
        transaction: true
      }
    });

    if (!pass) {
      res.status(404).json({
        success: false,
        error: 'Pass not found'
      });
      return;
    }

    // Prepare PDF data
    const pdfData = {
      passId: pass.passId,
      passType: pass.passType,
      userName: pass.user.fullName || pass.user.firstName || 'Guest',
      userEmail: pass.user.email,
      userCollege: pass.user.college || undefined,
      userPhone: pass.user.phone || undefined,
      purchaseDate: pass.createdAt.toISOString(),
      qrData: pass.passId, // The QR code contains the pass ID
      status: pass.status
    };

    // Generate PDF
    const pdfBuffer = await pdfService.generatePassPDF(pdfData);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ESUMMIT-2026-${passId}-Pass.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Error generating pass PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate pass PDF'
    });
  }
});

/**
 * @route   GET /api/v1/pdf/invoice/:transactionId
 * @desc    Generate and download invoice PDF
 * @access  Public (with transaction validation)
 */
router.get('/invoice/:transactionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { transactionId } = req.params;

    // Fetch transaction data from database
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { id: transactionId },
          { konfhubPaymentId: transactionId }
        ]
      },
      include: {
        user: true
      }
    });

    if (!transaction) {
      res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
      return;
    }

    // Check if transaction has an associated pass
    if (!transaction.passId) {
      res.status(400).json({
        success: false,
        error: 'Transaction does not have an associated pass yet. Payment may still be pending.'
      });
      return;
    }

    // Fetch pass data using the pass UUID (not passId field)
    const pass = await prisma.pass.findUnique({
      where: { id: transaction.passId }  // transaction.passId is the Pass.id (UUID)
    });

    if (!pass) {
      res.status(404).json({
        success: false,
        error: 'Pass not found'
      });
      return;
    }

    const user = transaction.user;

    // Calculate pricing breakdown
    const passPrice = Number(pass.price);
    const subtotal = passPrice;
    const gstAmount = Math.round(subtotal * 0.18);
    const total = subtotal + gstAmount;

    // Use the stored invoice number from the database (with fallback for pre-migration data)
    const invoiceNumber = transaction.invoiceNumber || `INV-2026-${transaction.id.substring(0, 8).toUpperCase()}`;
    const transactionNumber = transaction.transactionNumber || `TXN-2026-${transaction.id.substring(0, 8).toUpperCase()}`;

    // Prepare PDF data
    const pdfData = {
      invoiceNumber,
      invoiceDate: transaction.createdAt.toISOString(),
      userName: user.fullName || user.firstName || 'Guest',
      userEmail: user.email,
      userPhone: user.phone || undefined,
      userCollege: user.college || undefined,
      passType: pass.passType,
      passPrice,
      subtotal,
      gstAmount,
      total,
      paymentMethod: transaction.konfhubPaymentId ? 'Online Payment (KonfHub)' : 'Manual',
      transactionId: transaction.konfhubPaymentId || transactionNumber,
      paymentStatus: transaction.status.toUpperCase()
    };

    // Generate PDF
    const pdfBuffer = await pdfService.generateInvoicePDF(pdfData);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ESUMMIT-2026-Invoice-${invoiceNumber}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Error generating invoice PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate invoice PDF'
    });
  }
});



export default router;
