/**
 * Authentication Routes for ADALAT360
 * POST /api/auth/login - Officer sign-in with service/bar ID + passphrase
 * GET  /api/auth/me - Get current user profile
 * POST /api/auth/refresh - Refresh token
 */

import express from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { hashPassword, verifyPassword, generateToken, ROLE_MAP } from '../utils/jwt.js';
import { authenticate } from '../middleware/rbac.js';
import { encryptPrivateKey, generateKeyPair } from '../utils/crypto.js';

const router = express.Router();

// Validation schemas
const loginSchema = z.object({
  serviceBarId: z.string().min(1, 'Service/Bar ID is required'),
  passphrase: z.string().min(1, 'Passphrase is required'),
  role: z.enum(['investigating_officer', 'records_section', 'forensic_analyst', 'prosecutor', 'judge', 'system_admin']),
});

/**
 * POST /api/auth/login
 * Officer sign-in with service/bar ID + passphrase + role selector
 */
router.post('/login', async (req, res, next) => {
  try {
    const { serviceBarId, passphrase, role } = loginSchema.parse(req.body);

    // Find user by service/bar ID
    const user = await prisma.user.findUnique({
      where: { serviceBarId },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify role matches
    const backendRole = ROLE_MAP[role];
    if (user.role !== backendRole) {
      return res.status(403).json({
        error: 'Role mismatch',
        message: `This account is registered as ${user.role}, not ${backendRole}`,
      });
    }

    // Verify password
    const valid = await verifyPassword(passphrase, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken(user);

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    // Return user info (without sensitive data)
    res.json({
      user: {
        id: user.id,
        name: user.name,
        serviceBarId: user.serviceBarId,
        role: user.role,
        department: user.department,
      },
      token, // Also return token for Authorization header usage
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      serviceBarId: req.user.serviceBarId,
      role: req.user.role,
      department: req.user.department,
      publicKey: req.user.publicKey,
    },
    demo: true,
  });
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', authenticate, (req, res) => {
  const token = generateToken(req.user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });
  res.json({ token, demo: true });
});

/**
 * POST /api/auth/logout
 * Clear auth cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, demo: true });
});

/**
 * POST /api/auth/register (admin only - for seeding demo users)
 * Register a new officer account
 */
router.post('/register', authenticate, async (req, res, next) => {
  try {
    // Only SYS can register new users
    if (req.user.role !== 'SYS') {
      return res.status(403).json({ error: 'Only system administrators can register users' });
    }

    const schema = z.object({
      name: z.string().min(1),
      serviceBarId: z.string().min(1),
      passphrase: z.string().min(8),
      role: z.enum(['IO', 'PP', 'REC', 'CRT', 'FSL', 'SYS']),
      department: z.string().min(1),
    });

    const data = schema.parse(req.body);

    // Check if serviceBarId exists
    const existing = await prisma.user.findUnique({
      where: { serviceBarId: data.serviceBarId },
    });
    if (existing) {
      return res.status(409).json({ error: 'Service/Bar ID already registered' });
    }

    // Generate key pair for digital signatures
    const { publicKey, privateKey } = generateKeyPair();
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    // Hash password
    const passwordHash = await hashPassword(data.passphrase);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        serviceBarId: data.serviceBarId,
        passwordHash,
        role: data.role,
        department: data.department,
        publicKey,
        privateKeyEnc: encryptedPrivateKey,
      },
    });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        serviceBarId: user.serviceBarId,
        role: user.role,
        department: user.department,
      },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

export default router;