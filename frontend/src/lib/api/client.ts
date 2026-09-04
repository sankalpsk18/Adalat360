const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adalat360_token');
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adalat360_token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adalat360_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers as Record<string, string>),
  };

  console.log('[API] Request:', endpoint, options.body);

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  console.log('[API] Response:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error('[API] Error:', error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Auth
export const authApi = {
  login: (serviceBarId: string, passphrase: string, role: string) =>
    request<{ user: any; token: string; demo: boolean }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ serviceBarId, passphrase, role }),
    }),

  me: () => request<{ user: any; demo: boolean }>('/auth/me'),

  logout: () => request<{ success: boolean; demo: boolean }>('/auth/logout', {
    method: 'POST',
  }),

  register: (data: { name: string; serviceBarId: string; passphrase: string; role: string; department: string }) =>
    request<{ user: any; demo: boolean }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Cases
export const casesApi = {
  list: (params?: { status?: string; department?: string; limit?: string; offset?: string }) =>
    request<{ cases: any[]; pagination: any; demo: boolean }>('/cases', {
      params,
    }),

  get: (id: string) =>
    request<{ case: any; demo: boolean }>(`/cases/${id}`),

  create: (data: { caseNumber: string; title: string; department: string; status?: string; courtDate?: string; officerIds?: string[] }) =>
    request<{ case: any; demo: boolean }>('/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { title?: string; status?: string; department?: string; courtDate?: string | null; officerIds?: string[] }) =>
    request<{ case: any; demo: boolean }>(`/cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  priorityBreakdown: (id: string) =>
    request<{ priority: any; demo: boolean }>(`/cases/${id}/priority-breakdown`),

  stats: (id: string) =>
    request<{ stats: any; demo: boolean }>(`/cases/${id}/stats`),
};

// Documents
export const documentsApi = {
  upload: (file: File, caseId: string, title?: string, docType?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    if (title) formData.append('title', title);
    if (docType) formData.append('docType', docType);

    const token = getToken();
    return fetch(`${API_BASE}/documents`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }
      return res.json();
    });
  },

  get: (id: string) =>
    request<{ document: any; demo: boolean }>(`/documents/${id}`),

  versions: (id: string) =>
    request<{ versions: any[]; demo: boolean }>(`/documents/${id}/versions`),

  download: (id: string) => {
    const token = getToken();
    return fetch(`${API_BASE}/documents/${id}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });
  },

  view: (id: string) =>
    request<{ document: any; demo: boolean }>(`/documents/${id}/view`),

  update: (id: string, data: { title?: string; docType?: string; restricted?: boolean; ocrText?: string }) =>
    request<{ document: any; demo: boolean }>(`/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  lock: (id: string) =>
    request<{ success: boolean; message: string; demo: boolean }>(`/documents/${id}`, {
      method: 'DELETE',
    }),
};

// Custody
export const custodyApi = {
  get: (documentId: string) =>
    request<{ entries: any[]; demo: boolean }>(`/custody/${documentId}`),

  verify: (documentId: string) =>
    request<{ verified: boolean; entriesChecked: number; brokenLink: any; lastVerifiedHash: string; demo: boolean }>(`/custody/${documentId}/verify`),

  caseEntries: (caseId: string, params?: { limit?: string; offset?: string; action?: string }) =>
    request<{ entries: any[]; pagination: any; demo: boolean }>(`/custody/case/${caseId}`, { params }),

  verifyAll: (caseId: string) =>
    request<{ caseId: string; totalDocuments: number; verified: number; mismatched: number; results: any[]; demo: boolean }>(`/custody/verify-all/${caseId}`),
};

// Exhibits
export const exhibitsApi = {
  list: (params?: { caseId?: string; status?: string; category?: string; limit?: string; offset?: string }) =>
    request<{ exhibits: any[]; pagination: any; demo: boolean }>('/exhibits', { params }),

  get: (id: string) =>
    request<{ exhibit: any; custodyHistory: any[]; demo: boolean }>(`/exhibits/${id}`),

  create: (data: { caseId: string; label: string; category: string; documentId?: string; initialStatus?: string; location: string; sealHash?: string }) =>
    request<{ exhibit: any; demo: boolean }>('/exhibits', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { label?: string; status?: string; location?: string; holder?: string; sealHash?: string }) =>
    request<{ exhibit: any; demo: boolean }>(`/exhibits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Signatures
export const signaturesApi = {
  signDocument: (id: string) =>
    request<{ signature: any; demo: boolean }>(`/signatures/document/${id}`, {
      method: 'POST',
    }),

  signCertificate: (id: string) =>
    request<{ signature: any; demo: boolean }>(`/signatures/certificate/${id}`, {
      method: 'POST',
    }),

  getDocumentSignatures: (id: string) =>
    request<{ signatures: any[]; demo: boolean }>(`/signatures/document/${id}`),

  getCertificateSignatures: (id: string) =>
    request<{ signatures: any[]; demo: boolean }>(`/signatures/certificate/${id}`),

  verify: (targetType: string, targetId: string, signatureValue: string, publicKey: string) =>
    request<{ valid: boolean; targetType: string; targetId: string; verifiedAt: string; demo: boolean }>('/signatures/verify', {
      method: 'POST',
      body: JSON.stringify({ targetType, targetId, signatureValue, publicKey }),
    }),
};

// Certificates
export const certificatesApi = {
  generate: (documentId: string) =>
    request<{ certificate: any; demo: boolean }>(`/certificates/document/${documentId}`, {
      method: 'POST',
    }),

  get: (id: string) =>
    request<{ certificate: any; demo: boolean }>(`/certificates/${id}`),

  listForDocument: (documentId: string) =>
    request<{ certificates: any[]; demo: boolean }>(`/certificates/document/${documentId}`),

  regenerate: (id: string) =>
    request<{ certificate: any; demo: boolean }>(`/certificates/${id}/regenerate`, {
      method: 'POST',
    }),
};

// Redactions
export const redactionsApi = {
  create: (documentId: string, regions: { x: number; y: number; width: number; height: number; page: number }[], reason: string) =>
    request<{ redaction: any; newDocumentVersion: any; demo: boolean }>(`/redactions/document/${documentId}`, {
      method: 'POST',
      body: JSON.stringify({ regions, reason }),
    }),

  list: (documentId: string) =>
    request<{ redactions: any[]; demo: boolean }>(`/redactions/document/${documentId}`),

  get: (id: string) =>
    request<{ redaction: any; demo: boolean }>(`/redactions/${id}`),
};

// Approvals
export const approvalsApi = {
  list: (params?: { status?: string; limit?: string; offset?: string }) =>
    request<{ approvals: any[]; pagination: any; demo: boolean }>('/approvals', { params }),

  get: (id: string) =>
    request<{ approval: any; demo: boolean }>(`/approvals/${id}`),

  create: (data: { resourceType: string; resourceId: string; caseId?: string; approverRole: string; title: string; description?: string }) =>
    request<{ approval: any; demo: boolean }>('/approvals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  decide: (id: string, decision: 'APPROVED' | 'REJECTED', notes?: string) =>
    request<{ approval: any; demo: boolean }>(`/approvals/${id}/decide`, {
      method: 'POST',
      body: JSON.stringify({ decision, notes }),
    }),
};

// Audit
export const auditApi = {
  list: (params?: { actorId?: string; action?: string; resourceType?: string; caseId?: string; startDate?: string; endDate?: string; limit?: string; offset?: string }) =>
    request<{ logs: any[]; pagination: any; demo: boolean }>('/audit', { params }),

  get: (id: string) =>
    request<{ log: any; demo: boolean }>(`/audit/${id}`),

  stats: (params?: { caseId?: string; days?: string }) =>
    request<{ stats: any; demo: boolean }>('/audit/stats', { params }),

  export: (params?: { caseId?: string; startDate?: string; endDate?: string }) => {
    const token = getToken();
    const url = new URL(`${API_BASE}/audit/export`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }
    return fetch(url.toString(), {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });
  },
};

// RAG (Conflict-aware Ask)
export const ragApi = {
  ask: (caseId: string, question: string, useCache = true) =>
    request<{ answer: any; cached: boolean; chunksRetrieved: number; conflictsDetected: number; demo: boolean }>(`/rag/cases/${caseId}/ask`, {
      method: 'POST',
      body: JSON.stringify({ question, useCache }),
    }),

  getCache: (caseId: string) =>
    request<{ cache: any[]; demo: boolean }>(`/rag/cases/${caseId}/cache`),

  clearCache: (caseId: string) =>
    request<{ success: boolean; message: string; demo: boolean }>(`/rag/cases/${caseId}/cache`, {
      method: 'DELETE',
    }),

  usage: () =>
    request<{ usage: any; demo: boolean }>('/rag/usage'),
};

// System
export const systemApi = {
  health: () =>
    request<{ status: string; timestamp: string; service: string; version: string; demo: boolean }>('/system/health'),

  llmUsage: () =>
    request<{ usage: any; demo: boolean }>('/system/llm-usage'),

  stats: () =>
    request<{ stats: any; demo: boolean }>('/system/stats'),

  seed: () =>
    request<{ success: boolean; message: string; demo: boolean }>('/system/seed', {
      method: 'POST',
    }),

  integrityCheck: (caseId: string) =>
    request<{ caseId: string; totalDocuments: number; verified: number; mismatched: number; results: any[]; demo: boolean }>(`/system/integrity-check/${caseId}`),
};

// Types
export type Role =
  | 'investigating_officer'
  | 'records_section'
  | 'forensic_analyst'
  | 'prosecutor'
  | 'judge'
  | 'system_admin';

export interface RoleMeta {
  id: Role;
  label: string;
  short: string;
  access: string;
}

export const ROLES: RoleMeta[] = [
  { id: 'investigating_officer', label: 'Investigating Officer', short: 'IO', access: 'Assigned case files and permitted documents/evidence' },
  { id: 'records_section', label: 'Records / Administrative Section', short: 'REC', access: 'Intake, indexing and metadata correction for assigned cases' },
  { id: 'forensic_analyst', label: 'Forensic Analyst', short: 'FSL', access: 'Evidence assigned for examination + relevant case context' },
  { id: 'prosecutor', label: 'Prosecutor / Legal Cell', short: 'PP', access: 'Approved prosecution material, charge sheets, authorized filings' },
  { id: 'judge', label: 'Judge / Court Officer', short: 'CRT', access: 'Records formally shared through an authorized court workflow' },
  { id: 'system_admin', label: 'System Administrator', short: 'SYS', access: 'Technical administration only — document content stays restricted' },
];

export const roleMeta = (r: Role) => ROLES.find((x) => x.id === r)!;

export const DEMO_CREDENTIALS: Record<Role, { serviceBarId: string; passphrase: string }> = {
  investigating_officer: { serviceBarId: 'IO-CB-2026-001', passphrase: 'demo123' },
  records_section: { serviceBarId: 'REC-RS-2026-001', passphrase: 'demo123' },
  forensic_analyst: { serviceBarId: 'FSL-RFSL-2026-001', passphrase: 'demo123' },
  prosecutor: { serviceBarId: 'PP-LC-2026-001', passphrase: 'demo123' },
  judge: { serviceBarId: 'CRT-DC-2026-001', passphrase: 'demo123' },
  system_admin: { serviceBarId: 'SYS-IT-2026-001', passphrase: 'demo123' },
};