/**
 * product.js
 * Defines product-related API routes (CRUD, search).
 * Uses authentication middleware and product controller logic.
 */
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const { productValidation } = require('../middleware/productValidation');

// Add product (protected)
router.post('/add', verifyToken, productValidation, productController.addProduct);
// Get all products (protected)
router.get('/', verifyToken, productController.getProducts);
// Delete product (protected)
router.delete('/:id', verifyToken, productController.deleteProduct);
// Get single product (protected)
router.get('/:id', verifyToken, productController.getProduct);
// Update product (protected)
router.put('/:id', verifyToken, productValidation, productController.updateProduct);
// Search products (protected)
router.get('/search/:key', verifyToken, productController.searchProducts);

module.exports = router;
