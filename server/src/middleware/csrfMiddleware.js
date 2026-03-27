import crypto from 'crypto';
import { prisma } from '../config/db.js';

/**
 * Generate a CSRF token and store it in database
 */
export const generateCSRFToken = async () => {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.cSRFToken.create({
        data: {
            token,
            expiresAt,
        },
    });

    return token;
};

/**
 * Middleware to validate CSRF token on state-changing requests
 * Attach to POST, PUT, PATCH, DELETE routes (except login/register which are intentionally open)
 */
export const csrfProtection = async (req, res, next) => {
    // Allow GET and OPTIONS without CSRF token
    if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') {
        return next();
    }

    // Extract CSRF token from header (or from body as fallback)
    const token = req.headers['x-csrf-token'] || req.body?.csrfToken;

    if (!token) {
        return res.status(403).json({
            error: 'Missing CSRF token',
        });
    }

    try {
        // Find and validate token in database
        const csrfToken = await prisma.cSRFToken.findUnique({
            where: { token },
        });

        if (!csrfToken) {
            return res.status(403).json({
                error: 'Invalid or expired CSRF token',
            });
        }

        // Check if token is expired
        if (new Date() > csrfToken.expiresAt) {
            // Clean up expired token
            await prisma.cSRFToken.delete({
                where: { token },
            });

            return res.status(403).json({
                error: 'CSRF token expired',
            });
        }

        // Token is valid, delete it (one-time use)
        await prisma.cSRFToken.delete({
            where: { token },
        });

        next();
    } catch (error) {
        console.error('CSRF validation error:', error);
        return res.status(500).json({
            error: 'CSRF token validation failed',
        });
    }
};

/**
 * Clean up expired CSRF tokens periodically
 * Run this in a background job or on server startup
 */
export const cleanupExpiredCSRFTokens = async () => {
    try {
        const result = await prisma.cSRFToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        console.log(`Cleaned up ${result.count} expired CSRF tokens`);
    } catch (error) {
        console.error('Error cleaning up CSRF tokens:', error);
    }
};
