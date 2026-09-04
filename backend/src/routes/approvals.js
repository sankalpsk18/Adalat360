/**
 * Approval Routes for ADALAT360
 * GET    /api/approvals - List approval requests (inbox)
 * GET    /api/approvals/:id - Get approval details
 * POST   /api/approvals - Create approval request
 * POST   /api/approvals/:id/decide - Approve/reject request
 */

import express from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { authenticate, requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// Validation schemas
const createApprovalSchema = z.object({
  resourceType: z.enum(['DOCUMENT', 'CERTIFICATE', 'CASE', 'EXHIBIT']),
  resourceId: z.string().uuid(),
  caseId: z.string().uuid().optional(),
  approverRole: z.enum(['IO', 'PP', 'REC', 'CRT', 'FSL', 'SYS']),
  title: z.string().min(1),
  description: z.string().optional(),
});

const decideApprovalSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().optional(),
});

/**
 * GET /api/approvals
 * List approval requests - inbox for current user's role
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status = 'PENDING', limit = '50', offset = '0' } = req.query;

    // Build where clause
    const where = {};

    // Filter by status
    if (status !== 'ALL') {
      where.status = status;
    }

    // Non-SYS users see approvals where they are the approver
    if (req.user.role !== 'SYS') {
      where.approverRole = req.user.role;
    }

    const [approvals, total] = await Promise.all([
      prisma.approvalRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          requester: { select: { id: true, name: true, role: true, department: true } },
          reviewer: { select: { id: true, name: true, role: true } },
          case: { select: { id: true, caseNumber: true, title: true } },
        },
      }),
      prisma.approvalRequest.count({ where }),
    ]);

    res.json({
      approvals,
      pagination: { total, limit: parseInt(limit), offset: parseInt(offset) },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/approvals/:id
 * Get approval request details
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const approval = await prisma.approvalRequest.findUnique({
      where: { id: req.params.id },
      include: {
        requester: { select: { id: true, name: true, role: true, department: true } },
        reviewer: { select: { id: true, name: true, role: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
        document: { select: { id: true, filename: true, docType: true, sha256Hash: true } },
      },
    });

    if (!approval) {
      return res.status(404).json({ error: 'Approval request not found' });
    }

    // Check access - requester, reviewer, or SYS can view
    const canView =
      approval.requestedBy === req.user.id ||
      approval.decidedBy === req.user.id ||
      req.user.role === 'SYS' ||
      approval.approverRole === req.user.role;

    if (!canView) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ approval, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/approvals
 * Create new approval request
 */
router.post(
  '/',
  authenticate,
  requireRole('IO', 'REC', 'FSL', 'PP', 'SYS'),
  auditLog('create', 'APPROVAL'),
  async (req, res, next) => {
    try {
      const data = createApprovalSchema.parse(req.body);

      // Verify resource exists
      let resource = null;
      let caseId = data.caseId;

      switch (data.resourceType) {
        case 'DOCUMENT':
          resource = await prisma.document.findUnique({
            where: { id: data.resourceId },
            select: { id: true, caseId: true },
          });
          caseId = resource?.caseId;
          break;
        case 'CERTIFICATE':
          resource = await prisma.certificate.findUnique({
            where: { id: data.resourceId },
            select: { id: true, caseId: true },
          });
          caseId = resource?.caseId;
          break;
        case 'CASE':
          resource = await prisma.case.findUnique({
            where: { id: data.resourceId },
            select: { id: true },
          });
          caseId = resource?.id;
          break;
        case 'EXHIBIT':
          resource = await prisma.exhibitEntry.findUnique({
            where: { id: data.resourceId },
            select: { id: true, caseId: true },
          });
          caseId = resource?.caseId;
          break;
      }

      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      // Check case access
      if (caseId) {
        const caseRecord = await prisma.case.findUnique({
          where: { id: caseId },
          select: { department: true },
        });
        if (req.user.role !== 'SYS' && req.user.department !== caseRecord?.department) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      const approval = await prisma.approvalRequest.create({
        data: {
          resourceType: data.resourceType,
          resourceId: data.resourceId,
          caseId,
          requestedBy: req.user.id,
          approverRole: data.approverRole,
          title: data.title,
          status: 'PENDING',
        },
        include: {
          requester: { select: { name: true, role: true } },
          case: { select: { caseNumber: true, title: true } },
        },
      });

      res.status(201).json({ approval, demo: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/approvals/:id/decide
 * Approve or reject an approval request
 */
router.post(
  '/:id/decide',
  authenticate,
  auditLog('decide', 'APPROVAL'),
  async (req, res, next) => {
    try {
      const { decision, notes } = decideApprovalSchema.parse(req.body);

      const approval = await prisma.approvalRequest.findUnique({
        where: { id: req.params.id },
        include: {
          case: { select: { department: true } },
        },
      });

      if (!approval) {
        return res.status(404).json({ error: 'Approval request not found' });
      }

      // Check permissions
      if (req.user.role !== 'SYS' && approval.approverRole !== req.user.role) {
        return res.status(403).json({
          error: 'Not authorized to decide this approval',
          requiredRole: approval.approverRole,
          yourRole: req.user.role,
        });
      }

      if (approval.status !== 'PENDING') {
        return res.status(409).json({
          error: 'Approval already decided',
          currentStatus: approval.status,
        });
      }

      const updated = await prisma.approvalRequest.update({
        where: { id: req.params.id },
        data: {
          status: decision,
          decidedBy: req.user.id,
          decidedAt: new Date(),
        },
      });

      // If approved, handle specific resource actions
      if (decision === 'APPROVED') {
        await handleApprovalAction(approval, req.user);
      }

      res.json({ approval: updated, demo: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Handle post-approval actions based on resource type
 */
async function handleApprovalAction(approval, user) {
  switch (approval.resourceType) {
    case 'DOCUMENT':
      // For document signature approvals, the actual signing is separate
      // This could trigger notification or next workflow step
      break;
    case 'CERTIFICATE':
      // Certificate generation approval - certificate should already exist as draft
      break;
    case 'CASE':
      // Case status update approval
      break;
    case 'EXHIBIT':
      // Exhibit transfer/release approval
      break;
  }
}

export default router;