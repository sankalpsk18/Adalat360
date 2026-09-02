# ADALAT360 Backend

> Tamper-evident custody for legal and investigation records — Backend API for SIH 2026 Prototype

## Overview

This is the backend service for **ADALAT360**, a prototype system for tamper-evident custody of legal and investigation records. It provides a complete REST API that powers the frontend dashboard with:

- **Officer Authentication** — Service/Bar ID + passphrase + role selector
- **Document Intake** — SHA-256 hashing, AES-256-GCM encryption, versioning (immutable)
- **Custody Ledger** — Hash-chained audit trail per document
- **RBAC** — Role-based access control (IO, PP, REC, CRT, FSL, SYS)
- **Digital Signatures** — ECDSA signing of document hashes
- **BSA §63 Certificates** — Deterministic electronic evidence certificates
- **Conflict-aware RAG** — Only LLM feature (Nemotron 3 Ultra via OpenRouter, rate-limited)
- **Exhibit Register** — Physical evidence tracking
- **Redaction** — Document redaction with versioning
- **Audit & Compliance** — Complete audit trail

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js + Express |
| Database | PostgreSQL (via Prisma) / SQLite for demo |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Encryption | AES-256-GCM (files), ECDSA secp256k1 (signatures) |
| LLM | NVIDIA Nemotron 3 Ultra via OpenRouter |
| Embeddings | Local/free model (deterministic for demo) |
| File Storage | Local disk (encrypted) |
| Rate Limiting | Bottleneck (token bucket) |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
cd adalat360-backend
npm install
```

### Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (SQLite for demo, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# JWT Secret (min 32 chars)
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"

# Master Encryption Key (32 bytes after SHA-256)
MASTER_ENCRYPTION_KEY="your-32-byte-master-encryption-key-here-32c"

# OpenRouter (for Nemotron 3 Ultra - ONLY for RAG)
OPENROUTER_API_KEY="your-openrouter-api-key"
OPENROUTER_MODEL="nvidia/nemotron-3-ultra-550b-a55b"

# Server
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed demo data
npm run seed
```

### Development

```bash
npm run dev
```

Server starts at `http://localhost:3001`

### Production

```bash
npm run build  # (if using TypeScript)
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Officer sign-in |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |

### Cases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | List cases (role-scoped) |
| GET | `/api/cases/:id` | Case details |
| POST | `/api/cases` | Create case (IO, SYS) |
| PATCH | `/api/cases/:id` | Update case (IO, PP, SYS) |
| GET | `/api/cases/:id/priority-breakdown` | Interactive priority scoring |
| GET | `/api/cases/:id/stats` | Case statistics |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents` | Upload document (multipart) |
| GET | `/api/documents/:id` | Document metadata |
| GET | `/api/documents/:id/versions` | Version chain with hashes |
| GET | `/api/documents/:id/download` | Download decrypted file |
| GET | `/api/documents/:id/view` | View document (logs custody) |
| PATCH | `/api/documents/:id` | Update metadata only |
| DELETE | `/api/documents/:id` | Lock document (immutable) |

### Custody Ledger
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/custody/:documentId` | Document custody trail |
| GET | `/api/custody/:documentId/verify` | Verify hash chain |
| GET | `/api/custody/case/:caseId` | All custody entries for case |
| GET | `/api/custody/verify-all/:caseId` | Bulk verify (SYS only) |

### Exhibits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exhibits` | List exhibits |
| GET | `/api/exhibits/:id` | Exhibit details |
| POST | `/api/exhibits` | Register exhibit |
| PATCH | `/api/exhibits/:id` | Update exhibit |

### Approvals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/approvals` | Approval inbox |
| GET | `/api/approvals/:id` | Approval details |
| POST | `/api/approvals` | Create approval request |
| POST | `/api/approvals/:id/decide` | Approve/reject |

### Audit
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/audit` | Audit logs |
| GET | `/api/audit/:id` | Audit entry |
| GET | `/api/audit/stats` | Audit statistics |
| GET | `/api/audit/export` | Export CSV (SYS) |

### Signatures
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signatures/document/:id` | Sign document |
| POST | `/api/signatures/certificate/:id` | Sign certificate |
| GET | `/api/signatures/document/:id` | Document signatures |
| GET | `/api/signatures/certificate/:id` | Certificate signatures |
| POST | `/api/signatures/verify` | Verify signature |

### Certificates (BSA §63)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/certificates/document/:id` | Generate certificate |
| GET | `/api/certificates/:id` | Certificate details |
| GET | `/api/certificates/document/:id` | Document certificates |
| POST | `/api/certificates/:id/regenerate` | Regenerate |

### Redactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/redactions/document/:id` | Apply redaction |
| GET | `/api/redactions/document/:id` | List redactions |
| GET | `/api/redactions/:id` | Redaction details |

