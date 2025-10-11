import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

interface PassPDFData {
  passId: string;
  passType: string;
  userName: string;
  userEmail: string;
  userCollege?: string;
  userPhone?: string;
  purchaseDate: string;
  qrData: string;
  hasMeals: boolean;
  hasMerchandise: boolean;
  hasWorkshopAccess: boolean;
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
  hasMeals: boolean;
  mealsPrice: number;
  hasMerchandise: boolean;
  merchandisePrice: number;
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

  constructor() {
    this.logoPath = path.join(__dirname, '../assets/logo.png');
    this.hasLogo = fs.existsSync(this.logoPath);
    
    if (!this.hasLogo) {
      console.warn('Logo file not found at: ' + this.logoPath);
    }
  }

  /**
   * Generate Enhanced Pass PDF with Beautiful Design
   */
  async generatePassPDF(data: PassPDFData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 0, bottom: 0, left: 0, right: 0 },
          info: {
            Title: `E-Summit 2026 Pass - ${data.passId}`,
            Author: 'E-Summit 2026',
            Subject: 'Event Pass',
            Keywords: 'pass, event, esummit, ticket',
            Creator: 'E-Summit Platform',
            Producer: 'E-Summit 2026'
          }
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Generate QR Code with higher quality
        const qrBuffer = await QRCode.toBuffer(data.qrData, {
          errorCorrectionLevel: 'H',
          type: 'png',
          width: 500,
          margin: 1,
          color: {
            dark: '#1e1b4b',
            light: '#FFFFFF'
          }
        });

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // === HEADER SECTION WITH GRADIENT ===
        this.drawGradientHeader(doc, pageWidth);

        // Logo and Title
        const headerY = 40;
        if (this.hasLogo) {
          doc.image(this.logoPath, 50, headerY, { width: 70, height: 70 });
        }

        doc.fontSize(36)
           .fillColor('#ffffff')
           .font('Helvetica-Bold')
           .text('E-SUMMIT', this.hasLogo ? 140 : 50, headerY + 10);
        
        doc.fontSize(20)
           .fillColor('#e0e7ff')
           .font('Helvetica')
           .text('2026', this.hasLogo ? 140 : 50, headerY + 50);

        // Status Badge
        this.drawStatusBadge(doc, data.status, pageWidth - 150, headerY + 20);

        // === PASS TYPE BANNER ===
        const bannerY = 150;
        this.drawPassTypeBanner(doc, data.passType, bannerY, pageWidth);

        // === ATTENDEE CARD ===
        const cardY = 240;
        this.drawAttendeeCard(doc, data, cardY);

        // === QR CODE SECTION ===
        const qrY = 440;
        this.drawQRSection(doc, qrBuffer, qrY, pageWidth);

        // === INCLUSIONS SECTION ===
        const inclusionsY = 620;
        this.drawInclusions(doc, data, inclusionsY);

        // === FOOTER ===
        this.drawFooter(doc, pageHeight);

