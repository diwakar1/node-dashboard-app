/**
 * refreshController.js
 * Handles issuing new access tokens using refresh tokens.
 */

/**
 * @typedef {import('@dashboard/shared').User} User
 */

const userService = require('../services/userService');
const RefreshToken = require('../models/refreshToken');
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

/**
 * Refresh access token using refresh token
 * @param {Object} req.body - Contains refreshToken
 * @returns {Promise<{accessToken: string}>}
 */
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  // Find refresh token in DB
  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored || stored.expiresAt < new Date()) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
  // Verify refresh token
  const payload = userService.verifyRefreshToken(refreshToken, REFRESH_SECRET);
  if (!payload) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
  // Issue new access token
  const user = payload.user;
  const accessToken = userService.generateAccessToken(user, JWT_SECRET);
  res.json({ accessToken });
};
