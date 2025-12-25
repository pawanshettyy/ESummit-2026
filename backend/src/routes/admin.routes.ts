import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { konfhubService, KONFHUB_TICKET_IDS, KONFHUB_CUSTOM_FORM_IDS } from '../services/konfhub.service';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads (CSV and Excel)
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max for larger exports
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  },
});

/**
 * Upload and import KonfHub CSV/Excel export
 * POST /api/v1/admin/import-passes
 * 
 * KonfHub Export Fields Supported:
 * - Attendee Details: Email Address, Name, Country, Attendee category, Access category, 
 *   Country code, Dial code, Phone Number, College, Check-in Status
 * - WhatsApp Details: WhatsApp Number, WA country code, WA dial code, Whatsapp consent
 * - Registration Details: Coupon code, Payment ID, Ticket name, Registered at, 
 *   Registration status, Booking ID, Ticket price, Amount paid, Balance amount,
 *   Refund amount, Refund type, Tax amount, Processing fee, Code tracking ID,
 *   Ticket URL, Invoice URL
 * - UTM Details: UTM source, UTM medium, UTM campaign
 * - GST Details: Buyer name, Buyer email
 * - Attendee QR Code: Embed QR codes in excel
 * 
 * Required: Admin authentication via secret key
 */
router.post('/import-passes', upload.single('file'), async (req: Request, res: Response) => {
  let filePath: string | undefined;
  
  try {
    // Admin authentication via secret key in header or body
    const adminSecret = req.headers['x-admin-secret'] || req.body?.adminSecret;
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized - Invalid admin secret', 403);
    }

    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    logger.info('Pass import started', { 
      filename: req.file.originalname, 
      size: req.file.size,
      type: fileExt 
    });

    let records: any[];

    // Parse based on file type
    if (fileExt === '.csv') {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        relax_column_count: true,
      });
    } else {
      // For Excel files, we need xlsx package
      try {
        const XLSX = require('xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        records = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      } catch (xlsxError) {
        logger.error('Excel parsing error - xlsx package may not be installed:', xlsxError);
        return sendError(res, 'Excel parsing failed. Please use CSV format or install xlsx package.', 400);
      }
    }

    logger.info(`Parsing ${records.length} records from ${fileExt} file`);

    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as any[],
    };

    const importBatchId = `import_${Date.now()}`;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNum = i + 2; // Account for header row
      
      try {
        const email = record['Email Address']?.toLowerCase().trim();
        
        if (!email) {
          results.skipped++;
          logger.debug(`Row ${rowNum}: Skipped - no email`);
          continue;
        }

        // Skip cancelled/refunded registrations
        const registrationStatus = record['Registration status']?.toLowerCase();
        if (registrationStatus === 'cancelled' || registrationStatus === 'refunded') {
          results.skipped++;
          logger.debug(`Row ${rowNum}: Skipped - ${registrationStatus}`);
          continue;
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          const name = record['Name'] || email.split('@')[0];
          
          user = await prisma.user.create({
            data: {
              email,
              fullName: name,
              clerkUserId: `imported_${importBatchId}_${i}`, // Placeholder until they sign in with Clerk
              ...(record['College'] && { college: record['College'] }),
              ...(record['Phone Number'] && { phone: record['Phone Number'] }),
            },
          });
          logger.debug(`Row ${rowNum}: Created new user for ${email}`);
        }

        // Extract pass data from KonfHub export
        const bookingId = record['Booking ID']?.trim();
        const ticketName = record['Ticket name']?.trim();
        const paymentId = record['Payment ID']?.trim();
        
        // Parse monetary values (handle currency symbols and commas)
        const parseAmount = (val: string) => {
          if (!val) return 0;
          return parseFloat(val.replace(/[^0-9.-]/g, '') || '0');
        };

        const amountPaid = parseAmount(record['Amount paid']);
        const ticketPrice = parseAmount(record['Ticket price']);
        const balanceAmount = parseAmount(record['Balance amount']);
        const refundAmount = parseAmount(record['Refund amount']);
        const taxAmount = parseAmount(record['Tax amount']);
        const processingFee = parseAmount(record['Processing fee']);

        // Parse registration date
        let purchaseDate = new Date();
        if (record['Registered at']) {
          try {
            purchaseDate = new Date(record['Registered at']);
            if (isNaN(purchaseDate.getTime())) {
              purchaseDate = new Date();
            }
          } catch {
            purchaseDate = new Date();
          }
        }

        // Check for existing pass by booking ID
        const existingPass = bookingId 
          ? await prisma.pass.findFirst({ where: { bookingId } })
          : null;

        // Build comprehensive ticket details from all KonfHub fields
        const ticketDetails = {
          // Attendee Details
          attendeeName: record['Name'],
          email: record['Email Address'],
          country: record['Country'],
          attendeeCategory: record['Attendee category'],
          accessCategory: record['Access category'],
          countryCode: record['Country code'],
          dialCode: record['Dial code'],
          phone: record['Phone Number'],
          college: record['College'],
          checkInStatus: record['Check-in Status'],
          
          // WhatsApp Details
          whatsappNumber: record['WhatsApp Number'],
          waCountryCode: record['WA country code'],
          waDialCode: record['WA dial code'],
          whatsappConsent: record['Whatsapp consent'],
          
          // Registration Details
          couponCode: record['Coupon code'],
          paymentId: record['Payment ID'],
          ticketName: record['Ticket name'],
          registeredAt: record['Registered at'],
          registrationStatus: record['Registration status'],
          bookingId: record['Booking ID'],
          ticketPrice: record['Ticket price'],
          amountPaid: record['Amount paid'],
          balanceAmount: record['Balance amount'],
          refundAmount: record['Refund amount'],
          refundType: record['Refund type'],
          taxAmount: record['Tax amount'],
          processingFee: record['Processing fee'],
          codeTrackingId: record['Code tracking ID'],
          ticketUrl: record['Ticket URL'],
          invoiceUrl: record['Invoice URL'],
          
          // UTM Details
          utmSource: record['UTM source'],
          utmMedium: record['UTM medium'],
          utmCampaign: record['UTM campaign'],
          
          // GST Details
          buyerName: record['Buyer name'],
          buyerEmail: record['Buyer email'],
          
          // Import metadata
          importedAt: new Date().toISOString(),
          importBatchId,
          importedFrom: 'konfhub_export',
        };

        // Determine pass status
        let status = 'Pending';
        if (registrationStatus === 'confirmed' || registrationStatus === 'success') {
          status = 'Active';
        } else if (record['Check-in Status']?.toLowerCase() === 'checked-in') {
          status = 'Used';
        }

        const passData = {
          userId: user.id,
          passType: ticketName || 'General Pass',
          passId: bookingId || `PASS-${importBatchId}-${i}`,
          bookingId: bookingId || null,
          konfhubTicketId: paymentId || bookingId || null,
          konfhubOrderId: paymentId || null,
          price: amountPaid || ticketPrice,
          purchaseDate,
          ticketDetails,
          qrCodeUrl: record['Ticket URL'] || null,
          qrCodeData: bookingId || paymentId || null,
          status,
        };

        if (existingPass) {
          await prisma.pass.update({
            where: { id: existingPass.id },
            data: {
              price: passData.price,
              purchaseDate: passData.purchaseDate,
              ticketDetails: passData.ticketDetails,
              status: passData.status,
              qrCodeUrl: passData.qrCodeUrl,
            },
          });
          results.updated++;
          logger.debug(`Row ${rowNum}: Updated pass for ${email}`);
        } else {
          await prisma.pass.create({ data: passData });
          results.created++;
          logger.debug(`Row ${rowNum}: Created pass for ${email}`);
        }

      } catch (error: any) {
        logger.error(`Error processing row ${rowNum}:`, error);
        results.errors.push({
          row: rowNum,
          email: record['Email Address'],
          bookingId: record['Booking ID'],
          error: error.message,
        });
      }
    }

    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    logger.info('Pass import completed', {
      ...results,
      total: records.length,
      batchId: importBatchId,
    });

    sendSuccess(res, 'Import completed successfully', {
      ...results,
      total: records.length,
      batchId: importBatchId,
    });

  } catch (error: any) {
    logger.error('Pass import error:', error);
    
    // Clean up file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    sendError(res, error.message || 'Import failed', 500);
  }
});