        doc.end();
      } catch (error) {
        console.error('Error generating pass PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Draw gradient header background
   */
  private drawGradientHeader(doc: PDFKit.PDFDocument, width: number): void {
    // Main header rectangle
    doc.rect(0, 0, width, 140)
       .fill('#4f46e5');
    
    // Accent shapes for visual interest
    doc.save();
    doc.opacity(0.3);
    
    // Circle accent
    doc.circle(width - 60, 30, 80)
       .fill('#818cf8');
    
    // Circle accent 2
    doc.circle(50, 100, 40)
       .fill('#312e81');
    
    doc.restore();
  }

  /**
   * Draw status badge
   */
  private drawStatusBadge(doc: PDFKit.PDFDocument, status: string, x: number, y: number): void {
    const isActive = status === 'Active';
    const bgColor = isActive ? '#10b981' : '#6b7280';
    const width = 100;
    const height = 30;

    // Badge background with rounded corners
    doc.roundedRect(x, y, width, height, 15)
       .fill(bgColor);

    // Badge text
    doc.fontSize(12)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text(status.toUpperCase(), x, y + 9, {
         width: width,
         align: 'center'
       });
  }

  /**
   * Draw pass type banner
   */
  private drawPassTypeBanner(doc: PDFKit.PDFDocument, passType: string, y: number, width: number): void {
    // Banner background
    doc.rect(0, y, width, 60)
       .fill('#f8fafc');

    // Accent line
    doc.rect(0, y, 8, 60)
       .fill('#6366f1');

    // Pass type text
    doc.fontSize(28)
       .fillColor('#1e293b')
       .font('Helvetica-Bold')
       .text(passType.toUpperCase(), 40, y + 15, {
         width: width - 80,
         align: 'left'
       });
  }

  /**
   * Draw attendee information card
   */
  private drawAttendeeCard(doc: PDFKit.PDFDocument, data: PassPDFData, y: number): void {
    const cardX = 40;
    const cardWidth = 515;
    const cardHeight = 170;

    // Card shadow effect
    doc.save();
    doc.opacity(0.1);
    doc.roundedRect(cardX + 3, y + 3, cardWidth, cardHeight, 12)
       .fill('#000000');
    doc.restore();

    // Card background
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 12)
       .fill('#ffffff')
       .stroke('#e2e8f0')
       .lineWidth(1);

    // Section title
    doc.fontSize(11)
       .fillColor('#64748b')
       .font('Helvetica-Bold')
       .text('ATTENDEE INFORMATION', cardX + 20, y + 20);

    let detailY = y + 50;
    const lineHeight = 22;

    // Name
    this.drawDetailRow(doc, '👤', 'Name', data.userName, cardX + 20, detailY);
    detailY += lineHeight;

    // Email
    this.drawDetailRow(doc, '✉', 'Email', data.userEmail, cardX + 20, detailY);
    detailY += lineHeight;

    // College (if available)
    if (data.userCollege) {
      this.drawDetailRow(doc, '🎓', 'College', data.userCollege, cardX + 20, detailY);
      detailY += lineHeight;
    }

    // Phone (if available)
    if (data.userPhone) {
      this.drawDetailRow(doc, '📱', 'Phone', data.userPhone, cardX + 20, detailY);
      detailY += lineHeight;
    }

    // Pass ID
    this.drawDetailRow(doc, '🎫', 'Pass ID', data.passId, cardX + 20, detailY);
  }

  /**
   * Draw a detail row with icon, label, and value
   */
  private drawDetailRow(doc: PDFKit.PDFDocument, icon: string, label: string, value: string, x: number, y: number): void {
    // Draw colored icon circle
    const iconColors: { [key: string]: string } = {
      '👤': '#3b82f6',
      '✉': '#8b5cf6',
      '🎓': '#ec4899',
      '📱': '#10b981',
      '🎫': '#f59e0b'
    };
    
    const iconLabels: { [key: string]: string } = {
      '👤': 'U',
      '✉': '@',
      '🎓': 'C',
      '📱': 'P',
      '🎫': 'T'
    };

    const color = iconColors[icon] || '#6366f1';
    const iconText = iconLabels[icon] || icon;

    doc.circle(x + 6, y + 5, 8)
       .fill(color);
    
    doc.fontSize(9)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text(iconText, x + 2, y + 1, { width: 8, align: 'center' });

    doc.fontSize(10)
       .fillColor('#64748b')
       .font('Helvetica')
       .text(`${label}: `, x + 20, y, { continued: true })
       .fillColor('#1e293b')
       .font('Helvetica-Bold')
       .text(value);
  }

  /**
   * Draw QR code section with enhanced styling
   */
  private drawQRSection(doc: PDFKit.PDFDocument, qrBuffer: Buffer, y: number, pageWidth: number): void {
    const qrSize = 140;
    const qrX = (pageWidth - qrSize) / 2;

    // QR Container with gradient border
    const containerSize = qrSize + 20;
    const containerX = qrX - 10;
    
    // Outer glow effect
    doc.save();
    doc.opacity(0.2);
    doc.roundedRect(containerX - 5, y - 5, containerSize + 10, containerSize + 10, 15)
       .fill('#6366f1');
    doc.restore();

    // QR background
    doc.roundedRect(containerX, y, containerSize, containerSize, 12)
       .fill('#ffffff')
       .stroke('#6366f1')
       .lineWidth(3);

    // QR Code
    doc.image(qrBuffer, qrX, y + 10, { width: qrSize, height: qrSize });

    // Scan instruction
    doc.fontSize(10)
       .fillColor('#64748b')
       .font('Helvetica')
       .text('Scan this code at the venue', 0, y + containerSize + 15, {
         width: pageWidth,
         align: 'center'
       });
  }

  /**
   * Draw inclusions section with modern icons
   */
  private drawInclusions(doc: PDFKit.PDFDocument, data: PassPDFData, y: number): void {
    // Section header
    doc.fontSize(16)
       .fillColor('#1e293b')
       .font('Helvetica-Bold')
       .text('What\'s Included', 40, y);

    // Decorative underline
    doc.moveTo(40, y + 25)
       .lineTo(120, y + 25)
       .strokeColor('#6366f1')
       .lineWidth(2)
       .stroke();

    const inclusionsY = y + 40;
    const leftCol = 50;
    const rightCol = 310;
    let currentY = inclusionsY;

    // Always included items
    this.drawInclusionItem(doc, '🎤', 'All keynote sessions', leftCol, currentY);
    currentY += 25;
    this.drawInclusionItem(doc, '🤝', 'Networking events', leftCol, currentY);
    
    currentY = inclusionsY;
    this.drawInclusionItem(doc, '💬', 'Panel discussions', rightCol, currentY);
    currentY += 25;
    
    if (data.hasWorkshopAccess) {
      this.drawInclusionItem(doc, '🛠', 'Workshop access', rightCol, currentY);
      currentY += 25;
    }
    
    if (data.hasMeals) {
      this.drawInclusionItem(doc, '🍽', 'Meals and refreshments', rightCol, currentY);
      currentY += 25;
    }
    
    if (data.hasMerchandise) {
      this.drawInclusionItem(doc, '🎁', 'Merchandise kit', rightCol, currentY);
    }
  }

  /**
   * Draw individual inclusion item
   */
  private drawInclusionItem(doc: PDFKit.PDFDocument, icon: string, text: string, x: number, y: number): void {
    // Checkmark circle
    doc.circle(x, y + 5, 8)
       .fill('#10b981');
    
    doc.fontSize(11)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text('✓', x - 3.5, y + 1, {
         width: 16,
         align: 'center'
       });

    // Item text (without emoji)
    const textMap: { [key: string]: string } = {
      '🎤': 'Keynote',
      '🤝': 'Network',
      '💬': 'Panels',
      '🛠': 'Workshop',
      '🍽': 'Meals',
      '🎁': 'Merch'
    };
    
    const prefix = textMap[icon] || '';
    
    doc.fontSize(11)
       .fillColor('#1e293b')
       .font('Helvetica')
       .text(`${prefix}: ${text.replace(/[^\x00-\x7F]/g, '')}`, x + 20, y + 1);
  }

  /**
   * Draw footer with event details
   */
  private drawFooter(doc: PDFKit.PDFDocument, pageHeight: number): void {
    const footerY = pageHeight - 100;

    // Footer background
    doc.rect(0, footerY, doc.page.width, 100)
       .fill('#f8fafc');

    // Event details
    doc.fontSize(10)
       .fillColor('#1e293b')
       .font('Helvetica-Bold')
       .text('Dates: March 15-16, 2026', 50, footerY + 20);
    
    doc.fontSize(9)
       .fillColor('#64748b')
       .font('Helvetica')
       .text('Venue: Thakur College of Engineering, Kandivali (E), Mumbai', 50, footerY + 40)
       .text('Time: 9:00 AM - 6:00 PM (Both Days)', 50, footerY + 55);

    // Support info
    doc.fontSize(8)
       .fillColor('#94a3b8')
       .text('Support: support@esummit2026.com | +91 98765 43210', 0, footerY + 78, {
         width: doc.page.width,
         align: 'center'
       });
  }

  /**
   * Generate Invoice PDF (kept original with minor improvements)
   */
  async generateInvoicePDF(data: InvoicePDFData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
          info: {
            Title: `Invoice ${data.invoiceNumber}`,
            Author: 'E-Summit 2026',
            Subject: 'Payment Invoice',
            Keywords: 'invoice, payment, receipt',
            Creator: 'E-Summit Platform',
            Producer: 'E-Summit 2026'
          }
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header with logo
        if (this.hasLogo) {
          doc.image(this.logoPath, 50, 45, { width: 80, height: 80 });
        }

        doc.fontSize(28).fillColor('#6366f1').font('Helvetica-Bold').text('INVOICE', 400, 60);
        doc.fontSize(12).fillColor('#6b7280').font('Helvetica').text(`#${data.invoiceNumber}`, 400, 95);
        doc.text(`Date: ${new Date(data.invoiceDate).toLocaleDateString('en-IN')}`, 400, 115);

        // Company Details
        doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold').text('E-Summit 2026', 50, 150);
        doc.fontSize(10).fillColor('#6b7280').font('Helvetica');
        doc.text('Thakur College of Engineering', 50, 170);
        doc.text('Kandivali (E), Mumbai - 400101', 50, 185);
        doc.text('Maharashtra, India', 50, 200);
        doc.text('Email: billing@esummit2026.com', 50, 215);

        // Bill To Section
        doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold').text('BILL TO:', 50, 260);
        doc.fontSize(10).fillColor('#6b7280').font('Helvetica');
        doc.text(data.userName, 50, 280);
        doc.text(data.userEmail, 50, 295);
        
        if (data.userPhone) {
          doc.text(data.userPhone, 50, 310);
        }
        
        if (data.userCollege) {
          doc.text(data.userCollege, 50, data.userPhone ? 325 : 310);
        }

        // Table Header
        const tableTop = 370;
        doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold');
        
        doc.rect(50, tableTop, 495, 25).fill('#6366f1');
        
        doc.text('Description', 60, tableTop + 8);
        doc.text('Qty', 350, tableTop + 8);
        doc.text('Amount', 450, tableTop + 8);

        // Table Content
        let currentY = tableTop + 35;
        doc.fillColor('#1f2937').font('Helvetica');

        doc.text(data.passType, 60, currentY);
        doc.text('1', 350, currentY);
        doc.text(`₹${data.passPrice.toLocaleString('en-IN')}`, 450, currentY);
        currentY += 25;

        if (data.hasMeals) {
          doc.text('Meals & Refreshments', 60, currentY);
          doc.text('1', 350, currentY);
          doc.text(`₹${data.mealsPrice.toLocaleString('en-IN')}`, 450, currentY);
          currentY += 25;
        }

        if (data.hasMerchandise) {
          doc.text('Merchandise Kit', 60, currentY);
          doc.text('1', 350, currentY);
          doc.text(`₹${data.merchandisePrice.toLocaleString('en-IN')}`, 450, currentY);
          currentY += 25;
        }

        currentY += 10;
        doc.moveTo(50, currentY).lineTo(545, currentY).strokeColor('#e5e7eb').lineWidth(1).stroke();
        currentY += 20;

        doc.fillColor('#6b7280').font('Helvetica');
        doc.text('Subtotal:', 350, currentY);
        doc.fillColor('#1f2937').text(`₹${data.subtotal.toLocaleString('en-IN')}`, 450, currentY);
        currentY += 20;

        doc.fillColor('#6b7280').text('GST (18%):', 350, currentY);
        doc.fillColor('#1f2937').text(`₹${data.gstAmount.toLocaleString('en-IN')}`, 450, currentY);
        currentY += 20;

        currentY += 10;
        doc.rect(50, currentY, 495, 30).fill('#f3f4f6');
        doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold');
        doc.text('TOTAL:', 350, currentY + 8);
        doc.text(`₹${data.total.toLocaleString('en-IN')}`, 450, currentY + 8);

        // Payment Details
        currentY += 60;
        doc.fontSize(12).fillColor('#6b7280').font('Helvetica-Bold').text('PAYMENT DETAILS', 50, currentY);
        currentY += 25;

        doc.fontSize(10).fillColor('#1f2937').font('Helvetica');
        doc.text(`Payment Method: `, 50, currentY, { continued: true }).font('Helvetica-Bold').text(data.paymentMethod);
        currentY += 20;

        if (data.transactionId) {
          doc.font('Helvetica').text(`Transaction ID: `, 50, currentY, { continued: true }).font('Helvetica-Bold').text(data.transactionId);
          currentY += 20;
        }

        const statusColor = data.paymentStatus === 'PAID' ? '#10b981' : '#ef4444';
        doc.font('Helvetica').text(`Status: `, 50, currentY, { continued: true })
           .fillColor(statusColor)
           .font('Helvetica-Bold')
           .text(`✓ ${data.paymentStatus}`);

        // Footer
        doc.fontSize(9).fillColor('#6b7280').font('Helvetica');
        doc.text('Thank you for your purchase! We look forward to seeing you at E-Summit 2026.', 50, 720, {
          align: 'center',
          width: 495
        });
        doc.text('For queries, contact: support@esummit2026.com', {
          align: 'center'
        });

        doc.end();
      } catch (error) {
        console.error('Error generating invoice PDF:', error);
        reject(error);
      }
    });
  }
}

export default new PDFService();