export * from "./client";
export * from "../queries";

export const signInUser = (token: string) => setToken(token);
export const signOutUser = () => clearToken();

export type IntegrityState = "verified" | "pending" | "mismatch";
export type ConflictType =
  "temporal" | "location" | "identity" | "witness" | "superseded" | "forensic" | "scope";

export interface CustodyEvent {
  id: string;
  action: string;
  actor: string;
  actorRole: Role;
  timestamp: string;
  note?: string;
  hash: string;
  prevHash: string | null;
  targetId: string;
  caseId: string;
  broken?: boolean;
}

export function fmtDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}
