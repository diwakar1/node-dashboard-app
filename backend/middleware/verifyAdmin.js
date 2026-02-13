/**
 * verifyAdmin.js
 * Middleware to verify if the authenticated user has admin role.
 * Must be used after verifyToken middleware.
 */

const log = (...args) => console.log('[VerifyAdmin]', ...args);

/**
 * Check if user has admin role
 * Requires verifyToken to run first to populate req.user
 */
export const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        log('No user found in request - verifyToken not run?');
        return res.status(401).json({ error: "Unauthorized - no user" });
    }

    if (req.user.role !== 'admin') {
        log('Access denied for non-admin user:', req.user.email);
        return res.status(403).json({ error: "Forbidden - Admin access required" });
    }

    log('Admin access granted:', req.user.email);
    next();
};
