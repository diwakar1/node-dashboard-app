/**
 * productController.js
 * Handles product CRUD operations: add, get, update, delete, and search products.
 * Interacts with the Product model and responds to product-related API requests.
 */

const log = (...args) => console.log('[ProductController]', ...args);

import { validationResult } from 'express-validator';
import * as productService from '../services/productService.js';
import { handleControllerError } from '../utils/errorHandler.js';

/**
 * @typedef {import('../models/Product')} Product
 */

/**
 * Add a new product
 * @param {Object} req.body - Product data from frontend
 * @returns {Promise<Product>}
 */
export const addProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log('Add product validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        // req.user now contains { userId, email } from token
        const userId = req.user.userId;
        const payload = { ...req.body, userId };
        const result = await productService.addProduct(payload);
        log('Product added:', result._id);
        res.send(result);
    } catch (e) {
        log('Add product error:', e.message);
        handleControllerError(res, e, 'Failed to add product');
    }
};

/**
 * Get all products
 * Everyone sees all products (public browsing)
 * @returns {Promise<Product[]>}
 */
export const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        log('Fetched products:', products.length);
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ result: "no products found" });
        }
    } catch (e) {
        log('Get products error:', e.message);
        handleControllerError(res, e, 'Failed to fetch products');
    }
};

/**
 * Delete a product by ID
 * @param {string} req.params.id - Product ID
 * @returns {Promise<Product>}
 */
export const deleteProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log('Delete product validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const result = await productService.deleteProduct(req.params.id);
        log('Product deleted:', req.params.id);
        res.send(result);
    } catch (err) {
        log('Delete product error:', err.message);
        handleControllerError(res, err, 'Failed to delete product');
    }
};

/**
 * Get a single product by ID
 * @param {string} req.params.id - Product ID
 * @returns {Promise<Product>}
 */
export const getProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log('Get product validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const result = await productService.getProduct(req.params.id);
        log('Fetched product:', req.params.id);
        res.send(result);
    } catch (err) {
        log('Get product error:', err.message);
        handleControllerError(res, err, 'Failed to fetch product');
    }
};

/**
 * Update a product by ID
 * @param {string} req.params.id - Product ID
 * @param {Object} req.body - Product fields to update
 * @returns {Promise<Product>}
 */
export const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log('Update product validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const result = await productService.updateProduct(req.params.id, req.body);
        log('Product updated:', req.params.id);
        res.send(result);
    } catch (err) {
        log('Update product error:', err.message);
        handleControllerError(res, err, 'Failed to update product');
    }
};

/**
 * Search products by keyword
 * Everyone searches all products
 * @param {string} req.params.key - Search keyword
 * @returns {Promise<Product[]>}
 */
export const searchProducts = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log('Search products validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const result = await productService.searchProducts(req.params.key);
        log('Product search:', req.params.key, 'Results:', result.length);
        res.send(result);
    } catch (err) {
        log('Search products error:', err.message);
        handleControllerError(res, err, 'Failed to search products');
    }
};