/**
 * Get import history and stats
 * GET /api/v1/admin/import-history
 */
router.get('/import-history', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.query.adminSecret;
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized', 403);
    }

    // Get all passes with import metadata
    const importedPasses = await prisma.pass.findMany({
      where: {
        ticketDetails: {
          path: ['importBatchId'],
          not: prisma.AnyNull,
        },
      },
      select: {
        id: true,
        passType: true,
        status: true,
        price: true,
        createdAt: true,
        ticketDetails: true,
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group by batch
    const batches = importedPasses.reduce((acc, pass) => {
      const details = pass.ticketDetails as any;
      const batchId = details?.importBatchId;
      
      if (batchId) {
        if (!acc[batchId]) {
          acc[batchId] = {
            batchId,
            importedAt: details?.importedAt,
            count: 0,
            totalRevenue: 0,
            passTypes: {} as Record<string, number>,
            statuses: {} as Record<string, number>,
          };
        }
        acc[batchId].count++;
        acc[batchId].totalRevenue += pass.price || 0;
        acc[batchId].passTypes[pass.passType] = (acc[batchId].passTypes[pass.passType] || 0) + 1;
        acc[batchId].statuses[pass.status] = (acc[batchId].statuses[pass.status] || 0) + 1;
      }
      
      return acc;
    }, {} as any);

    sendSuccess(res, 'Import history fetched', {
      totalImportedPasses: importedPasses.length,
      batches: Object.values(batches).sort((a: any, b: any) => 
        new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime()
      ),
    });

  } catch (error: any) {
    logger.error('Get import history error:', error);
    sendError(res, error.message, 500);
  }
});

