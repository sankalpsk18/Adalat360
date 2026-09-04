import { useQuery } from '@tanstack/react-query';
import {
  casesApi,
  documentsApi,
  custodyApi,
  exhibitsApi,
  approvalsApi,
  auditApi,
  signaturesApi,
  certificatesApi,
  redactionsApi,
  ragApi,
  systemApi,
  type Role,
} from './api/client';

// Cases
export function useCases(role: Role | null) {
  return useQuery({
    queryKey: ['cases', role],
    queryFn: async () => (await casesApi.list()).cases,
    enabled: !!role,
    staleTime: 30000,
  });
}

export function useCase(id: string) {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => casesApi.get(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCaseStats(id: string) {
  return useQuery({
    queryKey: ['case', id, 'stats'],
    queryFn: () => casesApi.stats(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCasePriorityBreakdown(id: string) {
  return useQuery({
    queryKey: ['case', id, 'priority'],
    queryFn: () => casesApi.priorityBreakdown(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Documents
export function useDocuments(caseId?: string) {
  return useQuery({
    queryKey: ['documents', caseId],
    queryFn: async () => {
      if (!caseId) return [];
      const caseData = await casesApi.get(caseId);
      return caseData.case.documents || [];
    },
    enabled: !!caseId,
    staleTime: 30000,
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => documentsApi.get(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useDocumentVersions(id: string) {
  return useQuery({
    queryKey: ['document', id, 'versions'],
    queryFn: () => documentsApi.versions(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Custody
export function useCustody(documentId: string) {
  return useQuery({
    queryKey: ['custody', documentId],
    queryFn: async () => {
      const response = await custodyApi.get(documentId);
      return Array.isArray(response) ? response : response.entries || [];
    },
    enabled: !!documentId,
    staleTime: 30000,
  });
}

export function useCustodyVerify(documentId: string) {
  return useQuery({
    queryKey: ['custody', documentId, 'verify'],
    queryFn: () => custodyApi.verify(documentId),
    enabled: !!documentId,
    staleTime: 30000,
  });
}

export function useCaseCustody(caseId: string) {
  return useQuery({
    queryKey: ['custody', 'case', caseId],
    queryFn: async () =>
      (await custodyApi.caseEntries(caseId)).entries.map((entry: any) => ({
        ...entry,
        actor: entry.actor?.name || entry.actorId,
        actorRole: ({
          IO: 'investigating_officer',
          REC: 'records_section',
          FSL: 'forensic_analyst',
          PP: 'prosecutor',
          CRT: 'judge',
          SYS: 'system_admin',
        } as Record<string, Role>)[entry.actor?.role] || 'investigating_officer',
        hash: entry.entryHash,
        prevHash: entry.prevEntryHash,
        note: entry.notes,
      })),
    enabled: !!caseId,
    staleTime: 30000,
  });
}

// Exhibits
export function useExhibits(caseId?: string) {
  return useQuery({
    queryKey: ['exhibits', caseId],
    queryFn: async () => (await exhibitsApi.list({ caseId })).exhibits,
    enabled: !!caseId,
    staleTime: 30000,
  });
}

export function useExhibit(id: string) {
  return useQuery({
    queryKey: ['exhibit', id],
    queryFn: () => exhibitsApi.get(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Approvals
export function useApprovals() {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => (await approvalsApi.list({ status: 'PENDING' })).approvals,
    staleTime: 30000,
  });
}

export function useApproval(id: string) {
  return useQuery({
    queryKey: ['approval', id],
    queryFn: () => approvalsApi.get(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Audit
export function useAudit(params?: { limit?: string; caseId?: string }) {
  return useQuery({
    queryKey: ['audit', params],
    queryFn: async () => (await auditApi.list(params)).logs,
    staleTime: 30000,
  });
}

export function useAuditStats(caseId?: string) {
  return useQuery({
    queryKey: ['audit', 'stats', caseId],
    queryFn: () => auditApi.stats({ caseId, days: '30' }),
    enabled: !!caseId,
    staleTime: 60000,
  });
}

// Signatures
export function useSignatures(documentId: string) {
  return useQuery({
    queryKey: ['signatures', documentId],
    queryFn: () => signaturesApi.getDocumentSignatures(documentId),
    enabled: !!documentId,
    staleTime: 30000,
  });
}

// Certificates
export function useCertificates(documentId: string) {
  return useQuery({
    queryKey: ['certificates', documentId],
    queryFn: () => certificatesApi.listForDocument(documentId),
    enabled: !!documentId,
    staleTime: 30000,
  });
}

// Redactions
export function useRedactions(documentId: string) {
  return useQuery({
    queryKey: ['redactions', documentId],
    queryFn: () => redactionsApi.list(documentId),
    enabled: !!documentId,
    staleTime: 30000,
  });
}

// RAG
export function useRagAsk(caseId: string, question: string) {
  return useQuery({
    queryKey: ['rag', caseId, question],
    queryFn: () => ragApi.ask(caseId, question),
    enabled: !!caseId && !!question,
    staleTime: 0, // Don't cache, always fresh
  });
}

// System
export function useSystemHealth() {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => systemApi.health(),
    staleTime: 60000,
  });
}

export function useSystemStats() {
  return useQuery({
    queryKey: ['system', 'stats'],
    queryFn: () => systemApi.stats(),
    staleTime: 60000,
  });
}