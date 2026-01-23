/**
 * userService.js
 * Contains business logic for user operations (registration, login, password hashing, JWT).
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

exports.createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
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