### Conflict-aware RAG (Only LLM Feature)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rag/cases/:caseId/ask` | Ask question about case |
| GET | `/api/rag/cases/:caseId/cache` | View query cache |
| DELETE | `/api/rag/cases/:caseId/cache` | Clear cache |
| GET | `/api/rag/usage` | LLM usage stats (SYS) |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/health` | Health check |
| GET | `/api/system/llm-usage` | LLM rate limit monitor |
| GET | `/api/system/stats` | System statistics |
| POST | `/api/system/seed` | Seed demo data (dev) |
| GET | `/api/system/integrity-check/:caseId` | Full integrity verification |

## Demo Data

The seed script creates data matching the frontend screenshots:

### Cases
- `CR-2026-0417` — Hit-and-run near Central Mall junction (HIGH)
- `CR-2026-0388` — Commercial fraud — shell vendor invoices (MEDIUM)
- `CR-2026-0431` — Cyber intrusion — municipal records server (HIGH, hash mismatch)
- `CR-2025-0912` — Property dispute — forged sale deed (LOW)

### Documents
- `DOC-1001` — FIR No. 417/2026
- `DOC-1002` — Witness statement (v1: 9:00 PM, v2: 8:40 PM)
- `DOC-1003` — CCTV analysis report (Railway Station, 20:50)
- `DOC-1004` — Suspect alibi (City Hospital, unverified)
- `DOC-1005` — Fingerprint examination report
- `DOC-1006` — Draft charge sheet (v1, v2, v3)
- `DOC-2001` — Charge sheet EOW/388
- `DOC-3001` — Server disk image (MISMATCH)
- `DOC-4001` — Judgment copy

### Exhibits
- `EX-2026-014` — Dark sedan (WITH_FSL)
- `EX-2026-015` — Mobile handset (IN_MALKHANA)
- `EX-2026-031` — Cash bundle (IN_COURT)
- `EX-2026-044` — Server hard disk (IN_TRANSIT)
- `EX-2025-102` — Disputed sale deed (IN_COURT)

### Demo Login Credentials

All users use passphrase: `demo123`

| Role | Service/Bar ID | Department |
|------|----------------|------------|
| IO (Crime Branch) | `IO-CB-2026-001` | City Police — Crime Branch |
| REC (Records) | `REC-RS-2026-001` | Records Section |
| FSL (Forensics) | `FSL-RFSL-2026-001` | Regional FSL |
| PP (Prosecutor) | `PP-LC-2026-001` | Legal Cell |
| CRT (Court Officer) | `CRT-DC-2026-001` | District Court Registry |
| IO (EOW) | `IO-EOW-2026-001` | Economic Offences Wing |
| SYS (Admin) | `SYS-IT-2026-001` | IT Cell |
| IO (Cyber - suspended) | `IO-CC-2026-001` | Cyber Cell |

## Rate Limiting (Nemotron 3 Ultra)

The OpenRouter account is limited to **50 requests/minute**. The backend implements:

1. **Server-side token bucket** — Capped at ~40 RPM (buffer under 50)
2. **Frontend debounce** — 700-800ms debounce on "Ask" input
3. **Query caching** — Identical questions cached for 30 minutes
4. **Single call per question** — All chunks + conflicts batched into one prompt
5. **Exponential backoff** — 1s → 2s → 4s on 429, max 2 retries
6. **Monitoring endpoint** — `GET /api/system/llm-usage` shows rolling 60s count

**Only `/api/rag/cases/:caseId/ask` calls the LLM.** All other features are deterministic.

## Architecture Highlights

### Immutable Documents
- Files are encrypted with AES-256-GCM before storage
- SHA-256 computed at upload, stored immutably
- New versions create new rows linked via `parentVersionId`
- PUT/PATCH on file content returns 405

### Hash-Chained Custody
```
entry_hash = SHA256(prev_entry_hash + action + actor_id + timestamp)
```
- `GET /api/custody/:documentId/verify` walks chain, reports first broken link
- Produces "Hash mismatch on server disk image" alerts automatically

### BSA §63 Certificates
- Deterministic string template (NO LLM)
- Includes: case metadata, document hash, custody chain summary, signatures
- Certificate hash = SHA-256 of full certificate text

### Priority Scoring (Deterministic)
```
Score = ActivityRecency(0-30) + IntegrityAlerts(0-25) + EvidenceCompleteness(0-25) + CourtDateProximity(0-20)
Labels: HIGH (≥70), MEDIUM (≥40), LOW (<40)
```

## Project Structure

```
adalat360-backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── index.js               # Entry point
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── cases.js
│   │   ├── documents.js
│   │   ├── custody.js
│   │   ├── exhibits.js
│   │   ├── approvals.js
│   │   ├── audit.js
│   │   ├── signatures.js
│   │   ├── certificates.js
│   │   ├── redactions.js
│   │   ├── rag.js
│   │   └── system.js
│   ├── middleware/
│   │   └── rbac.js            # Authentication & authorization
│   ├── services/
│   │   └── embeddings.js      # RAG embeddings (local)
│   ├── utils/
│   │   ├── crypto.js          # Encryption, hashing, signatures
│   │   ├── jwt.js             # JWT auth
│   │   ├── llmLimiter.js      # Rate limiting for LLM
│   │   └── priority.js        # Priority scoring
│   └── scripts/
│       └── seed.js            # Demo data seeding
├── .env.example
├── package.json
└── README.md
```

## Frontend Integration

The frontend (in `../lovable-project-6f8a6a6b-b43f-474b-9dea-d7d7c0358c55-2026-08-30/`) expects these API responses. Update the frontend's API client in `src/lib/api/index.ts` to point to this backend:

```typescript
// In frontend's api client
const API_BASE = 'http://localhost:3001/api';
```

All responses include `"demo": true` flag for the frontend's "DEMO DATA" badge.

## License

MIT — Prototype for SIH 2026