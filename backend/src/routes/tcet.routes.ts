import { Router } from 'express';
import { assignTcetCode, getUserTcetCode, getTcetCodeStats } from '../controllers/tcet.controller';

const router = Router();

/**
 * POST /api/tcet/assign/:userId
 * Assign a unique Thakur Student code to a user
 * ONLY FOR TCET, TGBS, AND TIMSR STUDENTS
 */
router.post('/assign/:userId', assignTcetCode);

/**
 * GET /api/tcet/code/:userId
 * Get the Thakur Student code assigned to a user
 */
router.get('/code/:userId', getUserTcetCode);

/**
 * GET /api/tcet/stats
 * Get statistics about Thakur Student code usage
 */
router.get('/stats', getTcetCodeStats);

export default router;
