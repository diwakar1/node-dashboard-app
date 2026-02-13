/**
 * dashboard.js
 * Dashboard routes for statistics and overview (Admin only)
 */
import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import verifyToken from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics including product counts, categories, and recent products
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/stats', verifyToken, verifyAdmin, getDashboardStats);

export default router;
