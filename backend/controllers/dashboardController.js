/**
 * dashboardController.js
 * Handles dashboard statistics and overview data
 */

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { handleControllerError } from '../utils/errorHandler.js';

/**
 * @typedef {import('../models/Product')} Product
 * @typedef {import('../models/Category')} Category
 * @typedef {import('../models/User')} User
 */

/**
 * Get dashboard statistics
 * GET /api/v1/dashboard/stats
 * @returns {Promise<{totalProducts: number, totalCompanies: number, productsByCategory: Array, recentProducts: Product[]}>} Dashboard statistics object
 */
async function getDashboardStats(req, res) {
    try {
        // Get total counts
        const totalProducts = await Product.countDocuments();
        
        // Get unique companies count
        const companies = await Product.distinct('company');
        const totalCompanies = companies.length;

        // Get products by category
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    name: '$categoryInfo.name',
                    icon: '$categoryInfo.icon',
                    color: '$categoryInfo.color',
                    productCount: '$count'
                }
            },
            {
                $sort: { productCount: -1 }
            }
        ]);

        // Get recent products (last 5)
        const recentProducts = await Product.find()
            .populate('categoryId', 'name icon color')
            .sort({ createdAt: -1 })
            .limit(5);

        // Build response
        const stats = {
            overview: {
                totalProducts,
                totalCategories: productsByCategory.length, // Count only categories with products
                totalCompanies
            },
            categoryBreakdown: productsByCategory,
            recentProducts
        };

        res.status(200).json(stats);
    } catch (error) {
        handleControllerError(res, error, 'Failed to fetch dashboard statistics');
    }
}

export { getDashboardStats };
