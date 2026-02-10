/**
 * productService.js
 * Contains business logic for product operations (CRUD, search).
 */

const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * @typedef {import('../models/Product')} Product
 */

/**
 * Add a new product
 * @param {Object} productData - Product data from frontend
 * @returns {Promise<any>} Created product with generated fields
 */
exports.addProduct = async (productData) => {
    // Validate category exists
    if (productData.categoryId) {
        const categoryExists = await Category.findById(productData.categoryId);
        if (!categoryExists) {
            throw new Error('Invalid category ID');
        }
    }
    
    const product = new Product(productData);
    return await product.save();
};

/**
 * Get all products
 * @returns {Promise<Product[]>} Array of products
 */
exports.getProducts = async () => {
    return await Product.find().populate('categoryId', 'name icon color');
};

/**
 * Delete a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Delete result
 */
exports.deleteProduct = async (id) => {
    return await Product.deleteOne({ _id: id });
};

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Product>} Product with populated category
 */
exports.getProduct = async (id) => {
    return await Product.findOne({ _id: id }).populate('categoryId', 'name icon color');
};

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} updateData - Updated product data
 * @returns {Promise<{acknowledged: boolean, modifiedCount: number, upsertedId: null, upsertedCount: number, matchedCount: number}>} Update result
 */
exports.updateProduct = async (id, updateData) => {
    // Validate category exists if provided
    if (updateData.categoryId) {
        const categoryExists = await Category.findById(updateData.categoryId);
        if (!categoryExists) {
            throw new Error('Invalid category ID');
        }
    }
    
    return await Product.updateOne({ _id: id }, { $set: updateData });
};

/**
 * Search products by keyword
 * @param {string} key - Search keyword
 * @returns {Promise<Product[]>} Matching products
 */
exports.searchProducts = async (key) => {
    // Search in product fields and populated category name
    const products = await Product.find().populate('categoryId', 'name icon color');
    
    return products.filter(product => {
        const searchKey = key.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchKey) ||
            product.company.toLowerCase().includes(searchKey) ||
            product.price.toString().includes(searchKey) ||
            (product.categoryId && product.categoryId.name.toLowerCase().includes(searchKey))
        );
    });
};
