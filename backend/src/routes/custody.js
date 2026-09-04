/**
 * Custody Routes for ADALAT360
 * GET /api/custody/:documentId - Get custody trail for document
 * GET /api/custody/:documentId/verify - Verify hash chain integrity
 * GET /api/custody/case/:caseId - Get all custody entries for a case
 */

import express from 'express';
import { prisma } from '../index.js';
import { authenticate, requireCaseAccess, requireDocumentAccess } from '../middleware/rbac.js';
import { sha256 } from '../utils/crypto.js';

const router = express.Router();

/**
 * GET /api/custody/:documentId
 * Get custody trail for a specific document
 */
const getDocumentCustody = async (req, res, next) => {
  try {
    const entries = await prisma.custodyEntry.findMany({
      where: { documentId: req.params.documentId },
      orderBy: { timestamp: 'asc' },
      include: {
        actor: { select: { id: true, name: true, role: true, department: true } },
      },
    });

    // Verify chain integrity for each entry
    const verifiedEntries = await Promise.all(
      entries.map(async (entry, index) => {
        let expectedHash = entry.entryHash;
        let isValid = true;
        let mismatchReason = null;

        if (index === 0) {
          // First entry: prevHash should be null
          if (entry.prevEntryHash !== null) {
            isValid = false;
            mismatchReason = 'First entry has non-null prevHash';
          }
        } else {
          // Verify link to previous entry
          const prevEntry = entries[index - 1];
          const computedHash = sha256(`${prevEntry.entryHash}|${entry.action}|${entry.actorId}|${entry.timestamp.toISOString()}`);
          if (computedHash !== entry.entryHash) {
            isValid = false;
            mismatchReason = `Hash mismatch: expected ${computedHash}, got ${entry.entryHash}`;
          }
        }

        return {
          ...entry,
          verified: isValid,
          mismatchReason,
          chainPosition: index + 1,
        };
      })
    );

    res.json({ entries: verifiedEntries, demo: true });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/custody/:documentId/verify
 * Verify entire hash chain and report first broken link
 * This is what produces the "Hash mismatch on server disk image" alert
 */
const verifyDocumentCustody = async (req, res, next) => {
  try {
    const entries = await prisma.custodyEntry.findMany({
      where: { documentId: req.params.documentId },
      orderBy: { timestamp: 'asc' },
      include: {
        actor: { select: { id: true, name: true, role: true } },
      },
    });

    if (entries.length === 0) {
      return res.json({
        verified: true,
        message: 'No custody entries found',
        entriesChecked: 0,
        brokenLink: null,
        demo: true,
      });
    }

    let prevHash = null;
    let brokenLink = null;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // Verify prevHash matches previous entry's hash
      if (i === 0) {
        if (entry.prevEntryHash !== null) {
          brokenLink = {
            position: i + 1,
            entryId: entry.id,
            expectedPrevHash: null,
            actualPrevHash: entry.prevEntryHash,
            reason: 'First entry should have null prevHash',
          };
          break;
        }
      } else {
        if (entry.prevEntryHash !== prevHash) {
          brokenLink = {
            position: i + 1,
            entryId: entry.id,
            expectedPrevHash: prevHash,
            actualPrevHash: entry.prevEntryHash,
            reason: 'prevEntryHash does not match previous entry hash',
          };
          break;
        }
      }

      // Verify entry hash
      const expectedHash = sha256(`${entry.prevEntryHash || ''}|${entry.action}|${entry.actorId}|${entry.timestamp.toISOString()}`);
      if (entry.entryHash !== expectedHash) {
        brokenLink = {
          position: i + 1,
          entryId: entry.id,
          expectedHash,
          actualHash: entry.entryHash,
          reason: 'Entry hash does not match computed hash',
        };
        break;
      }

      prevHash = entry.entryHash;
    }

    const verified = brokenLink === null;

    // If broken link found, create integrity alert
    if (!verified) {
      const document = await prisma.document.findUnique({
        where: { id: req.params.documentId },
        select: { caseId: true, filename: true },
      });

      await prisma.conflictAlert.create({
        data: {
          caseId: document.caseId,
          documentIds: JSON.stringify([req.params.documentId]),
          description: `Custody chain verification failed: ${brokenLink.reason} at position ${brokenLink.position}`,
          severity: 'CRITICAL',
        },
      });

      // Update document integrity status
      await prisma.document.update({
        where: { id: req.params.documentId },
        data: { integrity: 'MISMATCH' },
      });
    } else {
      // Update document integrity status to verified
      await prisma.document.update({
        where: { id: req.params.documentId },
        data: { integrity: 'VERIFIED' },
      });
    }

    res.json({
      verified,
      entriesChecked: entries.length,
      brokenLink,
      lastVerifiedHash: prevHash,
      demo: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/custody/case/:caseId
 * Get all custody entries for a case (across all documents)
 */
router.get('/case/:caseId', authenticate, requireCaseAccess, async (req, res, next) => {
  try {
    const { limit = '100', offset = '0', action } = req.query;

    const where = { caseId: req.params.caseId };
    if (action) {
      where.action = action;
    }

    const [entries, total] = await Promise.all([
      prisma.custodyEntry.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          actor: { select: { id: true, name: true, role: true } },
          document: { select: { id: true, filename: true, docType: true } },
        },
      }),
      prisma.custodyEntry.count({ where }),
    ]);

    res.json({
      entries,
      pagination: { total, limit: parseInt(limit), offset: parseInt(offset) },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/custody/verify-all/:caseId
 * Verify all custody chains in a case (admin/system only)
 */
router.get('/verify-all/:caseId', authenticate, requireCaseAccess, async (req, res, next) => {
  try {
    // Only SYS can run bulk verification
    if (req.user.role !== 'SYS') {
      return res.status(403).json({ error: 'Only system administrators can run bulk verification' });
    }

    const documents = await prisma.document.findMany({
      where: { caseId: req.params.caseId },
      select: { id: true, filename: true },
    });

    const results = [];

    for (const doc of documents) {
      const entries = await prisma.custodyEntry.findMany({
        where: { documentId: doc.id },
        orderBy: { timestamp: 'asc' },
      });

      let prevHash = null;
      let verified = true;
      let brokenLink = null;

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (i === 0) {
          if (entry.prevEntryHash !== null) {
            verified = false;
            brokenLink = { position: i + 1, reason: 'First entry has non-null prevHash' };
            break;
          }
        } else {
          if (entry.prevEntryHash !== prevHash) {
            verified = false;
            brokenLink = { position: i + 1, reason: 'Chain link broken' };
            break;
          }
        }

        const expectedHash = sha256(`${entry.prevEntryHash || ''}|${entry.action}|${entry.actorId}|${entry.timestamp.toISOString()}`);
        if (entry.entryHash !== expectedHash) {
          verified = false;
          brokenLink = { position: i + 1, reason: 'Entry hash mismatch' };
          break;
        }

        prevHash = entry.entryHash;
      }

      // Update document integrity
      await prisma.document.update({
        where: { id: doc.id },
        data: { integrity: verified ? 'VERIFIED' : 'MISMATCH' },
      });

      results.push({
        documentId: doc.id,
        filename: doc.filename,
        verified,
        entriesChecked: entries.length,
        brokenLink,
      });
    }

    const mismatched = results.filter(r => !r.verified);

    res.json({
      caseId: req.params.caseId,
      totalDocuments: documents.length,
      verified: documents.length - mismatched.length,
      mismatched: mismatched.length,
      results,
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:documentId/verify', authenticate, requireDocumentAccess, verifyDocumentCustody);
router.get('/:documentId', authenticate, requireDocumentAccess, getDocumentCustody);

export default router;