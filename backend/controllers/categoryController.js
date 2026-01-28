/**
 * categoryController.js
 * Handles HTTP requests for category operations
 */
const categoryService = require('../services/categoryService');

/**
 * Get all categories
 * GET /api/v1/categories
 */
async function getCategories(req, res) {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get single category by ID
 * GET /api/v1/categories/:id
 */
async function getCategory(req, res) {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

/**
 * Create new category
 * POST /api/v1/categories
 */
async function createCategory(req, res) {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

/**
 * Update category
 * PUT /api/v1/categories/:id
 */
async function updateCategory(req, res) {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json(category);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

/**
 * Delete category
 * DELETE /api/v1/categories/:id
 */
async function deleteCategory(req, res) {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Cannot delete')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get products by category
 * GET /api/v1/categories/:id/products
 */
async function getCategoryProducts(req, res) {
    try {
        const result = await categoryService.getProductsByCategory(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get category statistics
 * GET /api/v1/categories/stats
 */
async function getCategoryStats(req, res) {
    try {
        const stats = await categoryService.getCategoryStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryProducts,
    getCategoryStats
};
