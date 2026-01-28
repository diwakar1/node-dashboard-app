/**
 * dashboard.js
 * Dashboard routes for statistics and overview
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/verifyToken');

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
router.get('/stats', verifyToken, dashboardController.getDashboardStats);

module.exports = router;
