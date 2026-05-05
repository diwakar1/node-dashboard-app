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
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/emailService.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

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
        // Generate a secure random verification token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        let user = await userService.createUser(req.body, {
            emailVerificationToken: tokenHash,
            emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 h
        });

        // Send verification email (fire-and-forget — don't block signup on SMTP failure)
        sendVerificationEmail(user, rawToken).catch((err) =>
            log('Verification email failed (non-critical):', err.message)
        );

        user = user.toObject();
        delete user.password;
        log('User registered:', user.email);
        res.send({ user, message: 'Registration successful. Please check your email to verify your account.' });
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

/**
 * Verify email address using the token from the verification link.
 * @route GET /api/v1/auth/verify-email?token=...
 */
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ error: 'Verification token is required.' });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await userService.findUserByVerificationToken(tokenHash);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification link.' });
        }

        if (user.emailVerificationExpires < new Date()) {
            return res.status(400).json({ error: 'Verification link has expired. Please request a new one.' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        log('Email verified for:', user.email);
        res.json({ message: 'Email verified successfully! You can now receive order confirmations.' });
    } catch (e) {
        handleControllerError(res, e, 'Email verification failed');
    }
};

/**
 * Resend verification email for the authenticated user.
 * @route POST /api/v1/auth/resend-verification
 */
export const resendVerificationEmail = async (req, res) => {
    try {
        const user = await userService.findUserById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (user.isEmailVerified) {
            return res.status(400).json({ error: 'Email is already verified.' });
        }

        // Rate-limit: don't resend if a fresh token was issued in the last 2 minutes
        if (
            user.emailVerificationExpires &&
            user.emailVerificationExpires > new Date(Date.now() + 24 * 60 * 60 * 1000 - 2 * 60 * 1000)
        ) {
            return res.status(429).json({ error: 'Please wait a moment before requesting another verification email.' });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.emailVerificationToken = tokenHash;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        await sendVerificationEmail(user, rawToken);

        log('Resent verification email to:', user.email);
        res.json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (e) {
        handleControllerError(res, e, 'Failed to resend verification email');
    }
};

/**
 * Initiate password reset — send a reset link to the user's email.
 * Always responds with 200 to avoid leaking whether the email exists.
 * @route POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        const user = await userService.findUserByEmail(email);

        // Silently succeed if user not found (don't reveal account existence)
        if (!user || user.authProvider !== 'local') {
            log('Forgot-password: no local account for', email);
            return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.passwordResetToken = tokenHash;
        user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        await sendPasswordResetEmail(user, rawToken);

        log('Password reset email sent to:', user.email);
        res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (e) {
        handleControllerError(res, e, 'Failed to send password reset email');
    }
};

/**
 * Reset the user's password using the token from the reset link.
 * @route POST /api/v1/auth/reset-password
 */
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters.' });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await userService.findUserByResetToken(tokenHash);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset link.' });
        }
        if (user.passwordResetExpires < new Date()) {
            return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
        }

        user.password = await userService.hashPassword(password);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        log('Password reset successful for:', user.email);
        res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (e) {
        handleControllerError(res, e, 'Failed to reset password');
    }
};
