/**
 * JWT utilities for ADALAT360 authentication
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not set in environment');
}

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password
 * @param {string} hash - Bcrypt hash
 * @returns {Promise<boolean>} True if match
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token for user
 * @param {Object} user - User object with id, role, department, name
 * @returns {string} JWT token
 */
export function generateToken(user) {
  const payload = {
    sub: user.id,
    name: user.name,
    role: user.role,
    department: user.department,
    serviceBarId: user.serviceBarId,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
export function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Role hierarchy for permission checks
 * Higher number = more permissions
 */
export const ROLE_HIERARCHY = {
  SYS: 6,  // System Admin - highest
  CRT: 5,  // Court Officer
  PP: 4,   // Public Prosecutor
  FSL: 3,  // Forensic Science Lab
  IO: 2,   // Investigating Officer
  REC: 1,  // Records Clerk - lowest
};

/**
 * Check if user role has at least the required role level
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Minimum required role
 * @returns {boolean}
 */
export function hasRoleLevel(userRole, requiredRole) {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

/**
 * Map frontend role names to backend role codes
 */
export const ROLE_MAP = {
  investigating_officer: 'IO',
  records_section: 'REC',
  forensic_analyst: 'FSL',
  prosecutor: 'PP',
  judge: 'CRT',
  system_admin: 'SYS',
};

/**
 * Map backend role codes to frontend role names
 */
export const REVERSE_ROLE_MAP = {
  IO: 'investigating_officer',
  REC: 'records_section',
  FSL: 'forensic_analyst',
  PP: 'prosecutor',
  CRT: 'judge',
  SYS: 'system_admin',
};