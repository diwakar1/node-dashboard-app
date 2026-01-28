/**
 * productService.js
 * Contains business logic for product operations (CRUD, search).
 */

const Product = require('../models/Product');
const Category = require('../models/Category');

exports.addProduct = async (productData) => {
    // Validate category exists
    if (productData.category) {
        const categoryExists = await Category.findById(productData.category);
        if (!categoryExists) {
            throw new Error('Invalid category ID');
        }
    }
    
    const product = new Product(productData);
    return await product.save();
};

exports.getProducts = async () => {
    return await Product.find().populate('category', 'name icon color');
};

exports.deleteProduct = async (id) => {
    return await Product.deleteOne({ _id: id });
};

exports.getProduct = async (id) => {
    return await Product.findOne({ _id: id }).populate('category', 'name icon color');
};

exports.updateProduct = async (id, updateData) => {
    // Validate category exists if provided
    if (updateData.category) {
        const categoryExists = await Category.findById(updateData.category);
        if (!categoryExists) {
            throw new Error('Invalid category ID');
        }
    }
    
    return await Product.updateOne({ _id: id }, { $set: updateData });
};

exports.searchProducts = async (key) => {
    // Search in product fields and populated category name
    const products = await Product.find().populate('category', 'name icon color');
    
    return products.filter(product => {
        const searchKey = key.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchKey) ||
            product.company.toLowerCase().includes(searchKey) ||
            product.price.toString().includes(searchKey) ||
            (product.category && product.category.name.toLowerCase().includes(searchKey))
        );
    });
};
