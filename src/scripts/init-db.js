/**
 * Initialize SQLite database with schema
 * Run with: node src/scripts/init-db.js
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'dev.db');

// Remove existing database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}
if (fs.existsSync(dbPath + '-journal')) {
  fs.unlinkSync(dbPath + '-journal');
}
if (fs.existsSync(dbPath + '-wal')) {
  fs.unlinkSync(dbPath + '-wal');
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

console.log('📦 Initializing ADALAT360 database...');

// Define schema as individual statements
const statements = [
  // Users table
  `CREATE TABLE users (
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
  )`,

  // Cases table
  `CREATE TABLE cases (
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
  )`,

  // Documents table
  `CREATE TABLE documents (
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
  )`,

  // Custody Entries table
  `CREATE TABLE custody_entries (
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
  )`,

  // Audit Logs table
  `CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    actorId TEXT NOT NULL,
    action TEXT NOT NULL,
    resourceType TEXT NOT NULL,
    resourceId TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip TEXT,
    metadata TEXT,
    caseId TEXT,
    FOREIGN KEY (actorId) REFERENCES users(id),
    FOREIGN KEY (caseId) REFERENCES cases(id)
  )`,

  // Exhibit Entries table
  `CREATE TABLE exhibit_entries (
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
  )`,

  // Redactions table
  `CREATE TABLE redactions (
    id TEXT PRIMARY KEY,
    documentId TEXT NOT NULL,
    regionsJson TEXT NOT NULL,
    redactedBy TEXT NOT NULL,
    reason TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (redactedBy) REFERENCES users(id)
  )`,

  // Certificates table
  `CREATE TABLE certificates (
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
  )`,

  // Signatures table
  `CREATE TABLE signatures (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    targetType TEXT NOT NULL CHECK (targetType IN ('DOCUMENT','CERTIFICATE')),
    targetId TEXT NOT NULL,
    signatureValue TEXT NOT NULL,
    publicKeyRef TEXT NOT NULL,
    signedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (targetId) REFERENCES documents(id)
  )`,

  // Conflict Alerts table
  `CREATE TABLE conflict_alerts (
    id TEXT PRIMARY KEY,
    caseId TEXT NOT NULL,
    documentIds TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
    resolved BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolvedAt DATETIME,
    resolvedBy TEXT,
    FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE
  )`,

  // Approval Requests table
  `CREATE TABLE approval_requests (
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
  )`,

  // RAG Chunks table
  `CREATE TABLE rag_chunks (
    id TEXT PRIMARY KEY,
    documentId TEXT NOT NULL,
    chunkIndex INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
  )`,

  // RAG Query Cache table
  `CREATE TABLE rag_query_cache (
    id TEXT PRIMARY KEY,
    caseId TEXT NOT NULL,
    questionNormalized TEXT UNIQUE NOT NULL,
    answerJson TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    userId TEXT NOT NULL,
    FOREIGN KEY (caseId) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`,

  // Indexes
  'CREATE INDEX idx_users_service_bar_id ON users(serviceBarId)',
  'CREATE INDEX idx_users_role ON users(role)',
  'CREATE INDEX idx_users_department ON users(department)',
  'CREATE INDEX idx_cases_case_number ON cases(caseNumber)',
  'CREATE INDEX idx_cases_department ON cases(department)',
  'CREATE INDEX idx_cases_status ON cases(status)',
  'CREATE INDEX idx_cases_last_activity ON cases(lastActivityAt)',
  'CREATE INDEX idx_documents_case_id ON documents(caseId)',
  'CREATE INDEX idx_documents_sha256_hash ON documents(sha256Hash)',
  'CREATE INDEX idx_documents_uploaded_by ON documents(uploadedBy)',
  'CREATE INDEX idx_documents_parent_version ON documents(parentVersionId)',
  'CREATE INDEX idx_custody_document_id ON custody_entries(documentId)',
  'CREATE INDEX idx_custody_actor_id ON custody_entries(actorId)',
  'CREATE INDEX idx_custody_case_id ON custody_entries(caseId)',
  'CREATE INDEX idx_custody_timestamp ON custody_entries(timestamp)',
  'CREATE INDEX idx_audit_actor_id ON audit_logs(actorId)',
  'CREATE INDEX idx_audit_resource ON audit_logs(resourceType, resourceId)',
  'CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp)',
  'CREATE INDEX idx_audit_case_id ON audit_logs(caseId)',
  'CREATE INDEX idx_exhibits_case_id ON exhibit_entries(caseId)',
  'CREATE INDEX idx_exhibits_exhibit_code ON exhibit_entries(exhibitCode)',
  'CREATE INDEX idx_redactions_document_id ON redactions(documentId)',
  'CREATE INDEX idx_certificates_document_id ON certificates(documentId)',
  'CREATE INDEX idx_certificates_case_id ON certificates(caseId)',
  'CREATE UNIQUE INDEX idx_signatures_unique ON signatures(userId, targetType, targetId)',
  'CREATE INDEX idx_signatures_target ON signatures(targetType, targetId)',
  'CREATE INDEX idx_conflicts_case_id ON conflict_alerts(caseId)',
  'CREATE INDEX idx_conflicts_resolved ON conflict_alerts(resolved)',
  'CREATE INDEX idx_approvals_resource ON approval_requests(resourceType, resourceId)',
  'CREATE INDEX idx_approvals_approver ON approval_requests(approverRole, status)',
  'CREATE UNIQUE INDEX idx_rag_chunks_doc_chunk ON rag_chunks(documentId, chunkIndex)',
  'CREATE INDEX idx_rag_chunks_document_id ON rag_chunks(documentId)',
  'CREATE INDEX idx_rag_cache_case_id ON rag_query_cache(caseId)',
  'CREATE INDEX idx_rag_cache_expires ON rag_query_cache(expiresAt)',

  // Triggers
  `CREATE TRIGGER update_users_timestamp
   AFTER UPDATE ON users
   BEGIN
     UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
   END`,

  `CREATE TRIGGER update_cases_timestamp
   AFTER UPDATE ON cases
   BEGIN
     UPDATE cases SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
   END`,

  `CREATE TRIGGER update_exhibits_timestamp
   AFTER UPDATE ON exhibit_entries
   BEGIN
     UPDATE exhibit_entries SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
   END`,
];

for (const stmt of statements) {
  try {
    db.exec(stmt);
  } catch (err) {
    console.error('Error executing statement:', err.message);
    console.error('Statement:', stmt.slice(0, 100));
    process.exit(1);
  }
}

console.log('✅ Database schema created');

// Verify tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
console.log('\n📋 Created tables:');
tables.forEach(t => console.log(`   - ${t.name}`));

db.close();
console.log('\n✅ Database initialization complete!');