import { Router } from 'express';
import passRoutes from './pass.routes';
import webhookRoutes from './webhook.routes';
import userRoutes from './user.routes';

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
router.use('/webhooks', webhookRoutes);
router.use('/users', userRoutes);

export default router;
