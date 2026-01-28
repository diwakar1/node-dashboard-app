/**
 * productController.js
 * Handles product CRUD operations: add, get, update, delete, and search products.
 * Interacts with the Product model and responds to product-related API requests.
 */

const log = (...args) => console.log('[ProductController]', ...args);

const productService = require('../services/productService');

exports.addProduct = async (req, res) => {
    try {
        const result = await productService.addProduct(req.body);
        log('Product added:', result._id);
        res.send(result);
    } catch (e) {
        log('Add product error:', e.message);
        if (e.message.includes('Invalid category')) {
            return res.status(400).send({ error: e.message });
        }
        res.status(500).send({ error: "Failed to add product", detail: e.message });
    }
};

exports.getProducts = async (req, res) => {
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
        res.status(500).send({ error: "Failed to fetch products", detail: e.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        log('Product deleted:', req.params.id);
        res.send(result);
    } catch (err) {
        log('Delete product error:', err.message);
        res.status(500).send({ error: "something went wrong while deleting product" });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const result = await productService.getProduct(req.params.id);
        log('Fetched product:', req.params.id);
        res.send(result);
    } catch (err) {
        log('Get product error:', err.message);
        res.status(500).send({ error: "no record found" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const result = await productService.updateProduct(req.params.id, req.body);
        log('Product updated:', req.params.id);
        res.send(result);
    } catch (err) {
        log('Update product error:', err.message);
        if (err.message.includes('Invalid category')) {
            return res.status(400).send({ error: err.message });
        }
        res.status(500).send({ error: "Failed to update product" });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const result = await productService.searchProducts(req.params.key);
        log('Product search:', req.params.key, 'Results:', result.length);
        res.send(result);
    } catch (err) {
        log('Search products error:', err.message);
        res.status(500).send({ error: "Failed to search products" });
    }
};
