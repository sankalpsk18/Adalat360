/**
 * RBAC (Role-Based Access Control) Middleware for ADALAT360
 */

import { prisma } from '../index.js';
import { verifyToken, extractToken, hasRoleLevel, ROLE_MAP } from '../utils/jwt.js';

/**
 * Authentication middleware - attaches user to request
 */
export async function authenticate(req, res, next) {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch fresh user data from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        serviceBarId: true,
        role: true,
        department: true,
        status: true,
        publicKey: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account suspended' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * Require specific roles
 * @param {...string} roles - Allowed roles (backend codes: IO, PP, REC, CRT, FSL, SYS)
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
}

/**
 * Require minimum role level
 * @param {string} minRole - Minimum role required
 */
export function requireMinRole(minRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasRoleLevel(req.user.role, minRole)) {
      return res.status(403).json({
        error: 'Insufficient role level',
        required: minRole,
        current: req.user.role,
      });
    }

    next();
  };
}

/**
 * Check if user can access a case (department match or role override)
 */
export async function requireCaseAccess(req, res, next) {
  const caseId = req.params.caseId || req.body.caseId || req.query.caseId;
  if (!caseId) {
    return res.status(400).json({ error: 'Case ID required' });
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, department: true },
  });

  if (!caseRecord) {
    return res.status(404).json({ error: 'Case not found' });
  }

  // System admins can access all cases
  if (req.user.role === 'SYS') {
    req.case = caseRecord;
    return next();
  }

  // Check department match
  if (req.user.department !== caseRecord.department) {
    return res.status(403).json({
      error: 'Access denied: case belongs to different department',
      userDepartment: req.user.department,
      caseDepartment: caseRecord.department,
    });
  }

  req.case = caseRecord;
  next();
}

/**
 * Check if user can access a document
 */
export async function requireDocumentAccess(req, res, next) {
  const documentId = req.params.documentId || req.params.id || req.body.documentId;
  if (!documentId) {
    return res.status(400).json({ error: 'Document ID required' });
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, caseId: true, restricted: true, department: true },
  });

  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }

  // System admins can access all documents (but content stays restricted)
  if (req.user.role === 'SYS') {
    req.document = document;
    return next();
  }

  // Check department match
  if (req.user.department !== document.department) {
    return res.status(403).json({
      error: 'Access denied: document belongs to different department',
    });
  }

  // Check restricted flag - only certain roles can view restricted docs
  if (document.restricted) {
    const allowedRoles = ['IO', 'PP', 'FSL', 'CRT'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: restricted document' });
    }
  }

  req.document = document;
  next();
}

/**
 * Optional authentication - attaches user if token present
 */
export async function optionalAuth(req, res, next) {
  const token = extractToken(req.headers.authorization);
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, name: true, role: true, department: true, status: true },
      });
      if (user && user.status === 'active') {
        req.user = user;
      }
    }
  }
  next();
}

/**
 * Audit logging middleware - logs all API calls
 */
export function auditLog(action, resourceType) {
  return async (req, res, next) => {
    const startTime = Date.now();

    // Capture response
    const originalSend = res.send;
    res.send = function (body) {
      const duration = Date.now() - startTime;

      // Log audit entry asynchronously (don't block response)
      if (req.user) {
        prisma.auditLog.create({
          data: {
            actorId: req.user.id,
            action,
            resourceType,
            resourceId: req.params.id || req.params.caseId || req.params.documentId || 'unknown',
            caseId: req.case?.id || req.params.caseId || null,
            ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
            metadata: {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
              durationMs: duration,
              userAgent: req.headers['user-agent'],
            },
          },
        }).catch(err => console.error('Audit log failed:', err));
      }

      return originalSend.call(this, body);
    };

    next();
  };
}