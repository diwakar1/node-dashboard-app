/**
 * categoryController.js
 * Handles HTTP requests for category operations
 */

import * as categoryService from '../services/categoryService.js';
import { handleControllerError } from '../utils/errorHandler.js';

/**
 * @typedef {import('../models/Category')} Category
 */

/**
 * Get all categories
 * GET /api/v1/categories
 * @returns {Promise<Category[]>}
 */
async function getCategories(req, res) {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        handleControllerError(res, error, 'Failed to fetch categories');
    }
}

/**
 * Get single category by ID
 * GET /api/v1/categories/:id
 * @returns {Promise<Category>}
 */
async function getCategory(req, res) {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        handleControllerError(res, error, 'Failed to fetch category');
    }
}

/**
 * Create new category
 * POST /api/v1/categories
 * @param {Object} req.body - Category data
 * @returns {Promise<Category>}
 */
async function createCategory(req, res) {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        handleControllerError(res, error, 'Failed to create category');
    }
}

/**
 * Update category
 * PUT /api/v1/categories/:id
 * @param {string} req.params.id - Category ID
 * @param {Object} req.body - Category fields to update
 * @returns {Promise<Category>}
 */
async function updateCategory(req, res) {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json(category);
    } catch (error) {
        handleControllerError(res, error, 'Failed to update category');
    }
}

/**
 * Delete category
 * DELETE /api/v1/categories/:id
 * @param {string} req.params.id - Category ID
 * @returns {Promise<void>}
 */
async function deleteCategory(req, res) {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        handleControllerError(res, error, 'Failed to delete category');
    }
}

/**
 * Get products by category
 * GET /api/v1/categories/:id/products
 * @param {string} req.params.id - Category ID
 * @returns {Promise<{category: Category, products: Product[]}>}
 */
async function getCategoryProducts(req, res) {
    try {
        const result = await categoryService.getProductsByCategory(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        handleControllerError(res, error, 'Failed to fetch category products');
    }
}

/**
 * Get category statistics
 * GET /api/v1/categories/stats
 * @returns {Promise<Array<{_id: string, name: string, productCount: number}>>}
 */
async function getCategoryStats(req, res) {
    try {
        const stats = await categoryService.getCategoryStats();
        res.status(200).json(stats);
    } catch (error) {
        handleControllerError(res, error, 'Failed to fetch category statistics');
    }
}

export {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryProducts,
    getCategoryStats
};