/**
 * Get pass statistics for admin dashboard
 * GET /api/v1/admin/stats
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.query.adminSecret;
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized', 403);
    }

    // Get all passes with aggregations
    const [
      totalPasses,
      activePasses,
      usedPasses,
      passesByType,
      totalRevenue,
      recentPasses,
    ] = await Promise.all([
      prisma.pass.count(),
      prisma.pass.count({ where: { status: 'Active' } }),
      prisma.pass.count({ where: { status: 'Used' } }),
      prisma.pass.groupBy({
        by: ['passType'],
        _count: true,
        _sum: { price: true },
      }),
      prisma.pass.aggregate({
        _sum: { price: true },
      }),
      prisma.pass.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          passType: true,
          status: true,
          price: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              fullName: true,
            },
          },
        },
      }),
    ]);

    sendSuccess(res, 'Stats fetched', {
      overview: {
        totalPasses,
        activePasses,
        usedPasses,
        pendingPasses: totalPasses - activePasses - usedPasses,
        totalRevenue: totalRevenue._sum.price || 0,
      },
      byPassType: passesByType.map(p => ({
        passType: p.passType,
        count: p._count,
        revenue: p._sum.price || 0,
      })),
      recentPasses,
    });

  } catch (error: any) {
    logger.error('Get stats error:', error);
    sendError(res, error.message, 500);
  }
});

/**
 * Delete a pass (admin only)
 * DELETE /api/v1/admin/passes/:passId
 */
router.delete('/passes/:passId', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'];
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized', 403);
    }

    const { passId } = req.params;

    const pass = await prisma.pass.delete({
      where: { id: passId },
    });

    logger.info('Pass deleted by admin', { passId, passType: pass.passType });
    sendSuccess(res, 'Pass deleted', { deletedPass: pass });

  } catch (error: any) {
    logger.error('Delete pass error:', error);
    sendError(res, error.message, 500);
  }
});

