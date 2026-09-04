import { a as casesApi, c as custodyApi, l as documentsApi, m as systemApi, n as approvalsApi, r as auditApi, u as exhibitsApi } from "./client-CFyrzEWy.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-ci5_guFA.js
function useCases(role) {
	return useQuery({
		queryKey: ["cases", role],
		queryFn: async () => (await casesApi.list()).cases,
		enabled: !!role,
		staleTime: 3e4
	});
}
function useCase(id) {
	return useQuery({
		queryKey: ["case", id],
		queryFn: () => casesApi.get(id),
		enabled: !!id,
		staleTime: 3e4
	});
}
function useDocuments(caseId) {
	return useQuery({
		queryKey: ["documents", caseId],
		queryFn: async () => {
			if (!caseId) return [];
			return (await casesApi.get(caseId)).case.documents || [];
		},
		enabled: !!caseId,
		staleTime: 3e4
	});
}
function useDocument(id) {
	return useQuery({
		queryKey: ["document", id],
		queryFn: () => documentsApi.get(id),
		enabled: !!id,
		staleTime: 3e4
	});
}
function useDocumentVersions(id) {
	return useQuery({
		queryKey: [
			"document",
			id,
			"versions"
		],
		queryFn: () => documentsApi.versions(id),
		enabled: !!id,
		staleTime: 3e4
	});
}
function useCustody(documentId) {
	return useQuery({
		queryKey: ["custody", documentId],
		queryFn: async () => {
			const response = await custodyApi.get(documentId);
			return Array.isArray(response) ? response : response.entries || [];
		},
		enabled: !!documentId,
		staleTime: 3e4
	});
}
function useCaseCustody(caseId) {
	return useQuery({
		queryKey: [
			"custody",
			"case",
			caseId
		],
		queryFn: async () => (await custodyApi.caseEntries(caseId)).entries.map((entry) => ({
			...entry,
			actor: entry.actor?.name || entry.actorId,
			actorRole: {
				IO: "investigating_officer",
				REC: "records_section",
				FSL: "forensic_analyst",
				PP: "prosecutor",
				CRT: "judge",
				SYS: "system_admin"
			}[entry.actor?.role] || "investigating_officer",
			hash: entry.entryHash,
			prevHash: entry.prevEntryHash,
			note: entry.notes
		})),
		enabled: !!caseId,
		staleTime: 3e4
	});
}
function useExhibits(caseId) {
	return useQuery({
		queryKey: ["exhibits", caseId],
		queryFn: async () => (await exhibitsApi.list({ caseId })).exhibits,
		enabled: !!caseId,
		staleTime: 3e4
	});
}
function useApprovals() {
	return useQuery({
		queryKey: ["approvals"],
		queryFn: async () => (await approvalsApi.list({ status: "PENDING" })).approvals,
		staleTime: 3e4
	});
}
function useAudit(params) {
	return useQuery({
		queryKey: ["audit", params],
		queryFn: async () => (await auditApi.list(params)).logs,
		staleTime: 3e4
	});
}
function useSystemHealth() {
	return useQuery({
		queryKey: ["system", "health"],
		queryFn: () => systemApi.health(),
		staleTime: 6e4
	});
}
function useSystemStats() {
	return useQuery({
		queryKey: ["system", "stats"],
		queryFn: () => systemApi.stats(),
		staleTime: 6e4
	});
}
//#endregion
export { useCases as a, useDocumentVersions as c, useSystemHealth as d, useSystemStats as f, useCaseCustody as i, useDocuments as l, useAudit as n, useCustody as o, useCase as r, useDocument as s, useApprovals as t, useExhibits as u };
