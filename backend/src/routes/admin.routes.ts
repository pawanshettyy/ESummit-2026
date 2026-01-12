import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response.util';
import logger from '../utils/logger.util';
import { konfhubService, KONFHUB_TICKET_IDS, KONFHUB_CUSTOM_FORM_IDS } from '../services/konfhub.service';
import { getClerkUserId } from '../middleware/clerk.middleware';

const router = Router();

// Helper to extract admin secret from headers (x-admin-secret or Authorization: Bearer ...)
// Skips JWT tokens (starting with 'eyJ') in Authorization header
const getAdminSecretFromReq = (req: Request): string | undefined => {
  const headerSecret = (req.headers['x-admin-secret'] as string) || undefined;
  if (headerSecret) return headerSecret;
  const auth = (req.headers['authorization'] as string) || (req.headers['Authorization'] as string) || undefined;
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim();
    // Don't treat JWT tokens as admin secrets
    if (!token.startsWith('eyJ')) {
      return token;
    }
  }
  return undefined;
};

// Check whether the request is authorized as admin either via admin-secret or Clerk user metadata
const isAdminAuthorized = async (req: Request): Promise<boolean> => {
  const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';

  // Check header / authorization / body / query for admin secret first
  const helperSecret = getAdminSecretFromReq(req);
  if (helperSecret && helperSecret === expectedSecret) {
    logger.debug('Admin authorized via admin secret');
    return true;
  }
  if (req.body?.adminSecret && req.body.adminSecret === expectedSecret) {
    logger.debug('Admin authorized via body admin secret');
    return true;
  }
  if (req.query?.adminSecret && String(req.query.adminSecret) === expectedSecret) {
    logger.debug('Admin authorized via query admin secret');
    return true;
  }

  // Fallback: check Clerk-authenticated user with proper admin role
  try {
    const userId = getClerkUserId(req as any);
    if (!userId) {
      logger.debug('isAdminAuthorized: no Clerk userId found in request');
      return false;
    }

    // Import clerk client for metadata check
    const { createClerkClient } = await import('@clerk/backend');
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const user = await clerkClient.users.getUser(userId);
    const publicMeta = (user as any)?.publicMetadata || (user as any)?.public_metadata || {};
    const adminRole = publicMeta?.adminRole;

    logger.debug('Checking Clerk admin authorization', {
      userId,
      email: user.primaryEmailAddress?.emailAddress,
      hasPublicMetadata: !!publicMeta,
      adminRole: adminRole || 'not set',
      publicMetadataKeys: Object.keys(publicMeta),
    });

    // Check for valid admin roles
    if (adminRole && ["core", "jc", "oc"].includes(String(adminRole).toLowerCase())) {
      logger.info('Admin authorized via Clerk public metadata', { userId, adminRole });
      return true;
    }

    // Check organization roles as fallback
    const orgMemberships = (user as any)?.organizationMemberships || [];
    for (const membership of orgMemberships) {
      const role = membership?.role;
      if (role && ["org:admin", "admin"].includes(String(role).toLowerCase())) {
        logger.info('Admin authorized via Clerk organization role', { userId, orgRole: role });
        return true;
      }
    }

    logger.warn('Admin authorization failed: user does not have required adminRole in Clerk metadata', {
      userId,
      email: user.primaryEmailAddress?.emailAddress,
      adminRole: adminRole || 'not set',
      publicMetadataKeys: Object.keys(publicMeta),
    });
    return false;
  } catch (err) {
    logger.error('isAdminAuthorized: clerk user fetch failed', { err: String(err) });
    return false;
  }
};

