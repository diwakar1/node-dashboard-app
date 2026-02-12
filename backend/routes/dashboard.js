/**
 * dashboard.js
 * Dashboard routes for statistics and overview
 */
import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics including product counts, categories, and recent products
 */
router.get('/stats', verifyToken, getDashboardStats);

export default router;
