/**
 * userService.js
 * Contains business logic for user operations (registration, login, password hashing, JWT).
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtKey = "ecommerce";

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

exports.generateToken = (user) => {
    return jwt.sign({ user }, jwtKey, { expiresIn: "2h" });
};
