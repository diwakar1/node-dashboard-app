/**
 * product.js
 * Defines product-related API routes (CRUD, search).
 * Uses authentication middleware and product controller logic.
 *
 * Swagger annotations below document the API endpoints for automatic generation of OpenAPI docs.
 * See /api-docs for live documentation.
 */
import express from 'express';
import * as productController from '../controllers/productController.js';
import verifyToken from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { productValidation, idParamValidation, searchKeyValidation } from '../middleware/productValidation.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/products/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product added successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/add', verifyToken, productValidation, productController.addProduct);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, productController.getProducts);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.get('/:id', verifyToken, idParamValidation, productController.getProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put('/:id', verifyToken, verifyAdmin, idParamValidation, productValidation, productController.updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete('/:id', verifyToken, verifyAdmin, idParamValidation, productController.deleteProduct);

/**
 * @swagger
 * /api/v1/products/search/{key}:
 *   get:
 *     summary: Search products by keyword
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 */
router.get('/search/:key', verifyToken, searchKeyValidation, productController.searchProducts);

export default router;
