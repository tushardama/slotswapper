/**
 * Authentication Utility Module
 * 
 * Provides JWT-based authentication functions for:
 * - Token generation for authenticated sessions
 * - Token verification and validation
 * - Secure session management
 * 
 * Security Features:
 * - Environment-based secret key configuration
 * - Token expiration handling
 * - Error handling for invalid/expired tokens
 * 
 * @module lib/auth
 */

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'supersecretkey';

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not found in environment variables. Using fallback secret.');
}

/**
 * Generates a JWT token for authenticated user sessions
 * @param {Object} user - User object containing _id and email
 * @returns {string} Signed JWT token with 7-day expiration
 * @throws {Error} If user object is invalid or missing required fields
 */
export function generateToken(user) {
  if (!user || !user._id || !user.email) {
    throw new Error('Invalid user object: _id and email are required');
  }

  return jwt.sign(
    { id: user._id, email: user.email },
    SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload if valid, null if invalid/expired
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.warn('Token expired:', error.message);
    } else if (error.name === 'JsonWebTokenError') {
      console.warn('Invalid token:', error.message);
    }
    return null;
  }
}
