/**
 * passport.js
 * Configures Passport.js OAuth strategies for Google and GitHub SSO.
 *
 * Flow:
 *  1. User clicks "Sign in with Google/GitHub" on the frontend.
 *  2. Browser navigates to /api/v1/auth/google (or /github).
 *  3. Passport redirects to the provider's OAuth consent screen.
 *  4. Provider redirects back to /api/v1/auth/google/callback.
 *  5. Passport exchanges the code for a profile, we find-or-create the user.
 *  6. We issue our own JWT tokens and redirect to the frontend /oauth-callback
 *     page with tokens in the query string (over HTTPS in production this is safe;
 *     for extra security you can use a short-lived one-time code instead).
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import * as userService from '../services/userService.js';

// Ensure env vars are loaded before strategies are constructed.
// (ES module imports are hoisted — dotenv.config in index.js runs too late.)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const log = (...args) => console.log('[Passport]', ...args);

// ── Helper: find existing user or create one from OAuth profile ──────────────
const findOrCreateOAuthUser = async ({ provider, providerId, email, name, avatar }) => {
    const providerField = `${provider}Id`; // 'googleId' or 'githubId'

    // 1. Try to find by provider ID (returning user)
    let user = await User.findOne({ [providerField]: providerId });
    if (user) {
        log(`Existing ${provider} user found:`, user.email);
        return user;
    }

    // 2. Try to find by email (user signed up locally with same email — link accounts)
    if (email) {
        user = await User.findOne({ email });
        if (user) {
            user[providerField] = providerId;
            if (!user.avatar && avatar) user.avatar = avatar;
            // Email from OAuth provider is verified by definition
            user.isEmailVerified = true;
            await user.save();
            log(`Linked ${provider} account to existing user:`, user.email);
            return user;
        }
    }

    // 3. Create brand-new user
    user = await User.create({
        name,
        email: email || null,
        [providerField]: providerId,
        avatar,
        authProvider: provider,
        isEmailVerified: true, // OAuth providers verify emails for us
        role: 'user',
    });
    log(`Created new ${provider} user:`, user.email || user._id);
    return user;
};

// ── Google Strategy ───────────────────────────────────────────────────────────
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/auth/google/callback`,
            scope: ['profile', 'email'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value || null;
                const avatar = profile.photos?.[0]?.value || null;
                const user = await findOrCreateOAuthUser({
                    provider: 'google',
                    providerId: profile.id,
                    email,
                    name: profile.displayName,
                    avatar,
                });
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// ── GitHub Strategy ───────────────────────────────────────────────────────────
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/auth/github/callback`,
            scope: ['user:email'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                // GitHub may return multiple emails; prefer the primary verified one
                const emails = profile.emails || [];
                const primary = emails.find((e) => e.primary && e.verified) || emails[0];
                const email = primary?.value || null;
                const avatar = profile.photos?.[0]?.value || null;
                const user = await findOrCreateOAuthUser({
                    provider: 'github',
                    providerId: String(profile.id),
                    email,
                    name: profile.displayName || profile.username,
                    avatar,
                });
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Passport requires serialize/deserialize even when not using sessions.
// We don't use sessions (stateless JWT), so these are minimal stubs.
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
