import { Router } from 'express';
import { assignTcetCode, getUserTcetCode, getTcetCodeStats } from '../controllers/tcet.controller';

const router = Router();

/**
 * POST /api/tcet/assign/:userId
 * Assign a unique TCET code to a user
 */
router.post('/assign/:userId', assignTcetCode);

/**
 * GET /api/tcet/code/:userId
 * Get the TCET code assigned to a user
 */
router.get('/code/:userId', getUserTcetCode);

/**
 * GET /api/tcet/stats
 * Get statistics about TCET code usage
 */
router.get('/stats', getTcetCodeStats);

export default router;
