/**
 * Product.js
 * Defines the Product model schema for MongoDB using Mongoose.
 * Represents products in the application.
 */

/**
 * @typedef {import('@dashboard/shared').Product} Product
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("products", productSchema);
