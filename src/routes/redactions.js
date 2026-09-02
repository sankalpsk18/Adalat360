/**
 * Redaction Routes for ADALAT360
 * POST   /api/redactions/document/:id - Apply redaction to document
 * GET    /api/redactions/document/:id - List redactions for document
 * GET    /api/redactions/:id - Get redaction details
 */

import express from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { authenticate, requireRole, requireDocumentAccess, auditLog } from '../middleware/rbac.js';
import { sha256 } from '../utils/crypto.js';

const router = express.Router();

// Validation schemas
const createRedactionSchema = z.object({
  regions: z.array(z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    page: z.number().int().positive(),
  })).min(1, 'At least one redaction region required'),
  reason: z.string().min(1, 'Redaction reason is required'),
});

/**
 * POST /api/redactions/document/:id
 * Apply redaction to document (creates new version with redactions)
 */
router.post(
  '/document/:id',
  authenticate,
  requireRole('REC', 'IO', 'PP', 'SYS'),
  requireDocumentAccess,
  auditLog('redact', 'DOCUMENT'),
  async (req, res, next) => {
    try {
      const { regions, reason } = createRedactionSchema.parse(req.body);

      const document = await prisma.document.findUnique({
        where: { id: req.params.id },
        select: { id: true, caseId: true, filename: true, version: true, redactedCopy: true },
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Create redaction record
      const redaction = await prisma.redaction.create({
        data: {
          documentId: document.id,
          regionsJson: JSON.stringify(regions),
          redactedBy: req.user.id,
          reason,
        },
      });

      // Create new document version with redactedCopy flag
      const newVersion = document.version + 1;

      // In a real implementation, this would:
      // 1. Download and decrypt the original
      // 2. Apply redactions (black out regions)
      // 3. Re-encrypt and store as new version
      // For prototype, we just create the version record

      const newDocument = await prisma.document.create({
        data: {
          caseId: document.caseId,
          filename: document.filename,
          version: newVersion,
          parentVersionId: document.id,
          sha256Hash: sha256(`REDACTED-${document.sha256Hash}-${Date.now()}`), // New hash for redacted version
          encBlobRef: document.encBlobRef, // Would be new encrypted file in reality
          encIv: document.encIv,
          encTag: document.encTag,
          uploadedBy: req.user.id,
          docType: document.docType,
          department: document.department,
          redactedCopy: true,
          integrity: 'PENDING',
        },
      });

      // Create custody entry
      const prevHash = await getLastCustodyHash(document.caseId);
      const entryHash = sha256(`${prevHash || ''}|REDACT|${req.user.id}|${new Date().toISOString()}`);

      await prisma.custodyEntry.create({
        data: {
          documentId: newDocument.id,
          actorId: req.user.id,
          action: 'REDACT',
          prevEntryHash: prevHash,
          entryHash,
          caseId: document.caseId,
          notes: `Redacted version created by ${req.user.name}: ${reason}`,
        },
      });

      res.status(201).json({
        redaction: {
          ...redaction,
          regions: regions,
        },
        newDocumentVersion: {
          id: newDocument.id,
          version: newDocument.version,
          redactedCopy: true,
        },
        demo: true,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/redactions/document/:id
 * List all redactions for a document
 */
router.get('/document/:id', authenticate, requireDocumentAccess, async (req, res, next) => {
  try {
    const redactions = await prisma.redaction.findMany({
      where: { documentId: req.params.id },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { id: true, name: true, role: true } },
      },
    });

    // Parse regions JSON for each redaction
    const parsedRedactions = redactions.map(r => ({
      ...r,
      regions: JSON.parse(r.regionsJson),
    }));

    res.json({ redactions: parsedRedactions, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/redactions/:id
 * Get redaction details
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const redaction = await prisma.redaction.findUnique({
      where: { id: req.params.id },
      include: {
        document: { select: { id: true, caseId: true, filename: true } },
        actor: { select: { id: true, name: true, role: true } },
      },
    });

    if (!redaction) {
      return res.status(404).json({ error: 'Redaction not found' });
    }

    // Check access
    if (req.user.role !== 'SYS' && req.user.department !== redaction.document.caseId) {
      // Need to check case department
      const caseRecord = await prisma.case.findUnique({
        where: { id: redaction.document.caseId },
        select: { department: true },
      });
      if (caseRecord?.department !== req.user.department) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json({
      redaction: {
        ...redaction,
        regions: JSON.parse(redaction.regionsJson),
      },
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