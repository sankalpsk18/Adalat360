/**
 * System Routes for ADALAT360
 * GET /api/system/health - Health check
 * GET /api/system/llm-usage - LLM rate limit monitoring
 * GET /api/system/stats - System statistics
 * POST /api/system/seed - Seed demo data (dev only)
 */

import express from 'express';
import { prisma } from '../index.js';
import { authenticate, requireRole } from '../middleware/rbac.js';
import { getUsageStats } from '../utils/llmLimiter.js';
import { seedDemoData } from '../scripts/seed.js';

const router = express.Router();

/**
 * GET /api/system/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'adalat360-backend',
    version: '1.0.0',
    demo: true,
  });
});

/**
 * GET /api/system/llm-usage
 * Get LLM usage statistics for monitoring rate limit
 * This is what allows you to "literally watch you're under budget while demoing live"
 */
router.get('/llm-usage', authenticate, requireRole('SYS'), (req, res) => {
  res.json({
    usage: getUsageStats(),
    demo: true,
  });
});

/**
 * GET /api/system/stats
 * Get system-wide statistics
 */
router.get('/stats', authenticate, requireRole('SYS'), async (req, res, next) => {
  try {
    const [
      userCount,
      caseCount,
      documentCount,
      exhibitCount,
      custodyCount,
      auditCount,
      conflictCount,
      approvalCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.case.count(),
      prisma.document.count(),
      prisma.exhibitEntry.count(),
      prisma.custodyEntry.count(),
      prisma.auditLog.count(),
      prisma.conflictAlert.count(),
      prisma.approvalRequest.count(),
    ]);

    // Cases by status
    const casesByStatus = await prisma.case.groupBy({
      by: ['status'],
      _count: true,
    });

    // Documents by integrity
    const docsByIntegrity = await prisma.document.groupBy({
      by: ['integrity'],
      _count: true,
    });

    // Users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    res.json({
      stats: {
        users: userCount,
        cases: caseCount,
        documents: documentCount,
        exhibits: exhibitCount,
        custodyEntries: custodyCount,
        auditLogs: auditCount,
        conflictAlerts: conflictCount,
        approvalRequests: approvalCount,
        casesByStatus: casesByStatus.map(s => ({ status: s.status, count: s._count })),
        docsByIntegrity: docsByIntegrity.map(d => ({ integrity: d.integrity, count: d._count })),
        usersByRole: usersByRole.map(u => ({ role: u.role, count: u._count })),
      },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/system/seed
 * Seed demo data (development only)
 */
router.post('/seed', authenticate, requireRole('SYS'), async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Seeding not allowed in production' });
    }

    await seedDemoData();

    res.json({ success: true, message: 'Demo data seeded successfully', demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/system/integrity-check/:caseId
 * Run full integrity verification for a case
 */
router.get('/integrity-check/:caseId', authenticate, requireRole('SYS'), async (req, res, next) => {
  try {
    const caseId = req.params.caseId;

    const documents = await prisma.document.findMany({
      where: { caseId },
      select: { id: true, filename: true, sha256Hash: true },
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

        const { sha256 } = await import('../utils/crypto.js');
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
      caseId,
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

export default router;