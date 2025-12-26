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
    primaryRed: '#DC2626',      // Bright red
    darkRed: '#991B1B',          // Dark red
    lightRed: '#FEE2E2',         // Very light red
    accentRed: '#EF4444',        // Medium red
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
   * Generate Enhanced Pass PDF with Red & White Design
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

        // Generate QR Code with black color
        const qrBuffer = await QRCode.toBuffer(data.qrData, {
          errorCorrectionLevel: 'H',
          type: 'png',
          width: 500,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // === HEADER SECTION ===
        this.drawHeader(doc, pageWidth);

        // Logo and Title (with white background for visibility)
        const headerY = 45;
        if (this.hasLogo) {
          // Add white rounded background behind logo for visibility
          doc.save();
          doc.roundedRect(42, headerY - 8, 86, 86, 8)
             .fill(this.colors.white);
          doc.restore();
          
          // Logo with better sizing
          doc.image(this.logoPath, 50, headerY, { 
            fit: [70, 70],
            align: 'center',
            valign: 'center'
          });
        }

        const titleX = this.hasLogo ? 145 : 50;
        doc.fontSize(36)
           .fillColor(this.colors.white)
           .font('Helvetica-Bold')
           .text('E-SUMMIT', titleX, headerY + 8);
        
        doc.fontSize(20)
           .fillColor(this.colors.lightRed)
           .font('Helvetica')
           .text('2026', titleX, headerY + 52);

        // Status Badge (aligned to right with margin)
        this.drawStatusBadge(doc, data.status, pageWidth - 160, headerY + 25);

        // === PASS TYPE BANNER ===
        const bannerY = 150;
        this.drawPassTypeBanner(doc, data.passType, bannerY, pageWidth);

        // === ATTENDEE CARD ===
        const cardY = 240;
        this.drawAttendeeCard(doc, data, cardY);

        // === QR CODE SECTION ===
        const qrY = 450;
        this.drawQRSection(doc, qrBuffer, qrY, pageWidth);

        // === INCLUSIONS SECTION ===
        const inclusionsY = 630;
        this.drawInclusions(doc, inclusionsY);

        // === FOOTER ===
        this.drawFooter(doc, pageHeight);

        doc.end();
      } catch (error) {
        logger.error('Error generating pass PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Draw red gradient header background
   */
  private drawHeader(doc: PDFKit.PDFDocument, width: number): void {
    // Main header rectangle - solid red
    doc.rect(0, 0, width, 140)
       .fill(this.colors.primaryRed);
    
    // Accent shapes for visual interest
    doc.save();
    doc.opacity(0.15);
    
    // Circle accent 1
    doc.circle(width - 60, 30, 80)
       .fill(this.colors.white);
    
    // Circle accent 2
    doc.circle(50, 110, 50)
       .fill(this.colors.darkRed);
    
    doc.restore();
  }

  /**
   * Draw status badge (perfectly aligned)
   */
  private drawStatusBadge(doc: PDFKit.PDFDocument, status: string, x: number, y: number): void {
    const isActive = status === 'Active';
    const bgColor = isActive ? this.colors.successGreen : this.colors.textGray;
    const width = 100;
    const height = 32;

    // Badge background with rounded corners
    doc.roundedRect(x, y, width, height, 16)
       .fill(bgColor);

    // Badge text (centered perfectly)
    doc.fontSize(11)
       .fillColor(this.colors.white)
       .font('Helvetica-Bold')
       .text(status.toUpperCase(), x, y + 10, {
         width: width,
         align: 'center'
       });
  }

  /**
   * Draw pass type banner (perfectly aligned)
   */
  private drawPassTypeBanner(doc: PDFKit.PDFDocument, passType: string, y: number, width: number): void {
    // Banner background
    doc.rect(0, y, width, 60)
       .fill(this.colors.lightGray);

    // Red accent line on left
    doc.rect(0, y, 6, 60)
       .fill(this.colors.primaryRed);

    // Pass type text (perfectly aligned)
    doc.fontSize(26)
       .fillColor(this.colors.textDark)
       .font('Helvetica-Bold')
       .text(passType.toUpperCase(), 35, y + 17, {
         width: width - 70,
         align: 'left'
       });
  }

  /**
   * Draw attendee information card (perfectly aligned)
   */
  private drawAttendeeCard(doc: PDFKit.PDFDocument, data: PassPDFData, y: number): void {
    const cardX = 40;
    const cardWidth = 515;
    const cardHeight = 180;

    // Card shadow effect
    doc.save();
    doc.opacity(0.08);
    doc.roundedRect(cardX + 4, y + 4, cardWidth, cardHeight, 8)
       .fill('#000000');
    doc.restore();

    // Card background with red border
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 8)
       .fillAndStroke(this.colors.white, this.colors.primaryRed)
       .lineWidth(2);

    // Section title (perfectly aligned)
    doc.fontSize(10)
       .fillColor(this.colors.textGray)
       .font('Helvetica-Bold')
       .text('ATTENDEE INFORMATION', cardX + 25, y + 22);

    // Red underline for title
    doc.rect(cardX + 25, y + 36, 140, 2)
       .fill(this.colors.primaryRed);

    let detailY = y + 55;
    const lineHeight = 24;

    // Name
    this.drawDetailRow(doc, 'NAME', data.userName, cardX + 25, detailY);
    detailY += lineHeight;

    // Email
    this.drawDetailRow(doc, 'EMAIL', data.userEmail, cardX + 25, detailY);
    detailY += lineHeight;

    // College (if available)
    if (data.userCollege) {
      this.drawDetailRow(doc, 'COLLEGE', data.userCollege, cardX + 25, detailY);
      detailY += lineHeight;
    }

    // Phone (if available)
    if (data.userPhone) {
      this.drawDetailRow(doc, 'PHONE', data.userPhone, cardX + 25, detailY);
      detailY += lineHeight;
    }

    // Pass ID
    this.drawDetailRow(doc, 'PASS ID', data.passId, cardX + 25, detailY);
  }

  /**
   * Draw a detail row with label and value (perfectly aligned)
   */
  private drawDetailRow(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number): void {
    // Red bullet point
    doc.circle(x + 4, y + 6, 3)
       .fill(this.colors.primaryRed);

    // Label (fixed width for alignment)
    doc.fontSize(9)
       .fillColor(this.colors.textGray)
       .font('Helvetica-Bold')
       .text(label + ':', x + 15, y, { width: 80, align: 'left' });

    // Value (aligned after label)
    doc.fontSize(9)
       .fillColor(this.colors.textDark)
       .font('Helvetica')
       .text(value, x + 100, y);
  }

  /**
   * Draw QR code section (perfectly centered)
   */
  private drawQRSection(doc: PDFKit.PDFDocument, qrBuffer: Buffer, y: number, pageWidth: number): void {
    const qrSize = 140;
    const containerPadding = 12;
    const containerSize = qrSize + (containerPadding * 2);
    const containerX = (pageWidth - containerSize) / 2;

    // Outer glow effect
    doc.save();
    doc.opacity(0.15);
    doc.roundedRect(containerX - 6, y - 6, containerSize + 12, containerSize + 12, 12)
       .fill(this.colors.primaryRed);
    doc.restore();

    // QR background with red border
    doc.roundedRect(containerX, y, containerSize, containerSize, 8)
       .fillAndStroke(this.colors.white, this.colors.primaryRed)
       .lineWidth(3);

    // QR Code (perfectly centered)
    const qrX = containerX + containerPadding;
    const qrY = y + containerPadding;
    doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });

    // Scan instruction (centered)
    doc.fontSize(10)
       .fillColor(this.colors.textGray)
       .font('Helvetica')
       .text('Scan this code at the venue', 0, y + containerSize + 18, {
         width: pageWidth,
         align: 'center'
       });
  }

  /**
   * Draw inclusions section (perfectly aligned)
   */
  private drawInclusions(doc: PDFKit.PDFDocument, y: number): void {
    // Section header
    doc.fontSize(15)
       .fillColor(this.colors.textDark)
       .font('Helvetica-Bold')
       .text('WHAT\'S INCLUDED', 40, y);

    // Red decorative underline
    doc.rect(40, y + 22, 100, 3)
       .fill(this.colors.primaryRed);

    const inclusionsY = y + 42;
    const leftCol = 50;
    const rightCol = 310;
    let leftY = inclusionsY;
    let rightY = inclusionsY;
    const itemHeight = 24;

    // Left column - always included items
    this.drawInclusionItem(doc, 'All keynote sessions', leftCol, leftY);
    leftY += itemHeight;
    this.drawInclusionItem(doc, 'Networking events', leftCol, leftY);
    leftY += itemHeight;
    this.drawInclusionItem(doc, 'Panel discussions', leftCol, leftY);

    // Right column - pass tier benefits
    this.drawInclusionItem(doc, 'Event access', rightCol, rightY);
    rightY += itemHeight;
    this.drawInclusionItem(doc, 'Certificate of attendance', rightCol, rightY);
  }

  /**
   * Draw individual inclusion item (perfectly aligned)
   */
  private drawInclusionItem(doc: PDFKit.PDFDocument, text: string, x: number, y: number): void {
    // Red checkmark circle
    doc.circle(x + 6, y + 6, 7)
       .fill(this.colors.primaryRed);
    
    // White checkmark
    doc.fontSize(10)
       .fillColor(this.colors.white)
       .font('Helvetica-Bold')
       .text('✓', x + 2.5, y + 2, {
         width: 8,
         align: 'center'
       });

    // Item text (aligned)
    doc.fontSize(10)
       .fillColor(this.colors.textDark)
       .font('Helvetica')
       .text(text, x + 22, y + 2);
  }

  /**
   * Draw footer with event details (perfectly aligned)
   */
  private drawFooter(doc: PDFKit.PDFDocument, pageHeight: number): void {
    const footerY = pageHeight - 100;

    // Footer background
    doc.rect(0, footerY, doc.page.width, 100)
       .fill(this.colors.lightGray);

    // Red accent line at top
    doc.rect(0, footerY, doc.page.width, 3)
       .fill(this.colors.primaryRed);

    // Event details (aligned)
    doc.fontSize(10)
       .fillColor(this.colors.textDark)
       .font('Helvetica-Bold')
       .text('EVENT DATES', 50, footerY + 20);
    
    doc.fontSize(9)
       .fillColor(this.colors.textGray)
       .font('Helvetica')
       .text('January 23-24, 2026', 50, footerY + 38);

    doc.fontSize(10)
       .fillColor(this.colors.textDark)
       .font('Helvetica-Bold')
       .text('VENUE', 50, footerY + 58);
    
    doc.fontSize(9)
       .fillColor(this.colors.textGray)
       .font('Helvetica')
       .text('Thakur College of Engineering, Kandivali (E), Mumbai', 50, footerY + 76);

    // Support info (centered)
    doc.fontSize(8)
       .fillColor(this.colors.textGray)
       .font('Helvetica')
       .text('SUPPORT: support@esummit2026.com | +91 98765 43210', 0, footerY + 88, {
         width: doc.page.width,
         align: 'center'
       });
  }

  /**
   * Generate Invoice PDF with Red & White Theme
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

        // Header with logo (with white background for visibility)
        if (this.hasLogo) {
          // White rounded background for logo visibility
          doc.save();
          doc.roundedRect(42, 37, 96, 96, 8)
             .fill(this.colors.white);
          doc.stroke(this.colors.borderGray);
          doc.restore();
          
          // Logo with proper sizing and padding
          doc.image(this.logoPath, 50, 45, { 
            fit: [80, 80],
            align: 'center',
            valign: 'center'
          });
        }

        // Invoice title (right aligned)
        doc.fontSize(32)
           .fillColor(this.colors.primaryRed)
           .font('Helvetica-Bold')
           .text('INVOICE', 400, 55);
        
        doc.fontSize(11)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text(`#${data.invoiceNumber}`, 400, 95, { align: 'left' });
        
        doc.text(`Date: ${new Date(data.invoiceDate).toLocaleDateString('en-IN')}`, 400, 112, { align: 'left' });

        // Red separator line
        doc.rect(400, 130, 145, 2).fill(this.colors.primaryRed);

        // Company Details (aligned)
        doc.fontSize(13)
           .fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text('E-Summit 2026', 50, 150);
        
        doc.fontSize(9)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text('Thakur College of Engineering', 50, 170)
           .text('Kandivali (E), Mumbai - 400101', 50, 184)
           .text('Maharashtra, India', 50, 198)
           .text('Email: billing@esummit2026.com', 50, 212);

        // Bill To Section (aligned)
        doc.fontSize(11)
           .fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text('BILL TO:', 50, 260);
        
        // Red underline
        doc.rect(50, 275, 50, 2).fill(this.colors.primaryRed);
        
        doc.fontSize(9)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text(data.userName, 50, 285)
           .text(data.userEmail, 50, 299);
        
        let billToY = 313;
        if (data.userPhone) {
          doc.text(data.userPhone, 50, billToY);
          billToY += 14;
        }
        
        if (data.userCollege) {
          doc.text(data.userCollege, 50, billToY);
        }

        // Table Header (red background, perfectly aligned)
        const tableTop = 370;
        doc.rect(50, tableTop, 495, 28).fill(this.colors.primaryRed);
        
        doc.fontSize(10)
           .fillColor(this.colors.white)
           .font('Helvetica-Bold')
           .text('DESCRIPTION', 60, tableTop + 10)
           .text('QTY', 380, tableTop + 10)
           .text('AMOUNT', 470, tableTop + 10);

        // Table Content (aligned)
        let currentY = tableTop + 38;
        const rowHeight = 26;
        
        doc.fontSize(9)
           .fillColor(this.colors.textDark)
           .font('Helvetica');

        // Pass row
        doc.text(data.passType, 60, currentY);
        doc.text('1', 380, currentY);
        doc.text(`INR ${data.passPrice.toLocaleString('en-IN')}`, 470, currentY);
        currentY += rowHeight;

        // Separator line
        currentY += 10;
        doc.rect(50, currentY, 495, 1).fill(this.colors.borderGray);
        currentY += 20;

        // Subtotal (aligned)
        doc.fontSize(9)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text('Subtotal:', 380, currentY);
        
        doc.fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text(`INR ${data.subtotal.toLocaleString('en-IN')}`, 470, currentY);
        currentY += 20;

        // GST (aligned)
        doc.fillColor(this.colors.textGray)
           .font('Helvetica')
           .text('GST (18%):', 380, currentY);
        
        doc.fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text(`INR ${data.gstAmount.toLocaleString('en-IN')}`, 470, currentY);
        currentY += 20;

        // Total section (red background, aligned)
        currentY += 10;
        doc.rect(50, currentY, 495, 32).fill(this.colors.lightRed);
        
        doc.fontSize(11)
           .fillColor(this.colors.primaryRed)
           .font('Helvetica-Bold')
           .text('TOTAL:', 380, currentY + 10);
        
        doc.fontSize(12)
           .text(`INR ${data.total.toLocaleString('en-IN')}`, 470, currentY + 10);

        // Payment Details (aligned)
        currentY += 60;
        doc.fontSize(11)
           .fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text('PAYMENT DETAILS', 50, currentY);
        
        // Red underline
        doc.rect(50, currentY + 16, 110, 2).fill(this.colors.primaryRed);
        currentY += 28;

        doc.fontSize(9)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text('Payment Method: ', 50, currentY, { continued: true })
           .fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text(data.paymentMethod);
        currentY += 18;

        if (data.transactionId) {
          doc.fillColor(this.colors.textGray)
             .font('Helvetica')
             .text('Transaction ID: ', 50, currentY, { continued: true })
             .fillColor(this.colors.textDark)
             .font('Helvetica-Bold')
             .text(data.transactionId);
          currentY += 18;
        }

        const statusColor = data.paymentStatus === 'PAID' ? this.colors.successGreen : this.colors.primaryRed;
        doc.fillColor(this.colors.textGray)
           .font('Helvetica')
           .text('Status: ', 50, currentY, { continued: true })
           .fillColor(statusColor)
           .font('Helvetica-Bold')
           .text(`✓ ${data.paymentStatus}`);

        // Footer (centered, aligned)
        doc.fontSize(8)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text('Thank you for your purchase! We look forward to seeing you at E-Summit 2026.', 50, 715, {
             align: 'center',
             width: 495
           })
           .text('For queries, contact: support@esummit2026.com', 50, 730, {
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

  // generateSchedulePDF removed
            { time: "10:00 - 13:00", title: "The Ten Minute Million", category: "Pitching", venue: "Main Auditorium" },
            { time: "14:00 - 17:00", title: "Angel Investors Roundtable", category: "Pitching", venue: "Conference Hall A" },
            { time: "11:00 - 13:00", title: "IPL Auction", category: "Competition", venue: "Competition Arena A" },
            { time: "09:00 - 18:00", title: "AI Build-A-Thon Day 1", category: "Competition", venue: "Tech Lab" },
            { time: "10:00 - 12:30", title: "Design Thinking Workshop", category: "Workshop", venue: "Workshop Hall A" },
            { time: "13:00 - 15:30", title: "Finance & Marketing Workshop", category: "Workshop", venue: "Workshop Hall B" },
            { time: "09:00 - 18:00", title: "Startup Expo", category: "Networking", venue: "Exhibition Hall" },
            { time: "15:00 - 17:00", title: "Panel Discussion", category: "Networking", venue: "Main Auditorium" },
            { time: "10:00 - 18:00", title: "Networking Arena", category: "Networking", venue: "Networking Lounge" },
          ],
          day2: [
            { time: "10:00 - 13:00", title: "Pitch Arena", category: "Pitching", venue: "Conference Hall B" },
            { time: "14:00 - 17:00", title: "Incubator Summit", category: "Pitching", venue: "Conference Hall C" },
            { time: "09:00 - 18:00", title: "AI Build-A-Thon Finals", category: "Competition", venue: "Tech Lab" },
            { time: "10:00 - 14:00", title: "Startup League", category: "Competition", venue: "Competition Arena B" },
            { time: "11:00 - 13:30", title: "Data Analytics & BDM Workshop", category: "Workshop", venue: "Workshop Hall A" },
            { time: "14:00 - 16:30", title: "AI for Early Stage Startups", category: "Workshop", venue: "Workshop Hall B" },
            { time: "09:00 - 18:00", title: "Startup Expo Day 2", category: "Networking", venue: "Exhibition Hall" },
            { time: "10:00 - 18:00", title: "Networking Arena Day 2", category: "Networking", venue: "Networking Lounge" },
            { time: "11:00 - 16:00", title: "Internship Fair", category: "Networking", venue: "Career Zone" },
            { time: "16:00 - 18:00", title: "Startup Youth Conclave", category: "Networking", venue: "Conclave Hall" },
            { time: "18:00 - 19:00", title: "Closing Ceremony & Prize Distribution", category: "Networking", venue: "Main Auditorium" },
          ]
        };

        // Determine which events user has access to based on pass types
        let eligibleEvents: any[] = [];
        const passTypes = data.passes.map(p => p.passType);
        
        if (passTypes.some(pt => pt.includes('Gold'))) {
          eligibleEvents = [...eligibleEvents, ...eventSchedule.day1];
        }
        // New pass types
        if (passTypes.some(pt => pt.includes('Pixel'))) {
          // Pixel Pass: Basic events (startup expo, panel, competitions, networking)
          const pixelTitles = ['Startup Expo', 'Panel Discussion', 'IPL Auction', 
                               'AI Build-A-Thon', 'Biz-Arena League', 'Networking Arena',
                               'Registration & Welcome', 'Inaugural Ceremony', 'Closing Ceremony'];
          eligibleEvents = [...eventSchedule.day1, ...eventSchedule.day2].filter(e => 
            pixelTitles.some(title => e.title.includes(title))
          );
        }
        if (passTypes.some(pt => pt.includes('Silicon'))) {
          // Silicon Pass: Pixel + workshops + pitch arena + youth conclave
          const excludeTitles = ['The Ten Minute Million', 'Angel Investors Roundtable', 
                                 'Incubator Summit', 'Internship Fair'];
          eligibleEvents = [...eventSchedule.day1, ...eventSchedule.day2].filter(e => 
            !excludeTitles.some(title => e.title.includes(title))
          );
        }
        if (passTypes.some(pt => pt.includes('Quantum'))) {
          // Quantum Pass: All events
          eligibleEvents = [...eventSchedule.day1, ...eventSchedule.day2];
        }
        // TCET Student Pass: Same as Pixel Pass events
        if (passTypes.some(pt => pt.includes('TCET') || pt.toLowerCase().includes('tcet student'))) {
          const tcetTitles = ['Startup Expo', 'Panel Discussion', 'IPL Auction', 
                              'AI Build-A-Thon', 'Biz-Arena League', 'Networking Arena',
                              'Registration & Welcome', 'Inaugural Ceremony', 'Closing Ceremony'];
          eligibleEvents = [...eventSchedule.day1, ...eventSchedule.day2].filter(e => 
            tcetTitles.some(title => e.title.includes(title))
          );
        }
        // Legacy pass types
        if (passTypes.some(pt => pt.includes('Gold'))) {
          eligibleEvents = [...eligibleEvents, ...eventSchedule.day1];
        }
        if (passTypes.some(pt => pt.includes('Silver'))) {
          eligibleEvents = [...eligibleEvents, ...eventSchedule.day2];
        }
        if (passTypes.some(pt => pt.includes('Platinum') || pt.includes('Group'))) {
          eligibleEvents = [...eventSchedule.day1, ...eventSchedule.day2];
        }

        // Remove duplicates
        eligibleEvents = eligibleEvents.filter((event, index, self) =>
          index === self.findIndex((e) => e.title === event.title)
        );

        // Header
        doc.rect(0, 0, doc.page.width, 120).fill(this.colors.primaryRed);
        
        if (this.hasLogo) {
          // White circular background for logo
          doc.save();
          doc.circle(80, 55, 40)
             .fill(this.colors.white);
          doc.restore();
          
          // Logo with proper sizing
          doc.image(this.logoPath, 50, 25, { 
            fit: [60, 60],
            align: 'center',
            valign: 'center'
          });
        }

        doc.fontSize(28)
           .fillColor(this.colors.white)
           .font('Helvetica-Bold')
           .text('MY SCHEDULE', this.hasLogo ? 135 : 50, 40);

        doc.fontSize(14)
           .fillColor(this.colors.lightRed)
           .font('Helvetica')
           .text('E-Summit 2026 | January 23-24, 2026', this.hasLogo ? 135 : 50, 75);

        // User Info
        let currentY = 150;
        doc.fontSize(16)
           .fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text(data.userName, 50, currentY);
        
        currentY += 25;
        doc.fontSize(10)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text(data.userEmail, 50, currentY);

        // Pass Info
        currentY += 30;
        doc.fontSize(12)
           .fillColor(this.colors.textDark)
           .font('Helvetica-Bold')
           .text('Your Passes:', 50, currentY);
        
        currentY += 20;
        data.passes.forEach(pass => {
          doc.fontSize(10)
             .fillColor(this.colors.textGray)
             .font('Helvetica')
             .text(`• ${pass.passType} (${pass.passId})`, 50, currentY);
          currentY += 18;
        });

        // Event Schedule
        currentY += 20;
        doc.fontSize(14)
           .fillColor(this.colors.primaryRed)
           .font('Helvetica-Bold')
           .text('YOUR EVENT SCHEDULE', 50, currentY);
        
        doc.rect(50, currentY + 18, 100, 2).fill(this.colors.primaryRed);
        currentY += 35;

        // Day 1 Events
        const day1Events = eligibleEvents.filter(e => eventSchedule.day1.some(d1 => d1.title === e.title));
        if (day1Events.length > 0) {
          doc.fontSize(12)
             .fillColor(this.colors.textDark)
             .font('Helvetica-Bold')
             .text('DAY 1 - January 23, 2026', 50, currentY);
          currentY += 25;

          day1Events.forEach(event => {
            if (currentY > 700) {
              doc.addPage();
              currentY = 50;
            }

            doc.rect(50, currentY, 495, 60).fillAndStroke(this.colors.lightGray, this.colors.borderGray);
            
            doc.fontSize(10)
               .fillColor(this.colors.primaryRed)
               .font('Helvetica-Bold')
               .text(event.time, 60, currentY + 10);
            
            doc.fontSize(11)
               .fillColor(this.colors.textDark)
               .font('Helvetica-Bold')
               .text(event.title, 60, currentY + 25, { width: 350 });
            
            doc.fontSize(9)
               .fillColor(this.colors.textGray)
               .font('Helvetica')
               .text(`${event.venue}  •  ${event.category}`, 60, currentY + 43);
            
            currentY += 70;
          });
          currentY += 10;
        }

        // Day 2 Events
        const day2Events = eligibleEvents.filter(e => eventSchedule.day2.some(d2 => d2.title === e.title));
        if (day2Events.length > 0) {
          if (currentY > 650) {
            doc.addPage();
            currentY = 50;
          }

          doc.fontSize(12)
             .fillColor(this.colors.textDark)
             .font('Helvetica-Bold')
             .text('DAY 2 - January 24, 2026', 50, currentY);
          currentY += 25;

          day2Events.forEach(event => {
            if (currentY > 700) {
              doc.addPage();
              currentY = 50;
            }

            doc.rect(50, currentY, 495, 60).fillAndStroke(this.colors.lightGray, this.colors.borderGray);
            
            doc.fontSize(10)
               .fillColor(this.colors.primaryRed)
               .font('Helvetica-Bold')
               .text(event.time, 60, currentY + 10);
            
            doc.fontSize(11)
               .fillColor(this.colors.textDark)
               .font('Helvetica-Bold')
               .text(event.title, 60, currentY + 25, { width: 350 });
            
            doc.fontSize(9)
               .fillColor(this.colors.textGray)
               .font('Helvetica')
               .text(`${event.venue}  •  ${event.category}`, 60, currentY + 43);
            
            currentY += 70;
          });
        }

        // Footer
        doc.fontSize(8)
           .fillColor(this.colors.textGray)
           .font('Helvetica')
           .text('Generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 
                 50, doc.page.height - 80, { align: 'center', width: 495 })
           .text('For updates and more information, visit www.esummit2026.com', 
                 50, doc.page.height - 65, { align: 'center', width: 495 });

        doc.end();
      } catch (error) {
        logger.error('Error generating schedule PDF:', error);
        reject(error);
      }
    });
  }
}

export default new PDFService();