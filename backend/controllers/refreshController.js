/**
 * refreshController.js
 * Handles issuing new access tokens using refresh tokens.
 */

import * as userService from '../services/userService.js';
import RefreshToken from '../models/refreshToken.js';

/**
 * Refresh access token using refresh token
 * @param {Object} req.body - Contains refreshToken
 * @returns {Promise<{accessToken: string}>}
 */
export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  // Find refresh token in DB
  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored || stored.expiresAt < new Date()) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
  // Verify refresh token (access env vars directly)
  const payload = userService.verifyRefreshToken(refreshToken, process.env.REFRESH_SECRET);
  if (!payload) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
  // Issue new access token (access env vars directly)
  // Payload now contains userId and email directly
  const accessToken = userService.generateAccessToken(payload, process.env.JWT_SECRET);
  res.json({ accessToken });
};
