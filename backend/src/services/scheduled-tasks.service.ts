import { del } from '@vercel/blob';
import { prisma } from '../config/database';
import logger from '../utils/logger.util';
import * as cron from 'node-cron';

export class ScheduledTasksService {
  private static instance: ScheduledTasksService;

  private constructor() {
    this.initializeScheduledTasks();
  }

  public static getInstance(): ScheduledTasksService {
    if (!ScheduledTasksService.instance) {
      ScheduledTasksService.instance = new ScheduledTasksService();
    }
    return ScheduledTasksService.instance;
  }

  private initializeScheduledTasks() {
    // Run every hour to check for PDFs that need to be deleted
    cron.schedule('0 * * * *', async () => {
      await this.deleteExpiredPassPDFs();
    });

    logger.info('Scheduled tasks initialized');
  }

  /**
   * Delete pass PDFs that are older than 32 hours
   * Only deletes PDFs for passes created from admin claim approvals
   */
  private async deleteExpiredPassPDFs() {
    try {
      const thirtyTwoHoursAgo = new Date(Date.now() - 32 * 60 * 60 * 1000);

      // Find passes that:
      // 1. Have a pdfUrl (stored in Vercel Blob)
      // 2. Were created more than 32 hours ago
      // 3. Have ticketDetails.source === 'admin_claim_approval'
      const expiredPasses = await prisma.pass.findMany({
        where: {
          pdfUrl: {
            not: null,
          },
          createdAt: {
            lt: thirtyTwoHoursAgo,
          },
          ticketDetails: {
            path: ['source'],
            equals: 'admin_claim_approval',
          },
        },
        select: {
          id: true,
          passId: true,
          pdfUrl: true,
          createdAt: true,
        },
      });

      if (expiredPasses.length === 0) {
        logger.info('No expired pass PDFs to delete');
        return;
      }

      logger.info(`Found ${expiredPasses.length} expired pass PDFs to delete`);

      for (const pass of expiredPasses) {
        try {
          // Check if pdfUrl is a Vercel Blob URL
          if (pass.pdfUrl && (pass.pdfUrl.startsWith('http://') || pass.pdfUrl.startsWith('https://'))) {
            // Delete from Vercel Blob
            await del(pass.pdfUrl);
            logger.info(`Deleted PDF from Vercel Blob for pass: ${pass.passId}`);

            // Update the database to remove the pdfUrl
            await prisma.pass.update({
              where: { id: pass.id },
              data: {
                pdfUrl: null,
              },
            });

            logger.info(`Removed pdfUrl from database for pass: ${pass.passId}`);
          }
        } catch (error) {
          logger.error(`Failed to delete PDF for pass ${pass.passId}:`, error);
        }
      }

      logger.info(`Completed deletion of ${expiredPasses.length} expired pass PDFs`);
    } catch (error) {
      logger.error('Error in deleteExpiredPassPDFs:', error);
    }
  }

  /**
   * Manually trigger PDF deletion (for testing or admin purposes)
   */
  public async triggerPDFDeletion() {
    await this.deleteExpiredPassPDFs();
  }
}