import { Router } from 'express';
import passRoutes from './pass.routes';
import passClaimRoutes from './pass-claim.routes';
import eventRoutes from './event.routes';
import pdfRoutes from './pdf.routes';
import webhookRoutes from './webhook.routes';
import tcetRoutes from './tcet.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'E-Summit 2026 API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/passes', passRoutes);
router.use('/pass-claims', passClaimRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/events', eventRoutes);
router.use('/pdf', pdfRoutes);
router.use('/tcet', tcetRoutes);
router.use('/admin', adminRoutes);

export default router;
