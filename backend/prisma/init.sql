-- ADALAT360 Database Initialization (SQLite)
-- Run with: sqlite3 dev.db < prisma/init.sql

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    serviceBarId TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('IO','PP','REC','CRT','FSL','SYS')),
    department TEXT NOT NULL,
    publicKey TEXT,
    privateKeyEnc TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_service_bar_id ON users(serviceBarId);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    caseNumber TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','UNDER_INVESTIGATION','CHARGESHEET_FILED','IN_COURT','CLOSED')),
    department TEXT NOT NULL,
    priorityScore INTEGER NOT NULL DEFAULT 0,
    priorityLabel TEXT NOT NULL DEFAULT 'LOW' CHECK (priorityLabel IN ('LOW','MEDIUM','HIGH')),
    courtDate DATETIME,
    lastActivityAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(caseNumber);
CREATE INDEX IF NOT EXISTS idx_cases_department ON cases(department);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_last_activity ON cases(lastActivityAt);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    caseId TEXT NOT NULL,
    filename TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    parentVersionId TEXT,
    sha256Hash TEXT UNIQUE NOT NULL,
    encBlobRef TEXT NOT NULL,
    encIv TEXT NOT NULL,
    encTag TEXT NOT NULL,
    uploadedBy TEXT NOT NULL,
    uploadedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    locked BOOLEAN NOT NULL DEFAULT 0,
    docType TEXT NOT NULL CHECK (docType IN ('FIR','CHARGE_SHEET','WITNESS_STATEMENT','COURT_FILING','JUDGMENT','LEGAL_NOTICE','PHOTO','VIDEO','AUDIO','FORENSIC_REPORT','DEVICE_EXTRACT')),
    integrity TEXT NOT NULL DEFAULT 'PENDING' CHECK (integrity IN ('VERIFIED','PENDING','MISMATCH')),
    restricted BOOLEAN NOT NULL DEFAULT 0,
    redactedCopy BOOLEAN NOT NULL DEFAULT 0,
    signed BOOLEAN NOT NULL DEFAULT 0,
    signedBy TEXT,
    ocrText TEXT,
    department TEXT NOT NULL,
    FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (parentVersionId) REFERENCES documents(id),
    FOREIGN KEY (uploadedBy) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_documents_case_id ON documents(caseId);
CREATE INDEX IF NOT EXISTS idx_documents_sha256_hash ON documents(sha256Hash);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploadedBy);
CREATE INDEX IF NOT EXISTS idx_documents_parent_version ON documents(parentVersionId);

-- Custody Entries table
CREATE TABLE IF NOT EXISTS custody_entries (
    id TEXT PRIMARY KEY,
    documentId TEXT NOT NULL,
    actorId TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('UPLOAD','VIEW','EXPORT','VERIFY','REDACT','TRANSFER','SIGN','DOWNLOAD')),
    prevEntryHash TEXT,
    entryHash TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    caseId TEXT NOT NULL,
    broken BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (actorId) REFERENCES users(id),
    FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_custody_document_id ON custody_entries(documentId);
CREATE INDEX IF NOT EXISTS idx_custody_actor_id ON custody_entries(actorId);
CREATE INDEX IF NOT EXISTS idx_custody_case_id ON custody_entries(caseId);
CREATE INDEX IF NOT EXISTS idx_custody_timestamp ON custody_entries(timestamp);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actorId TEXT NOT NULL,
    action TEXT NOT NULL,
    resourceType TEXT NOT NULL,
    resourceId TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip TEXT,
    metadata TEXT, -- JSON string
    caseId TEXT,
    FOREIGN KEY (actorId) REFERENCES users(id),
    FOREIGN KEY (caseId) REFERENCES cases(id)
);

CREATE INDEX IF NOT EXISTS idx_audit_actor_id ON audit_logs(actorId);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resourceType, resourceId);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_case_id ON audit_logs(caseId);

-- Exhibit Entries table
CREATE TABLE IF NOT EXISTS exhibit_entries (
    id TEXT PRIMARY KEY,
    caseId TEXT NOT NULL,
    documentId TEXT,
    exhibitCode TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('WEAPON','VEHICLE','CASH','DEVICE','DOCUMENT','BIOLOGICAL')),
    status TEXT NOT NULL CHECK (status IN ('IN_MALKHANA','WITH_FSL','IN_COURT','IN_TRANSIT','RELEASED')),
    location TEXT NOT NULL,
    holder TEXT NOT NULL,
    sealHash TEXT NOT NULL,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (documentId) REFERENCES documents(id)
);

