/**
 * productService.js
 * Contains business logic for product operations (CRUD, search).
 */

/**
 * @typedef {import('@dashboard/shared').Product} Product
 */

const ProductModel = require('../models/Product');
const Category = require('../models/Category');

/**
 * Add a new product
 * @param {Product} productData - Product data from frontend
 * @returns {Promise<Product>} Created product with generated fields
 */
exports.addProduct = async (productData) => {
    // Validate category exists
    if (productData.categoryId) {
        const categoryExists = await Category.findById(productData.categoryId);
        if (!categoryExists) {
            throw new Error('Invalid category ID');
        }
    }
    
    const product = new ProductModel(productData);
    return await product.save();
};

/**
 * Get all products
 * @returns {Promise<Product[]>} Array of products
 */
exports.getProducts = async () => {
    return await ProductModel.find().populate('categoryId', 'name icon color');
};

/**
 * Delete a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Delete result
 */
exports.deleteProduct = async (id) => {
    return await ProductModel.deleteOne({ _id: id });
};

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Product>} Product with populated category
 */
exports.getProduct = async (id) => {
    return await ProductModel.findOne({ _id: id }).populate('categoryId', 'name icon color');
};

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Product} updateData - Updated product data
 * @returns {Promise<Object>} Update result
 */
exports.updateProduct = async (id, updateData) => {
    // Validate category exists if provided
    if (updateData.categoryId) {
        const categoryExists = await Category.findById(updateData.categoryId);
        if (!categoryExists) {
            throw new Error('Invalid category ID');
        }
    }
    
    return await ProductModel.updateOne({ _id: id }, { $set: updateData });
};

/**
 * Search products by keyword
 * @param {string} key - Search keyword
 * @returns {Promise<Product[]>} Matching products
 */
exports.searchProducts = async (key) => {
    // Search in product fields and populated category name
    const products = await ProductModel.find().populate('categoryId', 'name icon color');
    
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
