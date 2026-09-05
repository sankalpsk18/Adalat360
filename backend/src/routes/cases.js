/**
 * Cases Routes for ADALAT360
 * GET    /api/cases - List cases visible to user's role
 * GET    /api/cases/:id - Get case details
 * POST   /api/cases - Create new case (IO, SYS)
 * PATCH  /api/cases/:id - Update case (IO, PP, SYS)
 * GET    /api/cases/:id/priority-breakdown - Get priority scoring breakdown
 */

import express from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { authenticate, requireRole, requireCaseAccess, auditLog } from '../middleware/rbac.js';
import { calculatePriorityScore } from '../utils/priority.js';

const router = express.Router();

// Validation schemas
const createCaseSchema = z.object({
  caseNumber: z.string().min(1, 'Case number is required'),
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['OPEN', 'UNDER_INVESTIGATION', 'CHARGESHEET_FILED', 'IN_COURT', 'CLOSED']).default('OPEN'),
  courtDate: z.string().datetime().optional(),
  officerIds: z.array(z.string().uuid()).optional(),
});

const updateCaseSchema = z.object({
  title: z.string().optional(),
  status: z.enum(['OPEN', 'UNDER_INVESTIGATION', 'CHARGESHEET_FILED', 'IN_COURT', 'CLOSED']).optional(),
  department: z.string().optional(),
  courtDate: z.string().datetime().nullable().optional(),
  officerIds: z.array(z.string().uuid()).optional(),
});

/**
 * GET /api/cases
 * List cases visible to user's role and department
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, department, limit = '50', offset = '0' } = req.query;

    // Build where clause based on role
    let where = {};

    // System admins see all cases (but only metadata)
    if (req.user.role !== 'SYS') {
      where.OR = [
        { department: req.user.department },
        { officers: { some: { id: req.user.id } } }
      ];
    }

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    // Filter by department if provided (for SYS)
    if (department && req.user.role === 'SYS') {
      where.department = department;
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        orderBy: { lastActivityAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          officers: {
            select: { id: true, name: true, role: true },
          },
          _count: {
            select: { documents: true, exhibits: true },
          },
        },
      }),
      prisma.case.count({ where }),
    ]);

    // Calculate priority for each case
    const casesWithPriority = await Promise.all(
      cases.map(async (c) => {
        const priority = await calculatePriorityScore(c.id);
        return {
          ...c,
          priorityScore: priority.score,
          priorityLabel: priority.label,
          demo: true,
        };
      })
    );

    res.json({
      cases: casesWithPriority,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases/:id
 * Get case details with documents, exhibits, officers
 */
router.get('/:id', authenticate, requireCaseAccess, async (req, res, next) => {
  try {
    const caseRecord = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: {
        officers: {
          select: { id: true, name: true, role: true, department: true },
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
          select: {
            id: true,
            filename: true,
            version: true,
            sha256Hash: true,
            integrity: true,
            restricted: true,
            redactedCopy: true,
            signed: true,
            signedBy: true,
            docType: true,
            uploadedAt: true,
          },
        },
        exhibits: {
          orderBy: { updatedAt: 'desc' },
        },
        conflictAlerts: {
          where: { resolved: false },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { documents: true, exhibits: true, approvalRequests: true },
        },
      },
    });

    if (!caseRecord) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Calculate priority
    const priority = await calculatePriorityScore(caseRecord.id);

    res.json({
      case: {
        ...caseRecord,
        priorityScore: priority.score,
        priorityLabel: priority.label,
        priorityBreakdown: priority.breakdown,
      },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/cases
 * Create new case (IO, SYS only)
 */
router.post(
  '/',
  authenticate,
  requireRole('IO', 'SYS'),
  auditLog('create', 'CASE'),
  async (req, res, next) => {
    try {
      const data = createCaseSchema.parse(req.body);

      // Check case number uniqueness
      const existing = await prisma.case.findUnique({
        where: { caseNumber: data.caseNumber },
      });
      if (existing) {
        return res.status(409).json({ error: 'Case number already exists' });
      }

      // Create case
      const newCase = await prisma.case.create({
        data: {
          caseNumber: data.caseNumber,
          title: data.title,
          department: data.department,
          status: data.status,
          courtDate: data.courtDate ? new Date(data.courtDate) : null,
          officers: data.officerIds
            ? { connect: data.officerIds.map(id => ({ id })) }
            : { connect: [{ id: req.user.id }] },
        },
        include: {
          officers: { select: { id: true, name: true, role: true } },
        },
      });

      res.status(201).json({ case: newCase, demo: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/cases/:id
 * Update case (IO, PP, SYS)
 */
router.patch(
  '/:id',
  authenticate,
  requireCaseAccess,
  requireRole('IO', 'PP', 'SYS'),
  auditLog('update', 'CASE'),
  async (req, res, next) => {
    try {
      const data = updateCaseSchema.parse(req.body);

      const updated = await prisma.case.update({
        where: { id: req.params.id },
        data: {
          title: data.title,
          status: data.status,
          department: data.department,
          courtDate: data.courtDate ? new Date(data.courtDate) : undefined,
          officers: data.officerIds
            ? { set: data.officerIds.map(id => ({ id })) }
            : undefined,
          lastActivityAt: new Date(),
        },
        include: {
          officers: { select: { id: true, name: true, role: true } },
        },
      });

      res.json({ case: updated, demo: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/cases/:id/priority-breakdown
 * Get interactive priority scoring breakdown
 */
router.get('/:id/priority-breakdown', authenticate, requireCaseAccess, async (req, res, next) => {
  try {
    const priority = await calculatePriorityScore(req.params.id);
    res.json({ priority, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases/:id/stats
 * Get case statistics for dashboard
 */
router.get('/:id/stats', authenticate, requireCaseAccess, async (req, res, next) => {
  try {
    const caseId = req.params.id;

    const [
      documentCount,
      exhibitCount,
      pendingApprovals,
      integrityAlerts,
      recentActivity,
    ] = await Promise.all([
      prisma.document.count({ where: { caseId } }),
      prisma.exhibitEntry.count({ where: { caseId } }),
      prisma.approvalRequest.count({
        where: { caseId, status: 'PENDING' },
      }),
      prisma.conflictAlert.count({
        where: { caseId, resolved: false },
      }),
      prisma.auditLog.findMany({
        where: { caseId },
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: { actor: { select: { name: true, role: true } } },
      }),
    ]);

    res.json({
      stats: {
        documentCount,
        exhibitCount,
        pendingApprovals,
        integrityAlerts,
        recentActivity: recentActivity.map(a => ({
          id: a.id,
          actor: a.actor.name,
          actorRole: a.actor.role,
          action: a.action,
          target: a.resourceId,
          timestamp: a.timestamp,
        })),
      },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

export default router;