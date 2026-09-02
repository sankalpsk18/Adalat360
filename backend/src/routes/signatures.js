/**
 * Signature Routes for ADALAT360
 * POST   /api/signatures/document/:id - Sign a document
 * POST   /api/signatures/certificate/:id - Sign a certificate
 * GET    /api/signatures/document/:id - Get document signatures
 * GET    /api/signatures/certificate/:id - Get certificate signatures
 * POST   /api/signatures/verify - Verify a signature
 */

import express from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { authenticate, requireRole, requireDocumentAccess, auditLog } from '../middleware/rbac.js';
import { decryptPrivateKey, sign, verify, sha256 } from '../utils/crypto.js';

const router = express.Router();

// Validation schemas
const signSchema = z.object({
  targetType: z.enum(['DOCUMENT', 'CERTIFICATE']),
  targetId: z.string().uuid(),
});

/**
 * POST /api/signatures/document/:id
 * Sign a document's SHA-256 hash with officer's private key
 */
router.post(
  '/document/:id',
  authenticate,
  requireRole('IO', 'PP', 'FSL', 'CRT', 'REC', 'SYS'),
  requireDocumentAccess,
  auditLog('sign', 'DOCUMENT'),
  async (req, res, next) => {
    try {
      const document = await prisma.document.findUnique({
        where: { id: req.params.id },
        select: { id: true, sha256Hash: true, caseId: true, signed: true, signedBy: true },
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      if (document.signed) {
        return res.status(409).json({
          error: 'Document already signed',
          signedBy: document.signedBy,
        });
      }

      // Get user's private key
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { privateKeyEnc: true, publicKey: true },
      });

      if (!user?.privateKeyEnc) {
        return res.status(400).json({ error: 'User does not have a signing key' });
      }

      // Decrypt private key
      const privateKey = decryptPrivateKey(user.privateKeyEnc);

      // Sign the document's SHA-256 hash (not the raw file)
      const signatureValue = sign(privateKey, document.sha256Hash);

      // Store signature
      const signature = await prisma.signature.create({
        data: {
          userId: req.user.id,
          targetType: 'DOCUMENT',
          targetId: document.id,
          signatureValue,
          publicKeyRef: user.publicKey,
        },
      });

      // Update document
      await prisma.document.update({
        where: { id: document.id },
        data: { signed: true, signedBy: req.user.name },
      });

      // Create custody entry
      const prevHash = await getLastCustodyHash(document.caseId);
      const entryHash = sha256(`${prevHash || ''}|SIGN|${req.user.id}|${new Date().toISOString()}`);

      await prisma.custodyEntry.create({
        data: {
          documentId: document.id,
          actorId: req.user.id,
          action: 'SIGN',
          prevEntryHash: prevHash,
          entryHash,
          caseId: document.caseId,
          notes: `Document signed by ${req.user.name} (${req.user.role})`,
        },
      });

      res.status(201).json({
        signature: {
          id: signature.id,
          userId: signature.userId,
          targetType: signature.targetType,
          targetId: signature.targetId,
          signatureValue: signature.signatureValue,
          signedAt: signature.signedAt,
        },
        demo: true,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/signatures/certificate/:id
 * Sign a BSA §63 certificate
 */
router.post(
  '/certificate/:id',
  authenticate,
  requireRole('IO', 'PP', 'FSL', 'CRT', 'SYS'),
  auditLog('sign', 'CERTIFICATE'),
  async (req, res, next) => {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { id: req.params.id },
        select: { id: true, hashSummary: true, caseId: true },
      });

      if (!certificate) {
        return res.status(404).json({ error: 'Certificate not found' });
      }

      // Check if already signed by this user
      const existing = await prisma.signature.findUnique({
        where: {
          userId_targetType_targetId: {
            userId: req.user.id,
            targetType: 'CERTIFICATE',
            targetId: certificate.id,
          },
        },
      });

      if (existing) {
        return res.status(409).json({ error: 'Certificate already signed by this user' });
      }

      // Get user's private key
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { privateKeyEnc: true, publicKey: true },
      });

      if (!user?.privateKeyEnc) {
        return res.status(400).json({ error: 'User does not have a signing key' });
      }

      // Decrypt private key and sign
      const privateKey = decryptPrivateKey(user.privateKeyEnc);
      const signatureValue = sign(privateKey, certificate.hashSummary);

      // Store signature
      const signature = await prisma.signature.create({
        data: {
          userId: req.user.id,
          targetType: 'CERTIFICATE',
          targetId: certificate.id,
          signatureValue,
          publicKeyRef: user.publicKey,
        },
      });

      // Create custody entry
      const prevHash = await getLastCustodyHash(certificate.caseId);
      const entryHash = sha256(`${prevHash || ''}|SIGN|${req.user.id}|${new Date().toISOString()}`);

      await prisma.custodyEntry.create({
        data: {
          documentId: certificate.documentId,
          actorId: req.user.id,
          action: 'SIGN',
          prevEntryHash: prevHash,
          entryHash,
          caseId: certificate.caseId,
          notes: `BSA §63 certificate signed by ${req.user.name}`,
        },
      });

      res.status(201).json({ signature, demo: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/signatures/document/:id
 * Get all signatures for a document
 */
router.get('/document/:id', authenticate, requireDocumentAccess, async (req, res, next) => {
  try {
    const signatures = await prisma.signature.findMany({
      where: { targetType: 'DOCUMENT', targetId: req.params.id },
      include: {
        user: { select: { id: true, name: true, role: true, publicKey: true } },
      },
      orderBy: { signedAt: 'asc' },
    });

    res.json({ signatures, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/signatures/certificate/:id
 * Get all signatures for a certificate
 */
router.get('/certificate/:id', authenticate, async (req, res, next) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: req.params.id },
      select: { caseId: true, documentId: true },
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Check case access
    const caseRecord = await prisma.case.findUnique({
      where: { id: certificate.caseId },
      select: { department: true },
    });

    if (req.user.role !== 'SYS' && req.user.department !== caseRecord?.department) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const signatures = await prisma.signature.findMany({
      where: { targetType: 'CERTIFICATE', targetId: req.params.id },
      include: {
        user: { select: { id: true, name: true, role: true, publicKey: true } },
      },
      orderBy: { signedAt: 'asc' },
    });

    res.json({ signatures, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/signatures/verify
 * Verify a signature against a document/certificate hash
 */
router.post('/verify', authenticate, async (req, res, next) => {
  try {
    const { targetType, targetId, signatureValue, publicKey } = req.body;

    if (!targetType || !targetId || !signatureValue || !publicKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let hashToVerify = null;

    if (targetType === 'DOCUMENT') {
      const document = await prisma.document.findUnique({
        where: { id: targetId },
        select: { sha256Hash: true },
      });
      if (!document) return res.status(404).json({ error: 'Document not found' });
      hashToVerify = document.sha256Hash;
    } else if (targetType === 'CERTIFICATE') {
      const certificate = await prisma.certificate.findUnique({
        where: { id: targetId },
        select: { hashSummary: true },
      });
      if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
      hashToVerify = certificate.hashSummary;
    } else {
      return res.status(400).json({ error: 'Invalid target type' });
    }

    const isValid = verify(publicKey, hashToVerify, signatureValue);

    res.json({
      valid: isValid,
      targetType,
      targetId,
      verifiedAt: new Date().toISOString(),
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Helper: Get last custody hash for case
 */
async function getLastCustodyHash(caseId) {
  const lastEntry = await prisma.custodyEntry.findFirst({
    where: { caseId },
    orderBy: { timestamp: 'desc' },
    select: { entryHash: true },
  });
  return lastEntry?.entryHash || null;
}

export default router;