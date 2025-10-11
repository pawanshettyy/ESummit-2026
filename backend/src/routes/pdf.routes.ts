import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import pdfService from '../services/pdf.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * @route   GET /api/v1/pdf/pass/:passId
 * @desc    Generate and download pass PDF
 * @access  Public (with pass validation)
 */
router.get('/pass/:passId', async (req: Request, res: Response) => {
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
      return res.status(404).json({
        success: false,
        error: 'Pass not found'
      });
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
      hasMeals: pass.hasMeals,
      hasMerchandise: pass.hasMerchandise,
      hasWorkshopAccess: pass.hasWorkshopAccess,
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
    console.error('Error generating pass PDF:', error);
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
router.get('/invoice/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    // Fetch transaction data from database
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { id: transactionId },
          { razorpayPaymentId: transactionId }
        ]
      },
      include: {
        user: true
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Fetch pass data
    const pass = await prisma.pass.findUnique({
      where: { passId: transaction.passId }
    });

    if (!pass) {
      return res.status(404).json({
        success: false,
        error: 'Pass not found'
      });
    }

    const user = transaction.user;

    // Calculate pricing breakdown
    const passPrice = Number(pass.price);
    const mealsPrice = pass.hasMeals ? 300 : 0;
    const merchandisePrice = pass.hasMerchandise ? 500 : 0;
    const subtotal = passPrice + mealsPrice + merchandisePrice;
    const gstAmount = Math.round(subtotal * 0.18);
    const total = subtotal + gstAmount;

    // Generate invoice number
    const invoiceNumber = `INV-2026-${String(transaction.id).substring(0, 8).toUpperCase()}`;

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
      hasMeals: pass.hasMeals,
      mealsPrice,
      hasMerchandise: pass.hasMerchandise,
      merchandisePrice,
      subtotal,
      gstAmount,
      total,
      paymentMethod: transaction.razorpayPaymentId ? 'Online Payment (Razorpay)' : 'Bypassed (Test Mode)',
      transactionId: transaction.razorpayPaymentId || `TXN-${transaction.id.substring(0, 8).toUpperCase()}`,
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
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate invoice PDF'
    });
  }
});

export default router;
