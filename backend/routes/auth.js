/**
 * auth.js
 * Defines authentication-related API routes (signup, login).
 * Uses validation middleware and controller logic.
 *
 * Swagger annotations below document the API endpoints for automatic generation of OpenAPI docs.
 * See /api-docs for live documentation.
 */
import express from 'express';
import * as authController from '../controllers/authController.js';
import passport from '../config/passport.js';
import * as userService from '../services/userService.js';
import RefreshToken from '../models/refreshToken.js';
import { registrationValidation, loginValidation } from '../middleware/validation.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/signup', registrationValidation, authController.signup);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:

 *       200:
 *         description: Login successful, returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, authController.login);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Refresh token required
 *       403:
 *         description: Invalid or expired refresh token
 */

// Protected profile routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);

// Email verification routes
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', verifyToken, authController.resendVerificationEmail);

// ── OAuth SSO helper ──────────────────────────────────────────────────────────
// After passport authenticates the user, issue our own JWTs and redirect to
// the frontend /oauth-callback page with tokens in the query string.
const handleOAuthCallback = async (req, res) => {
    try {
        const user = req.user.toObject();
        delete user.password;

        const accessToken = userService.generateAccessToken(user, process.env.JWT_SECRET);
        const refreshToken = userService.generateRefreshToken(user, process.env.REFRESH_SECRET);

        await RefreshToken.findOneAndUpdate(
            { userId: user._id },
            {
                userId: user._id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            { upsert: true, new: true }
        );

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const params = new URLSearchParams({
            accessToken,
            refreshToken,
            user: JSON.stringify(user),
        });
        res.redirect(`${frontendUrl}/oauth-callback?${params.toString()}`);
    } catch (err) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
};

// ── Google OAuth ─────────────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed` }),
    handleOAuthCallback
);

// ── GitHub OAuth ─────────────────────────────────────────────────────────────
router.get('/github', passport.authenticate('github', { session: false, scope: ['user:email'] }));

router.get(
    '/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed` }),
    handleOAuthCallback
);

export default router;
