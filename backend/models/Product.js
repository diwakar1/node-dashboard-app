/**
 * Product.js
 * Defines the Product model schema for MongoDB using Mongoose.
 * Represents products in the application.
 */

import mongoose from 'mongoose';

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

export default mongoose.model("products", productSchema);
