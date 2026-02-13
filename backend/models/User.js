/**
 * User.js
 * Defines the User model schema for MongoDB using Mongoose.
 * Represents application users.
 */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

export default mongoose.model("users", userSchema);
