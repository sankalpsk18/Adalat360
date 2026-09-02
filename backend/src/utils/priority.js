/**
 * Priority Scoring for ADALAT360
 * Deterministic scoring function - NO LLM
 * Weights: days since activity, open alerts, evidence completeness, court date proximity
 */

import { prisma } from '../index.js';

/**
 * Calculate case priority score and breakdown
 * @param {string} caseId - Case ID
 * @returns {Promise<Object>} Priority score, label, and component breakdown
 */
export async function calculatePriorityScore(caseId) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      documents: {
        select: { integrity: true, signed: true },
      },
      conflictAlerts: {
        where: { resolved: false },
        select: { severity: true },
      },
      exhibits: {
        select: { custodyStatus: true },
      },
    },
  });

  if (!caseRecord) {
    throw new Error('Case not found');
  }

  const now = new Date();
  const components = {};

  // 1. Days since last activity (0-30 points)
  // More recent = lower priority (less urgent)
  const daysSinceActivity = (now - new Date(caseRecord.lastActivityAt)) / (1000 * 60 * 60 * 24);
  components.activityRecency = {
    label: 'Days since last activity',
    value: Math.round(daysSinceActivity * 10) / 10,
    score: Math.min(30, Math.max(0, Math.round(daysSinceActivity))),
    maxScore: 30,
    description: 'Older cases get higher priority',
  };

  // 2. Open integrity alerts (0-25 points)
  // More alerts = higher priority
  const alertCount = caseRecord.conflictAlerts.length;
  const criticalAlerts = caseRecord.conflictAlerts.filter(a => a.severity === 'CRITICAL').length;
  const highAlerts = caseRecord.conflictAlerts.filter(a => a.severity === 'HIGH').length;
  components.integrityAlerts = {
    label: 'Open integrity alerts',
    value: alertCount,
    score: Math.min(25, alertCount * 5 + criticalAlerts * 5 + highAlerts * 2),
    maxScore: 25,
    description: 'Each alert adds 5 points; critical adds 10 more, high adds 2 more',
    breakdown: {
      total: alertCount,
      critical: criticalAlerts,
      high: highAlerts,
    },
  };

  // 3. Evidence completeness (0-25 points)
  // Fewer documents = higher priority (needs more work)
  const docCount = caseRecord.documents.length;
  const signedDocs = caseRecord.documents.filter(d => d.signed).length;
  const verifiedDocs = caseRecord.documents.filter(d => d.integrity === 'VERIFIED').length;
  const completenessRatio = docCount > 0 ? (signedDocs + verifiedDocs) / (docCount * 2) : 0;
  components.evidenceCompleteness = {
    label: 'Evidence completeness',
    value: `${Math.round(completenessRatio * 100)}%`,
    score: Math.min(25, Math.max(0, Math.round((1 - completenessRatio) * 25))),
    maxScore: 25,
    description: 'Lower completeness = higher priority',
    breakdown: {
      totalDocuments: docCount,
      signed: signedDocs,
      verified: verifiedDocs,
      completenessRatio: Math.round(completenessRatio * 100) / 100,
    },
  };

  // 4. Court date proximity (0-20 points)
  // Closer court date = higher priority
  let courtDateScore = 0;
  let daysToCourt = null;
  if (caseRecord.courtDate) {
    daysToCourt = (new Date(caseRecord.courtDate) - now) / (1000 * 60 * 60 * 24);
    if (daysToCourt <= 0) {
      courtDateScore = 20; // Past due or today
    } else if (daysToCourt <= 7) {
      courtDateScore = 20; // Within a week
    } else if (daysToCourt <= 30) {
      courtDateScore = 15; // Within a month
    } else if (daysToCourt <= 90) {
      courtDateScore = 10; // Within 3 months
    } else {
      courtDateScore = 5; // Further out
    }
  }
  components.courtDateProximity = {
    label: 'Court date proximity',
    value: daysToCourt !== null ? `${Math.round(daysToCourt)} days` : 'Not scheduled',
    score: courtDateScore,
    maxScore: 20,
    description: 'Closer court dates increase priority',
    breakdown: {
      daysToCourt: daysToCourt ? Math.round(daysToCourt * 10) / 10 : null,
      courtDate: caseRecord.courtDate,
    },
  };

  // Total score (0-100)
  const totalScore = Object.values(components).reduce((sum, c) => sum + c.score, 0);

  // Determine label
  let label;
  if (totalScore >= 70) label = 'HIGH';
  else if (totalScore >= 40) label = 'MEDIUM';
  else label = 'LOW';

  return {
    score: totalScore,
    label,
    breakdown: components,
    caseId,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Update case priority in database
 * @param {string} caseId - Case ID
 * @returns {Promise<void>}
 */
export async function updateCasePriority(caseId) {
  const priority = await calculatePriorityScore(caseId);
  await prisma.case.update({
    where: { id: caseId },
    data: {
      priorityScore: priority.score,
      priorityLabel: priority.label,
      lastActivityAt: new Date(),
    },
  });
}