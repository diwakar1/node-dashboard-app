/**
 * dashboardController.js
 * Handles dashboard statistics and overview data
 */

/**
 * @typedef {import('@dashboard/shared').Product} Product
 * @typedef {import('@dashboard/shared').Category} Category
 * @typedef {import('@dashboard/shared').User} User
 */

const ProductModel = require('../models/Product');
const CategoryModel = require('../models/Category');
const UserModel = require('../models/User');

/**
 * Get dashboard statistics
 * GET /api/v1/dashboard/stats
 * @returns {Promise<Object>} Dashboard statistics object
 */
async function getDashboardStats(req, res) {
    try {
        // Get total counts
        const totalProducts = await ProductModel.countDocuments();
        
        // Get unique companies count
        const companies = await ProductModel.distinct('company');
        const totalCompanies = companies.length;

        // Get products by category
        const productsByCategory = await ProductModel.aggregate([
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
        const recentProducts = await ProductModel.find()
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
        res.status(500).json({ error: 'Failed to fetch dashboard statistics: ' + error.message });
    }
}

module.exports = {
    getDashboardStats
};
