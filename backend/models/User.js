/**
 * User.js
 * Defines the User model schema for MongoDB using Mongoose.
 * Represents application users.
 */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, sparse: true },
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
    },
    // Password reset fields
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    // OAuth fields
    googleId: { type: String, default: null },
    githubId: { type: String, default: null },
    avatar: { type: String, default: null },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    }
}, {
    timestamps: true
});

export default mongoose.model("users", userSchema);
