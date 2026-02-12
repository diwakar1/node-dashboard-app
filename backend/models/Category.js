/**
 * Category.js
 * Defines the Category model schema for MongoDB using Mongoose.
 * Represents product categories in the application.
 */
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'fa-solid fa-box' // FontAwesome class name
    },
    color: {
        type: String,
        default: '#3B82F6' // Default blue color
    }
}, {
    timestamps: true
});

export default mongoose.model("categories", categorySchema);
