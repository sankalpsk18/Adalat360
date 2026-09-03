/**
 * Real API Client for ADALAT360 Frontend
 * Connects to the Express backend at /api
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...fetchOptions } = options;

  // Build URL with query params
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  // Get auth token from cookie or localStorage
  const token = getAuthToken();

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    credentials: 'include', // Include cookies for JWT
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function getAuthToken(): string | null {
  // Try to get from localStorage (set after login)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adalat360_token');
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adalat360_token', token);
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adalat360_token');
  }
}

// Auth API
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

// Cases API
export const casesApi = {
  list: (params?: { status?: string; department?: string; limit?: string; offset?: string }) =>
    request<{ cases: any[]; pagination: any; demo: boolean }>('/cases', { params }),

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

// Documents API
export const documentsApi = {
  upload: (file: File, caseId: string, title?: string, docType?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    if (title) formData.append('title', title);
    if (docType) formData.append('docType', docType);

    const token = getAuthToken();
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
    const token = getAuthToken();
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

// Custody API
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

// Exhibits API
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

// Signatures API
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

// Certificates API
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

// Redactions API
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

// Approvals API
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

// Audit API
export const auditApi = {
  list: (params?: { actorId?: string; action?: string; resourceType?: string; caseId?: string; startDate?: string; endDate?: string; limit?: string; offset?: string }) =>
    request<{ logs: any[]; pagination: any; demo: boolean }>('/audit', { params }),

  get: (id: string) =>
    request<{ log: any; demo: boolean }>(`/audit/${id}`),

  stats: (params?: { caseId?: string; days?: string }) =>
    request<{ stats: any; demo: boolean }>('/audit/stats', { params }),

  export: (params?: { caseId?: string; startDate?: string; endDate?: string }) => {
    const token = getAuthToken();
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

// RAG API (Conflict-aware Ask)
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

// System API
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

// Re-export types from types.ts for backward compatibility
export * from './types';