CREATE INDEX IF NOT EXISTS idx_exhibits_case_id ON exhibit_entries(caseId);
CREATE INDEX IF NOT EXISTS idx_exhibits_exhibit_code ON exhibit_entries(exhibitCode);

-- Redactions table
CREATE TABLE IF NOT EXISTS redactions (
    id TEXT PRIMARY KEY,
    documentId TEXT NOT NULL,
    regionsJson TEXT NOT NULL,
    redactedBy TEXT NOT NULL,
    reason TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (redactedBy) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_redactions_document_id ON redactions(documentId);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    documentId TEXT NOT NULL,
    caseId TEXT NOT NULL,
    generatedBy TEXT NOT NULL,
    certText TEXT NOT NULL,
    hashSummary TEXT NOT NULL,
    issuedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (generatedBy) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_certificates_document_id ON certificates(documentId);
CREATE INDEX IF NOT EXISTS idx_certificates_case_id ON certificates(caseId);

-- Signatures table
CREATE TABLE IF NOT EXISTS signatures (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    targetType TEXT NOT NULL CHECK (targetType IN ('DOCUMENT','CERTIFICATE')),
    targetId TEXT NOT NULL,
    signatureValue TEXT NOT NULL,
    publicKeyRef TEXT NOT NULL,
    signedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (targetId) REFERENCES documents(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_signatures_unique ON signatures(userId, targetType, targetId);
CREATE INDEX IF NOT EXISTS idx_signatures_target ON signatures(targetType, targetId);

-- Conflict Alerts table
CREATE TABLE IF NOT EXISTS conflict_alerts (
    id TEXT PRIMARY KEY,
    caseId TEXT NOT NULL,
    documentIds TEXT NOT NULL, -- JSON array
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
    resolved BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolvedAt DATETIME,
    resolvedBy TEXT,
    FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conflicts_case_id ON conflict_alerts(caseId);
CREATE INDEX IF NOT EXISTS idx_conflicts_resolved ON conflict_alerts(resolved);

-- Approval Requests table
CREATE TABLE IF NOT EXISTS approval_requests (
    id TEXT PRIMARY KEY,
    resourceType TEXT NOT NULL CHECK (resourceType IN ('DOCUMENT','CERTIFICATE','CASE','EXHIBIT')),
    resourceId TEXT NOT NULL,
    requestedBy TEXT NOT NULL,
    approverRole TEXT NOT NULL CHECK (approverRole IN ('IO','PP','REC','CRT','FSL','SYS')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    decidedAt DATETIME,
    decidedBy TEXT,
    caseId TEXT,
    FOREIGN KEY (requestedBy) REFERENCES users(id),
    FOREIGN KEY (decidedBy) REFERENCES users(id),
    FOREIGN KEY (caseId) REFERENCES cases(id),
    FOREIGN KEY (resourceId) REFERENCES documents(id)
);

CREATE INDEX IF NOT EXISTS idx_approvals_resource ON approval_requests(resourceType, resourceId);
CREATE INDEX IF NOT EXISTS idx_approvals_approver ON approval_requests(approverRole, status);

-- RAG Chunks table
CREATE TABLE IF NOT EXISTS rag_chunks (
    id TEXT PRIMARY KEY,
    documentId TEXT NOT NULL,
    chunkIndex INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding TEXT NOT NULL, -- JSON string of float array
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rag_chunks_doc_chunk ON rag_chunks(documentId, chunkIndex);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_document_id ON rag_chunks(documentId);

-- RAG Query Cache table
CREATE TABLE IF NOT EXISTS rag_query_cache (
    id TEXT PRIMARY KEY,
    caseId TEXT NOT NULL,
    questionNormalized TEXT UNIQUE NOT NULL,
    answerJson TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    userId TEXT NOT NULL,
    FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_rag_cache_case_id ON rag_query_cache(caseId);
CREATE INDEX IF NOT EXISTS idx_rag_cache_expires ON rag_query_cache(expiresAt);

-- Trigger to update updatedAt timestamps
CREATE TRIGGER IF NOT EXISTS update_users_timestamp
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_cases_timestamp
AFTER UPDATE ON cases
BEGIN
    UPDATE cases SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_exhibits_timestamp
AFTER UPDATE ON exhibit_entries
BEGIN
    UPDATE exhibit_entries SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;