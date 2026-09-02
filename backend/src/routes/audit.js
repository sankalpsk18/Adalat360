/**
 * Audit Routes for ADALAT360
 * GET /api/audit - List audit logs (with filters)
 * GET /api/audit/:id - Get audit entry details
 * GET /api/audit/stats - Get audit statistics
 */

import express from 'express';
import { prisma } from '../index.js';
import { authenticate, requireRole } from '../middleware/rbac.js';

const router = express.Router();

/**
 * GET /api/audit
 * List audit logs with filters
 * SYS sees all, others see only their department's cases
 */
router.get('/', authenticate, requireRole('SYS', 'IO', 'PP', 'CRT'), async (req, res, next) => {
  try {
    const {
      actorId,
      action,
      resourceType,
      caseId,
      startDate,
      endDate,
      limit = '100',
      offset = '0',
    } = req.query;

    const where = {};

    // Filter by actor
    if (actorId) where.actorId = actorId;

    // Filter by action
    if (action) where.action = action;

    // Filter by resource type
    if (resourceType) where.resourceType = resourceType;

    // Filter by case
    if (caseId) where.caseId = caseId;

    // Filter by date range
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    // Non-SYS users only see audit logs from their department's cases
    if (req.user.role !== 'SYS') {
      const cases = await prisma.case.findMany({
        where: { department: req.user.department },
        select: { id: true },
      });
      where.caseId = { in: cases.map(c => c.id) };
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          actor: { select: { id: true, name: true, role: true, department: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      logs,
      pagination: { total, limit: parseInt(limit), offset: parseInt(offset) },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/audit/:id
 * Get audit entry details
 */
router.get('/:id', authenticate, requireRole('SYS', 'IO', 'PP', 'CRT'), async (req, res, next) => {
  try {
    const log = await prisma.auditLog.findUnique({
      where: { id: req.params.id },
      include: {
        actor: { select: { id: true, name: true, role: true, department: true } },
      },
    });

    if (!log) {
      return res.status(404).json({ error: 'Audit log not found' });
    }

    // Check access for non-SYS
    if (req.user.role !== 'SYS' && log.caseId) {
      const caseRecord = await prisma.case.findUnique({
        where: { id: log.caseId },
        select: { department: true },
      });
      if (caseRecord?.department !== req.user.department) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json({ log, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/audit/stats
 * Get audit statistics for dashboard
 */
router.get('/stats', authenticate, requireRole('SYS', 'IO', 'PP', 'CRT'), async (req, next) => {
  try {
    const { caseId, days = '30' } = req.query;
    const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    const where = { timestamp: { gte: since } };

    if (caseId) where.caseId = caseId;

    // Non-SYS users only see their department
    if (req.user.role !== 'SYS') {
      const cases = await prisma.case.findMany({
        where: { department: req.user.department },
        select: { id: true },
      });
      where.caseId = { in: cases.map(c => c.id) };
    }

    const [totalLogs, actionCounts, actorCounts, dailyCounts] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
        orderBy: { _count: { action: 'desc' } },
      }),
      prisma.auditLog.groupBy({
        by: ['actorId'],
        where,
        _count: true,
        orderBy: { _count: { actorId: 'desc' } },
        take: 10,
      }),
      prisma.$queryRaw`
        SELECT DATE(timestamp) as date, COUNT(*) as count
        FROM audit_logs
        WHERE timestamp >= ${since}
        ${caseId ? `AND case_id = '${caseId}'` : ''}
        GROUP BY DATE(timestamp)
        ORDER BY date DESC
        LIMIT 30
      `,
    ]);

    // Get actor names for top actors
    const actorIds = actorCounts.map(a => a.actorId);
    const actors = await prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, name: true, role: true },
    });

    const actorMap = new Map(actors.map(a => [a.id, a]));

    res.json({
      stats: {
        totalLogs,
        actionBreakdown: actionCounts.map(a => ({
          action: a.action,
          count: a._count,
        })),
        topActors: actorCounts.map(a => ({
          actor: actorMap.get(a.actorId) || { name: 'Unknown', role: 'Unknown' },
          count: a._count,
        })),
        dailyActivity: dailyCounts,
      },
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/audit/export
 * Export audit logs as CSV (SYS only)
 */
router.get('/export', authenticate, requireRole('SYS'), async (req, res, next) => {
  try {
    const { caseId, startDate, endDate } = req.query;

    const where = {};
    if (caseId) where.caseId = caseId;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'asc' },
      include: {
        actor: { select: { name: true, role: true } },
      },
    });

    // Convert to CSV
    const headers = ['ID', 'Timestamp', 'Actor', 'Actor Role', 'Action', 'Resource Type', 'Resource ID', 'Case ID', 'IP', 'Metadata'];
    const rows = logs.map(log => [
      log.id,
      log.timestamp.toISOString(),
      log.actor?.name || 'Unknown',
      log.actor?.role || 'Unknown',
      log.action,
      log.resourceType,
      log.resourceId,
      log.caseId || '',
      log.ip || '',
      JSON.stringify(log.metadata || {}),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit-export-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

export default router;