/**
 * Sync passes from KonfHub API
 * POST /api/v1/admin/sync-konfhub
 * 
 * Fetches all attendees from KonfHub API and syncs to local database
 * 
 * IMPORTANT: Requires the PRIVATE API KEY from KonfHub organizer dashboard.
 * To get the private API key:
 * 1. Log in to KonfHub as the event organizer
 * 2. Go to Event Dashboard > Settings > API Settings (or Developer Settings)
 * 3. Generate a "Private API Key" for the event
 * 4. Set KONFHUB_API_KEY in .env with this private key
 * 
 * The button ID or widget key won't work - it must be the private API key.
 * 
 * Requires: KONFHUB_API_KEY (private) and KONFHUB_EVENT_ID in .env
 */
router.post('/sync-konfhub', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.body?.adminSecret;
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized - Invalid admin secret', 403);
    }

    // Check if KonfHub is configured
    const configStatus = konfhubService.getConfigStatus();
    if (!konfhubService.isConfigured()) {
      return sendError(res, 'KonfHub not configured. Set KONFHUB_API_KEY and KONFHUB_EVENT_ID in .env', 400, {
        configStatus,
        note: 'Make sure to use the PRIVATE API KEY from KonfHub organizer dashboard, not the button/widget ID.',
      });
    }

    logger.info('Starting KonfHub sync');

    const results = await konfhubService.syncAttendeesToDatabase();

    sendSuccess(res, 'KonfHub sync completed', results);

  } catch (error: any) {
    logger.error('KonfHub sync error:', error);
    
    // Provide helpful error message for 403 errors
    if (error.message?.includes('403')) {
      return sendError(res, 'KonfHub API returned 403 Forbidden. Make sure you are using the PRIVATE API KEY from the KonfHub organizer dashboard (Event > Settings > API Settings), not the button/widget ID. If the issue persists, use the CSV import endpoint (/api/v1/admin/import-passes) instead.', 403);
    }
    
    sendError(res, error.message || 'Sync failed', 500);
  }
});

/**
 * Get KonfHub configuration status
 * GET /api/v1/admin/konfhub-status
 */
router.get('/konfhub-status', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.query.adminSecret;
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized', 403);
    }

    const configStatus = konfhubService.getConfigStatus();
    
    sendSuccess(res, 'KonfHub configuration status', {
      isConfigured: konfhubService.isConfigured(),
      ...configStatus,
      apiKeyConfigured: configStatus.apiKey ? 'Yes (hidden)' : 'No',
      eventIdConfigured: configStatus.eventId ? process.env.KONFHUB_EVENT_ID : 'No',
    });

  } catch (error: any) {
    logger.error('Get KonfHub status error:', error);
    sendError(res, error.message, 500);
  }
});

/**
 * Test KonfHub API connection by fetching a few attendees
 * GET /api/v1/admin/test-konfhub
 */
router.get('/test-konfhub', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.query.adminSecret;
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized', 403);
    }

    if (!konfhubService.isConfigured()) {
      return sendError(res, 'KonfHub not configured', 400, {
        configStatus: konfhubService.getConfigStatus(),
      });
    }

    // Fetch just 5 attendees as a test
    const result = await konfhubService.fetchAllAttendees({ limit: 5 });
    
    sendSuccess(res, 'KonfHub API test successful', {
      eventName: result.eventName,
      totalAttendees: result.count,
      sampleCount: result.attendees.length,
      sample: result.attendees.map((a: any) => ({
        name: a.name,
        email: a.email_id?.substring(0, 5) + '***', // Mask email
        ticketName: a.ticket_name || a.ticket_type,
        registrationStatus: a.registration_status,
        bookingId: a.booking_id,
      })),
    });

  } catch (error: any) {
    logger.error('Test KonfHub error:', error);
    
    // Provide detailed help for 403 errors
    if (error.message?.includes('403')) {
      return sendError(res, 'KonfHub API returned 403 Forbidden', 403, {
        possibleCauses: [
          '1. The KONFHUB_API_KEY may be a widget/button key instead of the Private API Key',
          '2. The Private API Key needs to be generated from: KonfHub Dashboard > Your Event > Settings > API Settings',
          '3. The API Key may not have permission for the attendees endpoint',
        ],
        currentConfig: {
          apiKeySet: !!process.env.KONFHUB_API_KEY,
          eventId: process.env.KONFHUB_EVENT_ID,
        },
        recommendation: 'Use the CSV/Excel import at POST /api/v1/admin/import-passes instead. Export attendees from KonfHub Dashboard > Attendees > Export.',
      });
    }
    
    sendError(res, error.message, 500);
  }
});