// Debug endpoint to inspect how admin secret is delivered (booleans only)
router.get('/debug-admin-secret', (req: Request, res: Response) => {
  const expectedSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';
  const header = !!req.headers['x-admin-secret'];
  const authorization = (req.headers['authorization'] as string) || (req.headers['Authorization'] as string) || '';
  const authHeaderPresent = !!authorization;
  const authIsBearer = authorization.toLowerCase().startsWith('bearer ');
  const bodySecretPresent = !!req.body?.adminSecret;
  const querySecretPresent = !!req.query?.adminSecret;
  const match = (
    (req.headers['x-admin-secret'] as string) === expectedSecret ||
    (authIsBearer && authorization.slice(7).trim() === expectedSecret) ||
    req.body?.adminSecret === expectedSecret ||
    req.query?.adminSecret === expectedSecret
  );
  return res.json({ header, authHeaderPresent, authIsBearer, bodySecretPresent, querySecretPresent, match });
});

// Debug endpoint to check Clerk user metadata
router.get('/debug-clerk-auth', async (req: Request, res: Response) => {
  try {
    const userId = getClerkUserId(req as any);
    
    if (!userId) {
      return res.json({
        success: false,
        message: 'No Clerk user ID found in request',
        hasAuthHeader: !!req.headers.authorization,
        authHeader: req.headers.authorization ? 'present (redacted)' : 'missing',
      });
    }

    // Import clerk client for metadata check
    const { createClerkClient } = await import('@clerk/backend');
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const user = await clerkClient.users.getUser(userId);
    const publicMeta = (user as any)?.publicMetadata || (user as any)?.public_metadata || {};
    const privateMeta = (user as any)?.privateMetadata || (user as any)?.private_metadata || {};
    
    return res.json({
      success: true,
      userId,
      email: user.primaryEmailAddress?.emailAddress,
      publicMetadata: publicMeta,
      publicMetadataKeys: Object.keys(publicMeta),
      privateMetadataKeys: Object.keys(privateMeta),
      adminRole: publicMeta?.adminRole || 'NOT SET',
      hasRequiredRole: publicMeta?.adminRole && ["core", "jc", "oc"].includes(String(publicMeta.adminRole).toLowerCase()),
      organizationMemberships: (user as any)?.organizationMemberships?.map((m: any) => ({
        role: m.role,
        organization: m.organization?.name,
      })) || [],
    });
  } catch (error: any) {
    logger.error('Debug Clerk auth error:', error);
    return res.json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
});

// Use /tmp/uploads in serverless/production, otherwise use local uploads
const uploadsDir =
  process.env.VERCEL || process.env.NODE_ENV === 'production'
    ? '/tmp/uploads'
    : path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads (CSV and Excel)
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max for larger exports
  },
  fileFilter: (_req, file, cb) => {
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
 * Import passes from KonfHub export (CSV/Excel)
 * POST /api/v1/admin/import-passes
 */
router.post('/import-passes', upload.single('file'), async (req: Request, res: Response) => {
  let filePath: string | undefined;
  
  try {
    // Authorize admin via admin-secret or Clerk public metadata
    if (!(await isAdminAuthorized(req))) {
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
      processedUsers: [] as { email: string; whatsappNumber?: string; matchType: string; passesCreated: number; passesUpdated: number }[],
    };

    const importBatchId = `import_${Date.now()}`;

    // Helper function to get field value case-insensitively
    // KonfHub exports have inconsistent casing (e.g., "Booking Id" vs "Booking ID")
    const getField = (record: any, ...possibleNames: string[]): string => {
      for (const name of possibleNames) {
        if (record[name] !== undefined && record[name] !== null) {
          return String(record[name]).trim();
        }
      }
      // Try case-insensitive search
      const recordKeys = Object.keys(record);
      for (const name of possibleNames) {
        const found = recordKeys.find(k => k.toLowerCase() === name.toLowerCase());
        if (found && record[found] !== undefined && record[found] !== null) {
          return String(record[found]).trim();
        }
      }
      return '';
    };

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNum = i + 2; // Account for header row
      
      try {
        const email = getField(record, 'email id', 'Email ID', 'email', 'Email Address')?.toLowerCase()?.trim();
        const whatsappNumber = getField(record, 'whatsapp number', 'WhatsApp Number', 'whatsapp_number')?.trim();
        
        // Require at least email OR whatsapp number
        if (!email && !whatsappNumber) {
          results.skipped++;
          logger.debug(`Row ${rowNum}: Skipped - no email or whatsapp number`);
          continue;
        }

        // Skip cancelled/refunded registrations (but not CANCEL - that's a valid status for cancelled orders we want to track)
        const registrationStatus = getField(record, 'Registration Status', 'Registration status', 'registration_status')?.toLowerCase();
        // Only skip if fully refunded - keep CANCEL status for tracking
        if (registrationStatus === 'refunded') {
          results.skipped++;
          logger.debug(`Row ${rowNum}: Skipped - ${registrationStatus}`);
          continue;
        }

        // Find user by email first, then by whatsapp number
        let user = null;
        let matchType = '';

        if (email) {
          user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            matchType = 'email';
          }
        }

        // If not found by email, try whatsapp number
        if (!user && whatsappNumber) {
          // Clean whatsapp number (remove spaces, dashes, etc.)
          const cleanWhatsapp = whatsappNumber.replace(/[\s\-\(\)]/g, '');
          user = await prisma.user.findFirst({ 
            where: { 
              phone: {
                contains: cleanWhatsapp
              }
            } 
          });
          if (user) {
            matchType = 'whatsapp';
          }
        }

        const name = getField(record, 'name', 'Name', 'Full Name', 'full_name') || (email ? email.split('@')[0] : `User_${i}`);

        if (!user) {
          // Skip row if user doesn't exist - don't create new users
          results.skipped++;
          results.errors.push({
            row: rowNum,
            email: email || 'N/A',
            whatsappNumber: whatsappNumber || 'N/A',
            reason: 'User not found - neither email nor WhatsApp number matches existing user'
          });
          logger.debug(`Row ${rowNum}: Skipped - user not found for ${email || whatsappNumber}`);
          continue;
        } else {
          logger.debug(`Row ${rowNum}: Matched existing user by ${matchType}: ${user.email}`);
        }

        // Extract pass data from KonfHub export
        const bookingId = getField(record, 'booking id', 'Booking ID', 'booking_id');
        const ticketName = getField(record, 'ticketname', 'Ticket Name', 'ticket_name');
        
        // Parse monetary values (handle currency symbols and commas)
        const parseAmount = (val: string) => {
          if (!val) return 0;
          return parseFloat(val.replace(/[^0-9.-]/g, '') || '0');
        };

        const amountPaid = parseAmount(getField(record, 'amount paid', 'Amount Paid', 'amount_paid'));
        const ticketPrice = parseAmount(getField(record, 'ticket price', 'Ticket Price', 'ticket_price'));

        // Parse registration date (handle format: DD-MM-YYYY HH:MM:SS)
        let purchaseDate = new Date();
        const registeredAt = getField(record, 'registered at', 'Registered At', 'registered_at');
        if (registeredAt) {
          try {
            // Handle DD-MM-YYYY HH:MM:SS format
            const dateMatch = registeredAt.match(/(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
            if (dateMatch) {
              const [, day, month, year, hour, minute, second] = dateMatch;
              purchaseDate = new Date(
                parseInt(year), 
                parseInt(month) - 1, 
                parseInt(day),
                parseInt(hour),
                parseInt(minute),
                parseInt(second)
              );
            } else {
              purchaseDate = new Date(registeredAt);
            }
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

        // Build ticket details with user's specific fields
        const ticketDetails = {
          name,
          email: email || '',
          ticketName,
          registeredAt,
          bookingId,
          ticketPrice: ticketPrice.toString(),
          amountPaid: amountPaid.toString(),
          whatsappNumber,
          importedAt: new Date().toISOString(),
          importBatchId,
          importedFrom: 'excel_import',
          matchType, // Track how the user was matched
        };

        const passData = {
          userId: user.id,
          passType: ticketName || 'General Pass',
          passId: bookingId || `PASS-${importBatchId}-${i}`,
          bookingId: bookingId || null,
          price: amountPaid || ticketPrice,
          purchaseDate,
          ticketDetails,
          qrCodeData: bookingId || null,
          status: 'Active', // Assume active for imported passes
        };

        if (existingPass) {
          await prisma.pass.update({
            where: { id: existingPass.id },
            data: {
              price: passData.price,
              purchaseDate: passData.purchaseDate,
              ticketDetails: passData.ticketDetails,
              status: passData.status,
            },
          });
          results.updated++;
          logger.debug(`Row ${rowNum}: Updated pass for ${email}`);
        } else {
          await prisma.pass.create({ data: passData });
          results.created++;
          logger.debug(`Row ${rowNum}: Created pass for ${email}`);
        }

        // Track processed user
        const existingUserIndex = results.processedUsers.findIndex(u => u.email === user.email);
        if (existingUserIndex >= 0) {
          // Update existing user stats
          results.processedUsers[existingUserIndex].passesCreated += existingPass ? 0 : 1;
          results.processedUsers[existingUserIndex].passesUpdated += existingPass ? 1 : 0;
        } else {
          // Add new processed user
          results.processedUsers.push({
            email: user.email,
            whatsappNumber: user.phone || undefined,
            matchType,
            passesCreated: existingPass ? 0 : 1,
            passesUpdated: existingPass ? 1 : 0,
          });
        }

      } catch (error: any) {
        logger.error(`Error processing row ${rowNum}:`, error);
        results.errors.push({
          row: rowNum,
          email: record['email id'] || record['Email ID'],
          bookingId: record['booking id'] || record['Booking ID'],
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

    return sendSuccess(res, 'Import completed successfully', {
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
    
    return sendError(res, error.message || 'Import failed', 500);
  }
});

/**
 * Get import history and stats
 * GET /api/v1/admin/import-history
 */
router.get('/import-history', async (req: Request, res: Response) => {
  try {
    // Authorize admin via admin-secret or Clerk public metadata
    if (!(await isAdminAuthorized(req))) {
      return sendError(res, 'Unauthorized', 403);
    }

    // Get all passes with import metadata (where ticketDetails exists)
    // Note: Prisma JSON field filtering is limited, so we filter client-side
    const allPasses = await prisma.pass.findMany({
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

    // Filter passes that have ticketDetails (import metadata)
    const importedPasses = allPasses.filter(pass => pass.ticketDetails != null);

    // Group by batch
    const batches = importedPasses.reduce((acc: any, pass: any) => {
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

    return sendSuccess(res, 'Import history fetched', {
      totalImportedPasses: importedPasses.length,
      batches: Object.values(batches).sort((a: any, b: any) => 
        new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime()
      ),
    });

  } catch (error: any) {
    logger.error('Get import history error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Get pass statistics for admin dashboard
 * GET /api/v1/admin/stats
 */
router.get('/stats', async (req: Request, res: Response) => {
  // Set CORS headers explicitly
  const origin = req.headers.origin;
  const allowedOrigins = ['https://tcetesummit.in', 'https://www.tcetesummit.in'];
  
  if (allowedOrigins.includes(origin || '') || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'x-admin-secret, content-type, authorization, x-requested-with');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  try {
    if (!(await isAdminAuthorized(req))) {
      logger.warn('Unauthorized admin access attempt to /stats', {
        hasAuthHeader: !!req.headers.authorization,
        origin: req.headers.origin,
      });
      return sendError(res, 'Unauthorized: Admin access required. Please ensure your Clerk account has adminRole set to \"core\", \"jc\", or \"oc\" in public metadata.', 403);
    }

    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get all passes with aggregations
    const [
      totalUsers,
      totalPasses,
      verifiedUsers,
      activePasses,
      usedPasses,
      passesByType,
      totalRevenue,
      totalEvents,
      totalRegistrations,
      checkInsToday,
      recentPasses,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.pass.count(),
      prisma.user.count({ where: { bookingVerified: true } }),
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
      prisma.event.count(),
      prisma.eventRegistration.count(),
      prisma.checkIn.count({
        where: {
          checkInTime: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
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

    // Build pass type breakdown object
    const passTypeBreakdown: Record<string, number> = {};
    
    // Helper function to normalize pass type names to title case
    const toTitleCase = (str: string): string => {
      return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };
    
    passesByType.forEach(p => {
      const normalizedType = toTitleCase(p.passType);
      passTypeBreakdown[normalizedType] = (passTypeBreakdown[normalizedType] || 0) + p._count;
    });

    return sendSuccess(res, 'Stats fetched', {
      totalUsers,
      totalPasses,
      verifiedPasses: verifiedUsers, // Users with bookingVerified = true
      unverifiedPasses: totalUsers - verifiedUsers,
      totalEvents,
      totalRegistrations,
      checkInsToday,
      passTypeBreakdown,
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
    return sendError(res, error.message, 500);
  }
});

/**
 * Delete a pass (admin only)
 * DELETE /api/v1/admin/passes/:passId
 */
router.delete('/passes/:passId', async (req: Request, res: Response) => {
  try {
    if (!(await isAdminAuthorized(req))) {
      return sendError(res, 'Unauthorized - Invalid admin secret', 403);
    }

    const { passId } = req.params;

    const pass = await prisma.pass.delete({
      where: { id: passId },
    });

    logger.info('Pass deleted by admin', { passId, passType: pass.passType });
    return sendSuccess(res, 'Pass deleted', { deletedPass: pass });

  } catch (error: any) {
    logger.error('Delete pass error:', error);
    return sendError(res, error.message, 500);
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
    if (!(await isAdminAuthorized(req))) {
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

    return sendSuccess(res, 'KonfHub sync completed', results);

  } catch (error: any) {
    logger.error('KonfHub sync error:', error);
    
    // Provide helpful error message for 403 errors
    if (error.message?.includes('403')) {
      return sendError(res, 'KonfHub API returned 403 Forbidden. Make sure you are using the PRIVATE API KEY from the KonfHub organizer dashboard (Event > Settings > API Settings), not the button/widget ID. If the issue persists, use the CSV import endpoint (/api/v1/admin/import-passes) instead.', 403);
    }
    
    return sendError(res, error.message || 'Sync failed', 500);
  }
});

/**
 * Get KonfHub configuration status
 * GET /api/v1/admin/konfhub-status
 */
router.get('/konfhub-status', async (req: Request, res: Response) => {
  try {
    if (!(await isAdminAuthorized(req))) {
      return sendError(res, 'Unauthorized', 403);
    }

    const configStatus = konfhubService.getConfigStatus();
    
    return sendSuccess(res, 'KonfHub configuration status', {
      isConfigured: konfhubService.isConfigured(),
      ...configStatus,
      apiKeyConfigured: configStatus.apiKey ? 'Yes (hidden)' : 'No',
      eventIdConfigured: configStatus.eventId ? process.env.KONFHUB_EVENT_ID : 'No',
    });

  } catch (error: any) {
    logger.error('Get KonfHub status error:', error);
    return sendError(res, error.message, 500);
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

    return sendSuccess(res, 'Tickets captured successfully', {
      bookingIds: result.bookingIds,
      type: result.type,
      message: result.message,
      passes,
    });

  } catch (error: any) {
    logger.error('Capture ticket error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Get KonfHub ticket IDs configuration
 * GET /api/v1/admin/konfhub-tickets
 */
router.get('/konfhub-tickets', async (req: Request, res: Response) => {
  try {
    if (!(await isAdminAuthorized(req))) {
      return sendError(res, 'Unauthorized', 403);
    }

    return sendSuccess(res, 'KonfHub ticket configuration', {
      ticketIds: KONFHUB_TICKET_IDS,
      customFormIds: KONFHUB_CUSTOM_FORM_IDS,
      eventId: process.env.KONFHUB_EVENT_ID,
    });

  } catch (error: any) {
    logger.error('Get KonfHub tickets error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Get all users for admin dashboard
 * GET /api/v1/admin/users
 */
router.get('/users', async (req: Request, res: Response) => {
  // Set CORS headers explicitly
  const origin = req.headers.origin;
  const allowedOrigins = ['https://tcetesummit.in', 'https://www.tcetesummit.in'];
  
  if (allowedOrigins.includes(origin || '') || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'x-admin-secret, content-type, authorization, x-requested-with');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  try {
    if (!(await isAdminAuthorized(req))) {
      logger.warn('Unauthorized admin access attempt to /users');
      return sendError(res, 'Unauthorized: Admin access required. Please ensure your Clerk account has adminRole set to \"core\", \"jc\", or \"oc\" in public metadata.', 403);
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        college: true,
        createdAt: true,
        bookingVerified: true,
        is_active: true,
        clerkUserId: true,
        passes: {
          select: {
            id: true,
            passId: true,
            passType: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sendSuccess(res, 'Users fetched', {
      users,
      total: users.length,
    });

  } catch (error: any) {
    logger.error('Get users error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Get all passes for admin dashboard
 * GET /api/v1/admin/passes
 */
router.get('/passes', async (req: Request, res: Response) => {
  // Set CORS headers explicitly
  const origin = req.headers.origin;
  const allowedOrigins = ['https://tcetesummit.in', 'https://www.tcetesummit.in'];
  
  if (allowedOrigins.includes(origin || '') || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'x-admin-secret, content-type, authorization, x-requested-with');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  try {
    if (!(await isAdminAuthorized(req))) {
      logger.warn('Unauthorized admin access attempt to /passes');
      return sendError(res, 'Unauthorized: Admin access required. Please ensure your Clerk account has adminRole set to \"core\", \"jc\", or \"oc\" in public metadata.', 403);
    }

    const passes = await prisma.pass.findMany({
      select: {
        id: true,
        passId: true,
        passType: true,
        status: true,
        bookingId: true,
        konfhubOrderId: true,
        price: true,
        createdAt: true,
        purchaseDate: true,
        pdfUrl: true,
        ticketDetails: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            college: true,
            bookingVerified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sendSuccess(res, 'Passes fetched', {
      passes,
      total: passes.length,
    });

  } catch (error: any) {
    logger.error('Get passes error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Get all event registrations for admin dashboard
 * GET /api/v1/admin/registrations
 */
router.get('/registrations', async (req: Request, res: Response) => {
  // Set CORS headers explicitly
  const origin = req.headers.origin;
  const allowedOrigins = ['https://tcetesummit.in', 'https://www.tcetesummit.in'];
  
  if (allowedOrigins.includes(origin || '') || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'x-admin-secret, content-type, authorization, x-requested-with');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  try {
    if (!(await isAdminAuthorized(req))) {
      logger.warn('Unauthorized admin access attempt to /registrations');
      return sendError(res, 'Unauthorized: Admin access required. Please ensure your Clerk account has adminRole set to \"core\", \"jc\", or \"oc\" in public metadata.', 403);
    }

    const registrations = await prisma.eventRegistration.findMany({
      select: {
        id: true,
        eventId: true,
        userId: true,
        passId: true,
        status: true,
        registrationDate: true,
        formData: true,
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        pass: {
          select: {
            id: true,
            passId: true,
            passType: true,
            bookingId: true,
          },
        },
      },
      orderBy: {
        registrationDate: 'desc',
      },
    });

    return sendSuccess(res, 'Registrations fetched', {
      registrations,
      total: registrations.length,
    });

  } catch (error: any) {
    logger.error('Get registrations error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Get all pass claims for admin dashboard
 * GET /api/v1/admin/claims
 */
router.get('/claims', async (req: Request, res: Response) => {
  // Set CORS headers explicitly
  const origin = req.headers.origin;
  const allowedOrigins = ['https://tcetesummit.in', 'https://www.tcetesummit.in'];
  
  if (allowedOrigins.includes(origin || '') || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'x-admin-secret, content-type, authorization, x-requested-with');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  try {
    if (!(await isAdminAuthorized(req))) {
      logger.warn('Unauthorized admin access attempt to /claims');
      return sendError(res, 'Unauthorized: Admin access required. Please ensure your Clerk account has adminRole set to \"core\", \"jc\", or \"oc\" in public metadata.', 403);
    }

    const claims = await prisma.pendingPassClaim.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Add PDF file URLs to claims for admin viewing
    const claimsWithFiles = claims.map(claim => {
      const extractedData = claim.extractedData as any;
      return {
        ...claim,
        pdfFileUrl: extractedData?.fileUrl || null,
        pdfFileName: extractedData?.fileName || null,
      };
    });

    // Get unique clerk user IDs
    const clerkUserIds = [...new Set(claimsWithFiles.map(c => c.clerkUserId))];
    
    // Fetch all users in one query
    const users = await prisma.user.findMany({
      where: { clerkUserId: { in: clerkUserIds } },
      select: {
        clerkUserId: true,
        id: true,
        email: true,
        fullName: true,
        phone: true,
        college: true,
        bookingVerified: true,
      },
    });
    
    // Create a map for O(1) lookup
    const userMap = new Map(users.map(u => [u.clerkUserId, u]));
    
    // Fetch passes for all users
    const userIds = users.map(u => u.id);
    const passes = await prisma.pass.findMany({
      where: { userId: { in: userIds } },
      select: {
        id: true,
        userId: true,
        passId: true,
        passType: true,
        status: true,
        bookingId: true,
      },
    });
    
    // Create a map of userId to passes
    const passesMap = new Map<string, any[]>();
    passes.forEach(pass => {
      if (!passesMap.has(pass.userId)) {
        passesMap.set(pass.userId, []);
      }
      passesMap.get(pass.userId)?.push(pass);
    });
    
    // Merge claims with user data and passes
    const claimsWithUserData = claimsWithFiles.map(claim => {
      const user = userMap.get(claim.clerkUserId);
      return {
        ...claim,
        user: user || null,
        passes: user ? (passesMap.get(user.id) || []) : [],
      };
    });

    return sendSuccess(res, 'Claims fetched', {
      claims: claimsWithUserData,
      total: claimsWithUserData.length,
    });

  } catch (error: any) {
    logger.error('Get claims error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Approve or reject a pass claim
 * POST /api/v1/admin/claims/:claimId/action
 */
router.post('/claims/:claimId/action', async (req: Request, res: Response) => {
  try {
    // Debug: which source contained a secret
    logger.info('adminSecret sources', {
      x_admin_secret: !!req.headers['x-admin-secret'],
      authorization_header: !!(req.headers['authorization'] || req.headers['Authorization']),
      body_secret: !!req.body?.adminSecret,
      query_secret: !!req.query?.adminSecret,
    });

    // Authorize via admin-secret or Clerk public metadata
    if (!(await isAdminAuthorized(req))) {
      logger.info('admin authorization failed');
      return sendError(res, 'Unauthorized', 403);
    }

    const { claimId } = req.params;
    const { action, adminNotes } = req.body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return sendError(res, 'Invalid action. Must be "approve" or "reject"', 400);
    }

    // Get the claim and associated user
    const claim = await prisma.pendingPassClaim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      return sendError(res, 'Claim not found', 404);
    }

    if (claim.status !== 'pending') {
      return sendError(res, 'Claim has already been processed', 400);
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: claim.clerkUserId },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (action === 'approve') {
      // Extract data from claim
      const extractedData = claim.extractedData as any || {};

      // Create the pass in the database with uploaded PDF
      const pass = await prisma.pass.create({
        data: {
          userId: user.id,
          passId: claim.bookingId || `CLAIM-${Date.now()}`,
          passType: claim.passType,
          bookingId: claim.bookingId,
          konfhubOrderId: claim.konfhubOrderId,
          price: extractedData.price || 0,
          purchaseDate: new Date(),
          status: 'Active',
          pdfUrl: extractedData.fileUrl || extractedData.filePath || null, // Use Vercel Blob URL or legacy path
          qrCodeUrl: extractedData.ticketUrl || null,
          qrCodeData: claim.qrCodeData || claim.bookingId || claimId,
          ticketDetails: {
            attendeeName: claim.fullName || extractedData.attendeeName || user.fullName,
            email: claim.email,
            phone: user.phone,
            college: user.college,
            registrationStatus: 'Confirmed',
            registeredAt: new Date().toISOString(),
            source: 'admin_claim_approval',
            claimId: claim.id,
            adminNotes: adminNotes,
            originalFileName: extractedData.fileName,
          },
        },
      });

      // Update claim status
      await prisma.pendingPassClaim.update({
        where: { id: claimId },
        data: {
          status: 'approved',
          verifiedAt: new Date(),
        },
      });

      // Update user's booking verified status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          bookingVerified: true,
        },
      });

      logger.info('Pass claim approved', { claimId, passId: pass.id, userId: user.id });

      return sendSuccess(res, 'Claim approved and pass created', {
        claim: { ...claim, status: 'approved', verifiedAt: new Date() },
        pass,
      });

    } else if (action === 'reject') {
      // Update claim status to rejected
      const updatedClaim = await prisma.pendingPassClaim.update({
        where: { id: claimId },
        data: {
          status: 'rejected',
          verifiedAt: new Date(),
        },
      });

      logger.info('Pass claim rejected', { claimId, userId: user.id });

      return sendSuccess(res, 'Claim rejected', {
        claim: updatedClaim,
      });
    }

    // This should never be reached, but TypeScript requires it
    return sendError(res, 'Invalid action', 400);

  } catch (error: any) {
    logger.error('Process claim error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Download PDF uploaded by user during claim verification
 * GET /api/v1/admin/claims/:claimId/pdf
 */
router.get('/claims/:claimId/pdf', async (req: Request, res: Response) => {
  try {
    if (!(await isAdminAuthorized(req))) {
      return sendError(res, 'Unauthorized: Admin access required', 403);
    }

    const { claimId } = req.params;

    // Get the claim
    const claim = await prisma.pendingPassClaim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      return sendError(res, 'Claim not found', 404);
    }

    const extractedData = claim.extractedData as any;
    const filePath = extractedData?.filePath;

    if (!filePath) {
      return sendError(res, 'No PDF file found for this claim', 404);
    }

    // Construct full file path
    const path = require('path');
    const fs = require('fs');
    const fullFilePath = path.join(__dirname, '../../', filePath);

    // Check if file exists
    if (!fs.existsSync(fullFilePath)) {
      return sendError(res, 'PDF file not found on server', 404);
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${extractedData.fileName || 'ticket.pdf'}"`
    );

    // Stream the PDF file
    const fileStream = fs.createReadStream(fullFilePath);
    fileStream.pipe(res);

    fileStream.on('error', (error: any) => {
      console.error('Error streaming PDF:', error);
      if (!res.headersSent) {
        sendError(res, 'Error serving PDF', 500);
      }
    });
    return; // Explicit return after streaming

  } catch (error: any) {
    logger.error('Download claim PDF error:', error);
    return sendError(res, error.message, 500);
  }
});

/**
 * Cleanup old uploaded files (older than 24 hours)
 * POST /api/v1/admin/cleanup-files
 */
router.post('/cleanup-files', async (req: Request, res: Response) => {
  try {
    const adminSecret = getAdminSecretFromReq(req);
    if (!adminSecret || adminSecret !== process.env.ADMIN_IMPORT_SECRET) {
      return sendError(res, 'Unauthorized', 401);
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      return sendSuccess(res, 'No uploads directory found', { cleaned: 0 });
    }

    const files = fs.readdirSync(uploadsDir);
    let cleanedCount = 0;
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        cleanedCount++;
        logger.info(`Cleaned up old file: ${file}`);
      }
    }

    return sendSuccess(res, `Cleaned up ${cleanedCount} old files`, { cleaned: cleanedCount });
  } catch (error: any) {
    logger.error('File cleanup error:', error);
    return sendError(res, error.message || 'Cleanup failed', 500);
  }
});

export default router;
