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
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model("users", userSchema);
