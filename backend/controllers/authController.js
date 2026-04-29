/**
 * authController.js
 * Handles user authentication logic: signup and login.
 * Validates input, manages password hashing, and issues JWT tokens.
 */

const log = (...args) => console.log('[AuthController]', ...args);

import { validationResult } from 'express-validator';
import * as userService from '../services/userService.js';
import RefreshToken from '../models/refreshToken.js';
import { handleControllerError } from '../utils/errorHandler.js';
import bcrypt from 'bcryptjs';

/**
 * @typedef {import('../models/User')} User
 */

/**
 * Register a new user
 * @param {Object} req.body - User registration data {name, email, password}
 * @returns {Promise<{user: User}>} User object without password
 */
export const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log('Signup validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    const existingUser = await userService.findUserByEmail(req.body.email);
    if (existingUser) {
        log('Signup attempt with existing email:', req.body.email);
        return res.status(400).json({ error: "Email already exists" });
    }
    try {
        let user = await userService.createUser(req.body);
        user = user.toObject();
        delete user.password;
        log('User registered:', user.email);
        res.send({ user });
    } catch (e) {
        log('Registration error:', e.message);
        handleControllerError(res, e, 'Registration failed');
    }
};

/**
 * Authenticate user and issue tokens
 * @param {Object} req.body - Login credentials {email, password}
 * @returns {Promise<{user: User, accessToken: string, refreshToken: string}>} User with access and refresh tokens
 */
/**
 * Get current authenticated user's profile
 */
export const getProfile = async (req, res) => {
    try {
        const user = await userService.findUserById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ user: userObj });
    } catch (e) {
        handleControllerError(res, e, 'Failed to fetch profile');
    }
};

/**
 * Update authenticated user's profile (name)
 */
export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters' });
        }
        const user = await userService.findUserById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.name = name.trim();
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        log('Profile updated:', userObj.email);
        res.json({ user: userObj });
    } catch (e) {
        handleControllerError(res, e, 'Failed to update profile');
    }
};

/**
 * Change authenticated user's password
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }
        const user = await userService.findUserById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const match = await userService.comparePassword(currentPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        user.password = await userService.hashPassword(newPassword);
        await user.save();
        log('Password changed for:', user.email);
        res.json({ message: 'Password updated successfully' });
    } catch (e) {
        handleControllerError(res, e, 'Failed to change password');
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log('Login validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    let user = await userService.findUserByEmail(req.body.email);
    if (!user) {
        log('Login failed: email not found', req.body.email);
        return res.status(401).json({ error: "Invalid credentials: Email" });
    }
    if (!user.password.startsWith("$2b$")) {
        if (req.body.password === user.password) {
            user.password = await userService.hashPassword(req.body.password);
            await user.save();
        } else {
            log('Login failed: invalid credentials for', req.body.email);
            return res.status(401).json({ error: "Invalid credentials" });
        }
    } else {
        const passwordMatch = await userService.comparePassword(req.body.password, user.password);
        if (!passwordMatch) {
            log('Login failed: invalid password for', req.body.email);
            return res.status(401).json({ error: "Invalid credentials: password" });
        }
    }
    user = user.toObject();
    delete user.password;
    try {
        // Generate tokens (access env vars directly to ensure they're loaded)
        const accessToken = userService.generateAccessToken(user, process.env.JWT_SECRET);
        const refreshToken = userService.generateRefreshToken(user, process.env.REFRESH_SECRET);

        // Store refresh token in DB (overwrite if exists)
        await RefreshToken.findOneAndUpdate(
            { userId: user._id },
            {
                userId: user._id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
            { upsert: true, new: true }
        );

        log('User logged in:', user.email);
        res.send({ user, accessToken, refreshToken });
    } catch (err) {
        log('JWT generation error:', err.message);
        handleControllerError(res, err, 'Authentication failed');
    }
};