/**
 * Register a free ticket via KonfHub Capture API
 * POST /api/v1/admin/capture-ticket
 * 
 * This endpoint uses the KonfHub Capture API to register free tickets.
 * Useful for registering TCET student passes programmatically.
 */
router.post('/capture-ticket', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.body?.adminSecret;
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized', 403);
    }

    const { ticketId, attendees } = req.body;

    if (!ticketId) {
      return sendError(res, 'ticketId is required', 400);
    }

    if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
      return sendError(res, 'attendees array is required', 400);
    }

    // Validate each attendee
    for (const attendee of attendees) {
      if (!attendee.name || !attendee.email) {
        return sendError(res, 'Each attendee must have name and email', 400);
      }
    }

    const result = await konfhubService.captureTicket({
      eventId: process.env.KONFHUB_EVENT_ID || '',
      ticketId,
      attendees: attendees.map((a: any) => ({
        name: a.name,
        email: a.email,
        phone: a.phone || '',
        countryCode: a.countryCode || 'in',
        dialCode: a.dialCode || '+91',
        college: a.college || '',
        whatsappNumber: a.whatsappNumber || a.phone || '',
        waCountryCode: a.waCountryCode || 'in',
        waDialCode: a.waDialCode || '+91',
        whatsappConsent: a.whatsappConsent ?? true,
        customForms: a.customForms || {},
      })),
    });

    // Create passes in local database for each booking
    const passes = [];
    for (let i = 0; i < result.bookingIds.length; i++) {
      const bookingId = result.bookingIds[i];
      const attendee = attendees[i];
      const ticketUrl = result.url[bookingId]?.ticket;

      // Find or create user
      let user = await prisma.user.findUnique({ 
        where: { email: attendee.email.toLowerCase() } 
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: attendee.email.toLowerCase(),
            fullName: attendee.name,
            clerkUserId: `captured_${Date.now()}_${i}`,
            ...(attendee.college && { college: attendee.college }),
            ...(attendee.phone && { phone: attendee.phone }),
          },
        });
      }

      // Create pass
      const pass = await prisma.pass.create({
        data: {
          userId: user.id,
          passType: result.url[bookingId]?.ticketName || 'KonfHub Pass',
          passId: bookingId,
          bookingId,
          konfhubTicketId: ticketId,
          price: 0,
          purchaseDate: new Date(),
          status: 'Active',
          qrCodeUrl: ticketUrl,
          qrCodeData: bookingId,
          ticketDetails: {
            attendeeName: attendee.name,
            email: attendee.email,
            phone: attendee.phone,
            college: attendee.college,
            ticketName: result.url[bookingId]?.ticketName,
            ticketUrl,
            registeredAt: new Date().toISOString(),
            registrationStatus: 'Active',
            source: 'admin_capture',
          },
        },
      });

      passes.push({ bookingId, pass, ticketUrl });
    }

    sendSuccess(res, 'Tickets captured successfully', {
      bookingIds: result.bookingIds,
      type: result.type,
      message: result.message,
      passes,
    });

  } catch (error: any) {
    logger.error('Capture ticket error:', error);
    sendError(res, error.message, 500);
  }
});

/**
 * Get KonfHub ticket IDs configuration
 * GET /api/v1/admin/konfhub-tickets
 */
router.get('/konfhub-tickets', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.query.adminSecret;
    const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
    
    if (adminSecret !== expectedSecret) {
      return sendError(res, 'Unauthorized', 403);
    }

    sendSuccess(res, 'KonfHub ticket configuration', {
      ticketIds: KONFHUB_TICKET_IDS,
      customFormIds: KONFHUB_CUSTOM_FORM_IDS,
      eventId: process.env.KONFHUB_EVENT_ID,
    });

  } catch (error: any) {
    logger.error('Get KonfHub tickets error:', error);
    sendError(res, error.message, 500);
  }
});

export default router;
