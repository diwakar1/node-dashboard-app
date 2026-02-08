/**
 * userService.js
 * Contains business logic for user operations (registration, login, password hashing, JWT).
 */

/**
 * @typedef {import('@dashboard/shared').User} User
 * @typedef {import('@dashboard/shared').AuthResponse} AuthResponse
 */

const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<User|null>}
 */
exports.findUserByEmail = async (email) => {
    return await UserModel.findOne({ email });
};

/**
 * Create a new user with hashed password
 * @param {User} userData - User registration data
 * @returns {Promise<User>}
 */
exports.createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new UserModel({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
    });
    return await user.save();
};

exports.comparePassword = async (plain, hash) => {
    return await bcrypt.compare(plain, hash);
};

exports.hashPassword = async (plain) => {
    return await bcrypt.hash(plain, 10);
};


// Generate access token (short-lived)
exports.generateAccessToken = (user, secret) => {
    return jwt.sign({ user }, secret, { expiresIn: "30m" });
};

// Generate refresh token (longer-lived)
exports.generateRefreshToken = (user, refreshSecret) => {
    return jwt.sign({ user }, refreshSecret, { expiresIn: "7d" });
};

// Verify refresh token
exports.verifyRefreshToken = (token, refreshSecret) => {
    try {
        return jwt.verify(token, refreshSecret);
    } catch (err) {
        return null;
    }
};
