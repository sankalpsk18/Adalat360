//#region node_modules/.nitro/vite/services/ssr/assets/client-CFyrzEWy.js
var API_BASE = "http://localhost:3001/api";
function getToken() {
	if (typeof window !== "undefined") return localStorage.getItem("adalat360_token");
	return null;
}
function setToken(token) {
	if (typeof window !== "undefined") localStorage.setItem("adalat360_token", token);
}
function clearToken() {
	if (typeof window !== "undefined") localStorage.removeItem("adalat360_token");
}
async function request(endpoint, options = {}) {
	const token = getToken();
	const headers = {
		"Content-Type": "application/json",
		...token && { Authorization: `Bearer ${token}` },
		...options.headers
	};
	console.log("[API] Request:", endpoint, options.body);
	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers,
		credentials: "include"
	});
	console.log("[API] Response:", response.status, response.statusText);
	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: "Request failed" }));
		console.error("[API] Error:", error);
		throw new Error(error.error || `HTTP ${response.status}`);
	}
	if (response.status === 204) return;
	return response.json();
}
var authApi = {
	login: (serviceBarId, passphrase, role) => request("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			serviceBarId,
			passphrase,
			role
		})
	}),
	me: () => request("/auth/me"),
	logout: () => request("/auth/logout", { method: "POST" }),
	register: (data) => request("/auth/register", {
		method: "POST",
		body: JSON.stringify(data)
	})
};
var casesApi = {
	list: (params) => request("/cases", { params }),
	get: (id) => request(`/cases/${id}`),
	create: (data) => request("/cases", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	update: (id, data) => request(`/cases/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data)
	}),
	priorityBreakdown: (id) => request(`/cases/${id}/priority-breakdown`),
	stats: (id) => request(`/cases/${id}/stats`)
};
var documentsApi = {
	upload: (file, caseId, title, docType) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("caseId", caseId);
		if (title) formData.append("title", title);
		if (docType) formData.append("docType", docType);
		const token = getToken();
		return fetch(`${API_BASE}/documents`, {
			method: "POST",
			body: formData,
			headers: { ...token && { Authorization: `Bearer ${token}` } },
			credentials: "include"
		}).then(async (res) => {
			if (!res.ok) {
				const error = await res.json().catch(() => ({ error: "Upload failed" }));
				throw new Error(error.error || `HTTP ${res.status}`);
			}
			return res.json();
		});
	},
	get: (id) => request(`/documents/${id}`),
	versions: (id) => request(`/documents/${id}/versions`),
	download: (id) => {
		const token = getToken();
		return fetch(`${API_BASE}/documents/${id}/download`, {
			headers: { ...token && { Authorization: `Bearer ${token}` } },
			credentials: "include"
		});
	},
	view: (id) => request(`/documents/${id}/view`),
	update: (id, data) => request(`/documents/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data)
	}),
	lock: (id) => request(`/documents/${id}`, { method: "DELETE" })
};
var custodyApi = {
	get: (documentId) => request(`/custody/${documentId}`),
	verify: (documentId) => request(`/custody/${documentId}/verify`),
	caseEntries: (caseId, params) => request(`/custody/case/${caseId}`, { params }),
	verifyAll: (caseId) => request(`/custody/verify-all/${caseId}`)
};
var exhibitsApi = {
	list: (params) => request("/exhibits", { params }),
	get: (id) => request(`/exhibits/${id}`),
	create: (data) => request("/exhibits", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	update: (id, data) => request(`/exhibits/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data)
	})
};
var certificatesApi = {
	generate: (documentId) => request(`/certificates/document/${documentId}`, { method: "POST" }),
	get: (id) => request(`/certificates/${id}`),
	listForDocument: (documentId) => request(`/certificates/document/${documentId}`),
	regenerate: (id) => request(`/certificates/${id}/regenerate`, { method: "POST" })
};
var approvalsApi = {
	list: (params) => request("/approvals", { params }),
	get: (id) => request(`/approvals/${id}`),
	create: (data) => request("/approvals", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	decide: (id, decision, notes) => request(`/approvals/${id}/decide`, {
		method: "POST",
		body: JSON.stringify({
			decision,
			notes
		})
	})
};
var auditApi = {
	list: (params) => request("/audit", { params }),
	get: (id) => request(`/audit/${id}`),
	stats: (params) => request("/audit/stats", { params }),
	export: (params) => {
		const token = getToken();
		const url = new URL(`${API_BASE}/audit/export`);
		if (params) Object.entries(params).forEach(([key, value]) => {
			if (value) url.searchParams.append(key, value);
		});
		return fetch(url.toString(), {
			headers: { ...token && { Authorization: `Bearer ${token}` } },
			credentials: "include"
		});
	}
};
var ragApi = {
	ask: (caseId, question, useCache = true) => request(`/rag/cases/${caseId}/ask`, {
		method: "POST",
		body: JSON.stringify({
			question,
			useCache
		})
	}),
	getCache: (caseId) => request(`/rag/cases/${caseId}/cache`),
	clearCache: (caseId) => request(`/rag/cases/${caseId}/cache`, { method: "DELETE" }),
	usage: () => request("/rag/usage")
};
var systemApi = {
	health: () => request("/system/health"),
	llmUsage: () => request("/system/llm-usage"),
	stats: () => request("/system/stats"),
	seed: () => request("/system/seed", { method: "POST" }),
	integrityCheck: (caseId) => request(`/system/integrity-check/${caseId}`)
};
var ROLES = [
	{
		id: "investigating_officer",
		label: "Investigating Officer",
		short: "IO",
		access: "Assigned case files and permitted documents/evidence"
	},
	{
		id: "records_section",
		label: "Records / Administrative Section",
		short: "REC",
		access: "Intake, indexing and metadata correction for assigned cases"
	},
	{
		id: "forensic_analyst",
		label: "Forensic Analyst",
		short: "FSL",
		access: "Evidence assigned for examination + relevant case context"
	},
	{
		id: "prosecutor",
		label: "Prosecutor / Legal Cell",
		short: "PP",
		access: "Approved prosecution material, charge sheets, authorized filings"
	},
	{
		id: "judge",
		label: "Judge / Court Officer",
		short: "CRT",
		access: "Records formally shared through an authorized court workflow"
	},
	{
		id: "system_admin",
		label: "System Administrator",
		short: "SYS",
		access: "Technical administration only — document content stays restricted"
	}
];
var roleMeta = (r) => ROLES.find((x) => x.id === r);
//#endregion
export { casesApi as a, custodyApi as c, ragApi as d, roleMeta as f, authApi as i, documentsApi as l, systemApi as m, approvalsApi as n, certificatesApi as o, setToken as p, auditApi as r, clearToken as s, ROLES as t, exhibitsApi as u };
