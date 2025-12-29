import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger.util';

interface PassPDFData {
  passId: string;
  passType: string;
  userName: string;
  userEmail: string;
  userCollege?: string;
  userPhone?: string;
  purchaseDate: string;
  qrData: string;
  status: string;
}

interface InvoicePDFData {
  invoiceNumber: string;
  invoiceDate: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userCollege?: string;
  passType: string;
  passPrice: number;
  subtotal: number;
  gstAmount: number;
  total: number;
  paymentMethod: string;
  transactionId?: string;
  paymentStatus: string;
}

export class PDFService {
  private logoPath: string;
  private hasLogo: boolean;

  // Red & White Theme Colors
  private readonly colors = {
    primaryRed: '#DC2626',
    darkRed: '#991B1B',
    lightRed: '#FEE2E2',
    accentRed: '#EF4444',
    white: '#FFFFFF',
    lightGray: '#F9FAFB',
    textDark: '#1F2937',
    textGray: '#6B7280',
    borderGray: '#E5E7EB',
    successGreen: '#059669'
  };

  constructor() {
    this.logoPath = path.join(__dirname, '../assets/logo.png');
    this.hasLogo = fs.existsSync(this.logoPath);

    if (!this.hasLogo) {
      logger.warn('Logo file not found at: ' + this.logoPath);
    }
  }

  /**
   * Generate basic pass PDF (simplified version)
   * Note: PDFs are primarily uploaded from KonfHub now
   */
  async generatePassPDF(data: PassPDFData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Simple header
        doc.rect(0, 0, doc.page.width, 120).fill(this.colors.primaryRed);

        doc.fontSize(32)
           .fillColor(this.colors.white)
           .font('Helvetica-Bold')
           .text('E-SUMMIT 2026', 50, 50);

        doc.fontSize(18)
           .fillColor(this.colors.lightRed)
           .text('EVENT PASS', 50, 90);

        // Pass details
        doc.fillColor(this.colors.textDark)
           .font('Helvetica')
           .fontSize(14);

        let y = 150;
        doc.text(`Pass ID: ${data.passId}`, 50, y);
        y += 30;
        doc.text(`Type: ${data.passType}`, 50, y);
        y += 30;
        doc.text(`Name: ${data.userName}`, 50, y);
        y += 30;
        doc.text(`Email: ${data.userEmail}`, 50, y);

        if (data.userCollege) {
          y += 30;
          doc.text(`College: ${data.userCollege}`, 50, y);
        }

        // Status
        const statusColor = data.status === 'Active' ? this.colors.successGreen : this.colors.primaryRed;
        y += 40;
        doc.fillColor(statusColor)
           .font('Helvetica-Bold')
           .text(`Status: ${data.status}`, 50, y);

        // Footer
        doc.fontSize(10)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text('Generated for E-Summit 2026', 50, doc.page.height - 80, {
             align: 'center',
             width: 495
           });

        doc.end();
      } catch (error) {
        logger.error('Error generating pass PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Generate basic invoice PDF (simplified version)
   */
  async generateInvoicePDF(data: InvoicePDFData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(28)
           .fillColor(this.colors.primaryRed)
           .font('Helvetica-Bold')
           .text('INVOICE', 50, 50);

        doc.fontSize(12)
           .fillColor(this.colors.textGray)
           .text(`#${data.invoiceNumber}`, 50, 85);

        doc.text(`Date: ${new Date(data.invoiceDate).toLocaleDateString()}`, 50, 105);

        // Bill to
        doc.fontSize(14)
           .fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text('Bill To:', 50, 140);

        doc.fontSize(12)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text(data.userName, 50, 165)
           .text(data.userEmail, 50, 185);

        // Invoice details
        let y = 230;
        doc.fontSize(12)
           .fillColor(this.colors.textDark)
           .text(`Pass Type: ${data.passType}`, 50, y);
        y += 25;
        doc.text(`Amount: INR ${data.total.toLocaleString('en-IN')}`, 50, y);
        y += 25;
        doc.text(`Payment Method: ${data.paymentMethod}`, 50, y);
        y += 25;
        doc.text(`Status: ${data.paymentStatus}`, 50, y);

        // Footer
        doc.fontSize(10)
           .fillColor(this.colors.textGray)
           .text('Thank you for your purchase!', 50, doc.page.height - 80, {
             align: 'center',
             width: 495
           });

        doc.end();
      } catch (error) {
        logger.error('Error generating invoice PDF:', error);
        reject(error);
      }
    });
  }
}

export default new PDFService();