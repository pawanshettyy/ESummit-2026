import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import passRoutes from './pass.routes';
import checkinRoutes from './checkin.routes';
import adminRoutes from './admin.routes';
import eventRoutes from './event.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'E-Summit 2025 API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/passes', passRoutes);
router.use('/checkin', checkinRoutes);
router.use('/admin', adminRoutes);
router.use('/events', eventRoutes);

export default router;
