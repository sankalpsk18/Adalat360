/**
 * Thin service layer. Every screen reads through these functions so a real
 * backend (Node/FastAPI + Postgres + encrypted vault) can replace the bodies
 * without touching components.
 */
import {
  APPROVALS,
  AUDIT,
  CASES,
  CONFLICTS,
  CUSTODY,
  DOCUMENTS,
  EXHIBITS,
  USERS,
} from "./seed";
import type { CaseRecord, DocRecord, Role } from "./types";

export * from "./types";
export { ROLES, roleMeta, DEMO_IDENTITY, CONFLICTS } from "./seed";

export function listCases(role: Role): CaseRecord[] {
  if (role === "system_admin") return [];
  return CASES.filter((c) => c.visibleTo.includes(role));
}

export function getCase(id: string): CaseRecord | undefined {
  return CASES.find((c) => c.id === id);
}

export function listDocuments(caseId?: string, role?: Role): DocRecord[] {
  let docs = DOCUMENTS;
  if (caseId) docs = docs.filter((d) => d.caseId === caseId);
  if (role === "system_admin") return [];
  if (role === "judge") docs = docs.filter((d) => !d.restricted);
  if (role === "forensic_analyst")
    docs = docs.filter((d) => d.type === "forensic_report" || d.type === "device_extract" || d.type === "photo");
  return docs;
}

export function getDocument(id: string): DocRecord | undefined {
  return DOCUMENTS.find((d) => d.id === id);
}

export function listCustody(filter?: { caseId?: string; targetId?: string }) {
  return CUSTODY.filter(
    (e) =>
      (!filter?.caseId || e.caseId === filter.caseId) &&
      (!filter?.targetId || e.targetId === filter.targetId),
  ).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function listExhibits(caseId?: string) {
  return EXHIBITS.filter((e) => !caseId || e.caseId === caseId);
}

export function getExhibit(id: string) {
  return EXHIBITS.find((e) => e.id === id);
}

export function listApprovals() {
  return APPROVALS;
}

export function listAudit() {
  return [...AUDIT].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function listUsers() {
  return USERS;
}

export function listConflicts() {
  return CONFLICTS;
}

/** Deterministic pseudo SHA-256 for the demo upload flow (no real crypto claim). */
export function mockSha256(input: string): string {
  let out = "";
  let seed = 0;
  for (let i = 0; i < input.length; i++) seed = (seed * 31 + input.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 64; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    out += "0123456789abcdef"[(seed >>> ((i % 6) * 4)) & 15];
  }
  return out;
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
