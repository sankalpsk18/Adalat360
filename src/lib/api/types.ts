export type Role =
  | "investigating_officer"
  | "records_section"
  | "forensic_analyst"
  | "prosecutor"
  | "judge"
  | "system_admin";

export interface RoleMeta {
  id: Role;
  label: string;
  short: string;
  access: string;
}

export type IntegrityState = "verified" | "pending" | "mismatch";

export type DocType =
  | "fir"
  | "charge_sheet"
  | "witness_statement"
  | "court_filing"
  | "judgment"
  | "legal_notice"
  | "photo"
  | "video"
  | "audio"
  | "forensic_report"
  | "device_extract";

export interface CustodyEvent {
  id: string;
  action: "upload" | "view" | "transfer" | "download" | "verify" | "export" | "sign" | "redact";
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

export interface DocVersion {
  version: number;
  author: string;
  authorRole: Role;
  timestamp: string;
  summary: string;
  hash: string;
  body: string;
}

export interface DocRecord {
  id: string;
  caseId: string;
  title: string;
  type: DocType;
  hash: string;
  integrity: IntegrityState;
  restricted: boolean;
  redactedCopy: boolean;
  signed: boolean;
  signedBy?: string;
  ocr: string;
  versions: DocVersion[];
  updatedAt: string;
  department: string;
}

export interface CaseRecord {
  id: string;
  title: string;
  status: "open" | "under_investigation" | "chargesheet_filed" | "in_court" | "closed";
  priority: "low" | "medium" | "high";
  department: string;
  officers: { name: string; role: Role }[];
  openedAt: string;
  lastActivity: string;
  visibleTo: Role[];
}

export type ConflictType =
  | "temporal"
  | "location"
  | "identity"
  | "witness"
  | "superseded"
  | "forensic"
  | "scope";

export interface Conflict {
  id: string;
  type: ConflictType;
  summary: string;
  sources: { docId: string; label: string; quote: string }[];
}

export interface Exhibit {
  id: string;
  caseId: string;
  label: string;
  category: "weapon" | "vehicle" | "cash" | "device" | "document" | "biological";
  custodyStatus: "in_malkhana" | "with_fsl" | "in_court" | "in_transit" | "released";
  holder: string;
  sealHash: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  kind: "signature" | "certificate" | "case_update" | "integrity_alert";
  title: string;
  caseId: string;
  requestedBy: string;
  requestedAt: string;
  severity: "info" | "action" | "critical";
  status: "pending" | "done";
}

export interface AuditEntry {
  id: string;
  actor: string;
  actorRole: Role;
  action: string;
  target: string;
  caseId: string;
  timestamp: string;
  ip: string;
}

export interface AppUser {
  id: string;
  name: string;
  role: Role;
  department: string;
  status: "active" | "suspended";
}
