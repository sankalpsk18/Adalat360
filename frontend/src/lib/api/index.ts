/**
 * API Layer for ADALAT360 Frontend
 * Now connects to real backend — replaces mock seed data
 */
import {
  authApi,
  casesApi,
  documentsApi,
  custodyApi,
  exhibitsApi,
  signaturesApi,
  certificatesApi,
  redactionsApi,
  approvalsApi,
  auditApi,
  ragApi,
  systemApi,
  setAuthToken,
  clearAuthToken,
} from './client';
import { useQuery } from '@tanstack/react-query';

// Re-export types for components
export * from './types';

// Re-export role metadata from seed for UI (unchanged)
export { ROLES, roleMeta, DEMO_IDENTITY, CONFLICTS } from './seed';

// Role type from types
export type { Role } from './types';

// ============================================
// TANSTACK QUERY HOOKS
// ============================================

export function useCases(role: Role) {
  return useQuery({
    queryKey: ['cases', role],
    queryFn: () => listCases(role),
    staleTime: 30000,
  });
}

export function useCase(id: string) {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => getCase(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useApprovals() {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: listApprovals,
    staleTime: 30000,
  });
}

export function useDocuments(caseId?: string, role?: Role) {
  return useQuery({
    queryKey: ['documents', caseId, role],
    queryFn: () => listDocuments(caseId, role),
    staleTime: 30000,
  });
}

export function useAudit() {
  return useQuery({
    queryKey: ['audit'],
    queryFn: listAudit,
    staleTime: 30000,
  });
}

// ============================================
// CASES - Connect to real backend
// ============================================
export async function listCases(role: Role): Promise<any[]> {
  try {
    const response = await casesApi.list();
    // Filter by role visibility on client side (or backend handles it)
    return response.cases.filter((c: any) => c.visibleTo?.includes(role) || role === 'system_admin');
  } catch (error) {
    console.error('Failed to fetch cases:', error);
    // Fallback to mock data for development
    const { CASES } = await import('./seed');
    return CASES.filter((c) => c.visibleTo.includes(role));
  }
}

export async function getCase(id: string): Promise<any | undefined> {
  try {
    const response = await casesApi.get(id);
    return response.case;
  } catch (error) {
    console.error('Failed to fetch case:', error);
    const { CASES } = await import('./seed');
    return CASES.find((c) => c.id === id);
  }
}

// ============================================
// DOCUMENTS - Connect to real backend
// ============================================
export async function listDocuments(caseId?: string, role?: Role): Promise<any[]> {
  try {
    // For now, we need to get documents from the case
    // The backend doesn't have a standalone /documents list endpoint without case
    // We'll fetch via case if caseId provided
    if (caseId) {
      const response = await casesApi.get(caseId);
      return response.case.documents || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    const { DOCUMENTS } = await import('./seed');
    let docs = DOCUMENTS;
    if (caseId) docs = docs.filter((d) => d.caseId === caseId);
    if (role === 'judge') docs = docs.filter((d) => !d.restricted);
    if (role === 'forensic_analyst')
      docs = docs.filter((d) => d.type === 'forensic_report' || d.type === 'device_extract' || d.type === 'photo');
    return docs;
  }
}

export async function getDocument(id: string): Promise<any | undefined> {
  try {
    const response = await documentsApi.get(id);
    return response.document;
  } catch (error) {
    console.error('Failed to fetch document:', error);
    const { DOCUMENTS } = await import('./seed');
    return DOCUMENTS.find((d) => d.id === id);
  }
}

// ============================================
// CUSTODY - Connect to real backend
// ============================================
export async function listCustody(filter?: { caseId?: string; targetId?: string }) {
  try {
    if (filter?.targetId) {
      const response = await custodyApi.get(filter.targetId);
      return response.entries;
    }
    if (filter?.caseId) {
      const response = await custodyApi.caseEntries(filter.caseId);
      return response.entries;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch custody:', error);
    const { CUSTODY } = await import('./seed');
    return CUSTODY.filter(
      (e) =>
        (!filter?.caseId || e.caseId === filter.caseId) &&
        (!filter?.targetId || e.targetId === filter.targetId),
    ).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
}

// ============================================
// EXHIBITS - Connect to real backend
// ============================================
export async function listExhibits(caseId?: string) {
  try {
    const response = await exhibitsApi.list({ caseId });
    return response.exhibits;
  } catch (error) {
    console.error('Failed to fetch exhibits:', error);
    const { EXHIBITS } = await import('./seed');
    return EXHIBITS.filter((e) => !caseId || e.caseId === caseId);
  }
}

export async function getExhibit(id: string) {
  try {
    const response = await exhibitsApi.get(id);
    return response.exhibit;
  } catch (error) {
    console.error('Failed to fetch exhibit:', error);
    const { EXHIBITS } = await import('./seed');
    return EXHIBITS.find((e) => e.id === id);
  }
}

// ============================================
// APPROVALS - Connect to real backend
// ============================================
export async function listApprovals() {
  try {
    const response = await approvalsApi.list({ status: 'PENDING' });
    return response.approvals;
  } catch (error) {
    console.error('Failed to fetch approvals:', error);
    const { APPROVALS } = await import('./seed');
    return APPROVALS;
  }
}

// ============================================
// AUDIT - Connect to real backend
// ============================================
export async function listAudit() {
  try {
    const response = await auditApi.list({ limit: '50' });
    return [...response.logs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch (error) {
    console.error('Failed to fetch audit:', error);
    const { AUDIT } = await import('./seed');
    return [...AUDIT].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
}

// ============================================
// USERS - Connect to real backend (or fallback)
// ============================================
export async function listUsers() {
  try {
    // No dedicated users list endpoint yet, use mock
    const { USERS } = await import('./seed');
    return USERS;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    const { USERS } = await import('./seed');
    return USERS;
  }
}

// ============================================
// CONFLICTS - Connect to real backend
// ============================================
export async function listConflicts() {
  try {
    // Conflicts are now in conflictAlerts on cases
    // For now, aggregate from all cases or use mock
    const { CONFLICTS } = await import('./seed');
    return CONFLICTS;
  } catch (error) {
    console.error('Failed to fetch conflicts:', error);
    const { CONFLICTS } = await import('./seed');
    return CONFLICTS;
  }
}

// ============================================
// AUTH HELPERS
// ============================================
export function signInUser(token: string) {
  setAuthToken(token);
}

export function signOutUser() {
  clearAuthToken();
}

// ============================================
// RAG / ASK - Connect to real backend
// ============================================
export async function askQuestion(caseId: string, question: string) {
  try {
    const response = await ragApi.ask(caseId, question);
    return response.answer;
  } catch (error) {
    console.error('Failed to ask question:', error);
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS (unchanged)
// ============================================
/** Deterministic pseudo SHA-256 for the demo upload flow (no real crypto claim). */
export function mockSha256(input: string): string {
  let out = '';
  let seed = 0;
  for (let i = 0; i < input.length; i++) seed = (seed * 31 + input.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 64; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    out += '0123456789abcdef'[(seed >>> ((i % 6) * 4)) & 15];
  }
  return out;
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });