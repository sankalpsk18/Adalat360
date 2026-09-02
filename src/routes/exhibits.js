/**
 * Exhibit Routes for ADALAT360
 * GET    /api/exhibits - List exhibits (filter by case)
 * GET    /api/exhibits/:id - Get exhibit details
 * POST   /api/exhibits - Register new exhibit
 * PATCH  /api/exhibits/:id - Update exhibit status/location
 */

import express from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { authenticate, requireRole, requireCaseAccess, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// Validation schemas
const createExhibitSchema = z.object({
  caseId: z.string().uuid(),
  label: z.string().min(1, 'Exhibit label is required'),
  category: z.enum(['WEAPON', 'VEHICLE', 'CASH', 'DEVICE', 'DOCUMENT', 'BIOLOGICAL']),
  documentId: z.string().uuid().optional(),
  initialStatus: z.enum(['IN_MALKHANA', 'WITH_FSL', 'IN_COURT', 'IN_TRANSIT', 'RELEASED']).default('IN_MALKHANA'),
  location: z.string().min(1, 'Location is required'),
  sealHash: z.string().optional(),
});

const updateExhibitSchema = z.object({
  label: z.string().optional(),
  status: z.enum(['IN_MALKHANA', 'WITH_FSL', 'IN_COURT', 'IN_TRANSIT', 'RELEASED']).optional(),
  location: z.string().optional(),
  holder: z.string().optional(),
  sealHash: z.string().optional(),
});

/**
 * GET /api/exhibits
 * List exhibits with optional case filter
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { caseId, status, category, limit = '50', offset = '0' } = req.query;

    const where = {};

    // Filter by case
    if (caseId) {
      where.caseId = caseId;
    } else if (req.user.role !== 'SYS') {
      // Non-SYS users only see exhibits from their department's cases
      const cases = await prisma.case.findMany({
        where: { department: req.user.department },
        select: { id: true },
      });
      where.caseId = { in: cases.map(c => c.id) };
    }

    if (status) where.status = status;
    if (category) where.category = category;

    const [exhibits, total] = await Promise.all([
      prisma.exhibitEntry.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          case: { select: { id: true, caseNumber: true, title: true } },
          document: { select: { id: true, filename: true, sha256Hash: true } },
        },
      }),
      prisma.exhibitEntry.count({ where }),
    ]);

    res.json({
      exhibits,
      pagination: { total, limit: parseInt(limit), offset: parseInt(offset) },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/exhibits/:id
 * Get exhibit details with custody history
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const exhibit = await prisma.exhibitEntry.findUnique({
      where: { id: req.params.id },
      include: {
        case: { select: { id: true, caseNumber: true, title: true, department: true } },
        document: { select: { id: true, filename: true, sha256Hash: true, docType: true } },
      },
    });

    if (!exhibit) {
      return res.status(404).json({ error: 'Exhibit not found' });
    }

    // Check access
    if (req.user.role !== 'SYS' && req.user.department !== exhibit.case.department) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get custody entries for this exhibit
    const custodyEntries = await prisma.custodyEntry.findMany({
      where: {
        caseId: exhibit.caseId,
        notes: { contains: exhibit.exhibitCode },
      },
      orderBy: { timestamp: 'asc' },
      include: {
        actor: { select: { name: true, role: true } },
      },
    });

    res.json({ exhibit, custodyHistory: custodyEntries, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/exhibits
 * Register new physical exhibit
 */
router.post(
  '/',
  authenticate,
  requireRole('IO', 'REC', 'FSL', 'SYS'),
  auditLog('register', 'EXHIBIT'),
  async (req, res, next) => {
    try {
      const data = createExhibitSchema.parse(req.body);

      // Verify case access
      const caseRecord = await prisma.case.findUnique({
        where: { id: data.caseId },
        select: { id: true, department: true },
      });

      if (!caseRecord) {
        return res.status(404).json({ error: 'Case not found' });
      }

      if (req.user.role !== 'SYS' && req.user.department !== caseRecord.department) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Generate exhibit code: EX-YYYY-NNN
      const year = new Date().getFullYear();
      const count = await prisma.exhibitEntry.count({
        where: {
          caseId: data.caseId,
          exhibitCode: { startsWith: `EX-${year}-` },
        },
      });
      const exhibitCode = `EX-${year}-${String(count + 1).padStart(3, '0')}`;

      // Generate seal hash if not provided
      const sealHash = data.sealHash || `SEAL-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

      const exhibit = await prisma.exhibitEntry.create({
        data: {
          caseId: data.caseId,
          documentId: data.documentId,
          exhibitCode,
          label: data.label,
          category: data.category,
          status: data.initialStatus,
          location: data.location,
          holder: req.user.name,
          sealHash,
        },
        include: {
          case: { select: { caseNumber: true, title: true } },
        },
      });

      // Create custody entry
      const prevHash = await getLastCustodyHash(data.caseId);
      const entryHash = sha256(`${prevHash || ''}|REGISTER|${req.user.id}|${new Date().toISOString()}`);

      await prisma.custodyEntry.create({
        data: {
          documentId: data.documentId || exhibit.id, // Use exhibit ID if no document
          actorId: req.user.id,
          action: 'TRANSFER',
          prevEntryHash: prevHash,
          entryHash,
          caseId: data.caseId,
          notes: `Exhibit registered: ${exhibitCode} - ${data.label}`,
        },
      });

      res.status(201).json({ exhibit, demo: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/exhibits/:id
 * Update exhibit status, location, holder
 */
router.patch(
  '/:id',
  authenticate,
  requireRole('IO', 'REC', 'FSL', 'SYS'),
  auditLog('update', 'EXHIBIT'),
  async (req, res, next) => {
    try {
      const data = updateExhibitSchema.parse(req.body);

      const exhibit = await prisma.exhibitEntry.findUnique({
        where: { id: req.params.id },
        select: { id: true, caseId: true, exhibitCode: true, case: { select: { department: true } } },
      });

      if (!exhibit) {
        return res.status(404).json({ error: 'Exhibit not found' });
      }

      if (req.user.role !== 'SYS' && req.user.department !== exhibit.case.department) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updated = await prisma.exhibitEntry.update({
        where: { id: req.params.id },
        data: {
          label: data.label,
          status: data.status,
          location: data.location,
          holder: data.holder,
          sealHash: data.sealHash,
        },
      });

      // Create custody entry for status change
      const prevHash = await getLastCustodyHash(exhibit.caseId);
      const entryHash = sha256(`${prevHash || ''}|TRANSFER|${req.user.id}|${new Date().toISOString()}`);

      await prisma.custodyEntry.create({
        data: {
          documentId: exhibit.id,
          actorId: req.user.id,
          action: 'TRANSFER',
          prevEntryHash: prevHash,
          entryHash,
          caseId: exhibit.caseId,
          notes: `Exhibit ${exhibit.exhibitCode} status changed to ${data.status}, location: ${data.location}`,
        },
      });

      res.json({ exhibit: updated, demo: true });
    } catch (error) {
      next(error);
    }
  }
);

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

// Need sha256 and crypto
import { sha256 } from '../utils/crypto.js';
import crypto from 'crypto';

export default router;