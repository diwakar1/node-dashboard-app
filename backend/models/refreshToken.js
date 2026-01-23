/**
 * refreshToken.js
 * Mongoose model for storing refresh tokens (optional, for token revocation/invalidation).
 */
const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('refresh_tokens', refreshTokenSchema);
