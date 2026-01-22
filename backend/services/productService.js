/**
 * productService.js
 * Contains business logic for product operations (CRUD, search).
 */

const Product = require('../models/Product');

exports.addProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

exports.getProducts = async () => {
    return await Product.find();
};

exports.deleteProduct = async (id) => {
    return await Product.deleteOne({ _id: id });
};

exports.getProduct = async (id) => {
    return await Product.findOne({ _id: id });
};

exports.updateProduct = async (id, updateData) => {
    return await Product.updateOne({ _id: id }, { $set: updateData });
};

exports.searchProducts = async (key) => {
    return await Product.find({
        $or: [
            { name: { $regex: key, $options: "i" } },
            { company: { $regex: key, $options: "i" } },
            { category: { $regex: key, $options: "i" } },
            { price: { $regex: key, $options: "i" } },
        ],
    });
};
