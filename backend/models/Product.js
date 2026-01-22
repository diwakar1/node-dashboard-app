/**
 * Product.js
 * Defines the Product model schema for MongoDB using Mongoose.
 * Represents products in the application.
 */
const mongoose = require('mongoose');
const productSchema= new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    userId: String,
    company: String
});
module.exports = mongoose.model("products", productSchema);
