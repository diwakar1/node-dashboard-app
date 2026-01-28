/**
 * dashboardController.js
 * Handles dashboard statistics and overview data
 */
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

/**
 * Get dashboard statistics
 * GET /api/v1/dashboard/stats
 */
async function getDashboardStats(req, res) {
    try {
        // Get total counts
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalUsers = await User.countDocuments();

        // Get unique companies count
        const companies = await Product.distinct('company');
        const totalCompanies = companies.length;

        // Get products by category
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
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
            .populate('category', 'name icon color')
            .sort({ createdAt: -1 })
            .limit(5);

        // Build response
        const stats = {
            overview: {
                totalProducts,
                totalCategories,
                totalCompanies,
                totalUsers
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
