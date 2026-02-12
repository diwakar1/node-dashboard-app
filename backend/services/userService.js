/**
 * userService.js
 * Contains business logic for user operations (registration, login, password hashing, JWT).
 */

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @typedef {import('../models/User')} User
 */

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<any>}
 */
export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Create a new user with hashed password
 * @param {Object} userData - User registration data
 * @returns {Promise<User>}
 */
export const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
    });
    return await user.save();
};

export const comparePassword = async (plain, hash) => {
    return await bcrypt.compare(plain, hash);
};

export const hashPassword = async (plain) => {
    return await bcrypt.hash(plain, 10);
};


// Generate access token (short-lived)
export const generateAccessToken = (user, secret) => {
    return jwt.sign({ user }, secret, { expiresIn: "30m" });
};

// Generate refresh token (longer-lived)
export const generateRefreshToken = (user, refreshSecret) => {
    return jwt.sign({ user }, refreshSecret, { expiresIn: "7d" });
};

// Verify refresh token
export const verifyRefreshToken = (token, refreshSecret) => {
    try {
        return jwt.verify(token, refreshSecret);
    } catch (err) {
        return null;
    }
};
