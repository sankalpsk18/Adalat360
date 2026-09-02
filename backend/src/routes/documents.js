/**
 * Document Routes for ADALAT360
 * POST   /api/documents - Upload document (multipart)
 * GET    /api/documents/:id - Get document details
 * GET    /api/documents/:id/versions - Get version chain
 * GET    /api/documents/:id/download - Download decrypted document (RBAC checked)
 * GET    /api/documents/:id/view - View document metadata (RBAC checked)
 * PATCH  /api/documents/:id - Update document metadata (not file content)
 * DELETE /api/documents/:id - Soft delete (lock) document
 */

import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '../index.js';
import { authenticate, requireRole, requireDocumentAccess, requireCaseAccess, auditLog } from '../middleware/rbac.js';
import { encrypt, decrypt, sha256 } from '../utils/crypto.js';
import { indexDocument } from '../services/embeddings.js';
import { updateCasePriority } from '../utils/priority.js';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Store with UUID to avoid conflicts
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800, // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'video/mp4',
      'audio/mpeg',
      'audio/wav',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  },
});

// Validation schemas
const updateDocSchema = z.object({
  title: z.string().optional(),
  docType: z.enum([
    'FIR', 'CHARGE_SHEET', 'WITNESS_STATEMENT', 'COURT_FILING',
    'JUDGMENT', 'LEGAL_NOTICE', 'PHOTO', 'VIDEO', 'AUDIO',
    'FORENSIC_REPORT', 'DEVICE_EXTRACT'
  ]).optional(),
  restricted: z.boolean().optional(),
  ocrText: z.string().optional(),
});

/**
 * POST /api/documents
 * Upload document with SHA-256 hashing, encryption, and versioning
 * Body: multipart/form-data with file, caseId, title, docType
 */
router.post(
  '/',
  authenticate,
  requireRole('IO', 'REC', 'FSL', 'PP', 'SYS'),
  upload.single('file'),
  auditLog('upload', 'DOCUMENT'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { caseId, title, docType } = req.body;

      if (!caseId) {
        // Clean up uploaded file
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(400).json({ error: 'caseId is required' });
      }

      // Verify case access
      const caseRecord = await prisma.case.findUnique({
        where: { id: caseId },
        select: { id: true, department: true },
      });

      if (!caseRecord) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(404).json({ error: 'Case not found' });
      }

      if (req.user.role !== 'SYS' && req.user.department !== caseRecord.department) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(403).json({ error: 'Access denied: case belongs to different department' });
      }

      // Read file and compute SHA-256
      const fileBuffer = await fs.readFile(req.file.path);
      const fileHash = sha256(fileBuffer);

      // Check if document with same hash already exists (deduplication)
      const existingDoc = await prisma.document.findUnique({
        where: { sha256Hash: fileHash },
      });

      if (existingDoc) {
        // File already exists - return existing document
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(409).json({
          error: 'Document with identical content already exists',
          existingDocument: {
            id: existingDoc.id,
            caseId: existingDoc.caseId,
            filename: existingDoc.filename,
            version: existingDoc.version,
            uploadedAt: existingDoc.uploadedAt,
          },
        });
      }

      // Encrypt file
      const { encrypted, iv, tag } = encrypt(fileBuffer);

      // Save encrypted file
      const encFilename = `${fileHash}.enc`;
      const encPath = path.join(process.env.UPLOAD_DIR || './uploads', encFilename);
      await fs.writeFile(encPath, encrypted);

      // Determine version number
      const latestVersion = await prisma.document.findFirst({
        where: { caseId, filename: req.file.originalname },
        orderBy: { version: 'desc' },
        select: { version: true, id: true },
      });

      const version = (latestVersion?.version || 0) + 1;
      const parentVersionId = latestVersion?.id || null;

      // Determine document type
      let documentType = docType || 'FIR';
      if (!['FIR', 'CHARGE_SHEET', 'WITNESS_STATEMENT', 'COURT_FILING', 'JUDGMENT', 'LEGAL_NOTICE', 'PHOTO', 'VIDEO', 'AUDIO', 'FORENSIC_REPORT', 'DEVICE_EXTRACT'].includes(documentType)) {
        documentType = 'FIR';
      }

      // Create document record
      const document = await prisma.document.create({
        data: {
          caseId,
          filename: req.file.originalname,
          version,
          parentVersionId,
          sha256Hash: fileHash,
          encBlobRef: encPath,
          encIv: iv.toString('base64'),
          encTag: tag.toString('base64'),
          uploadedBy: req.user.id,
          docType: documentType,
          department: caseRecord.department,
          integrity: 'PENDING', // Will be verified on first verify
        },
      });

      // Create initial custody entry
      const prevHash = await getLastCustodyHash(caseId);
      const entryHash = sha256(`${prevHash || ''}|UPLOAD|${req.user.id}|${new Date().toISOString()}`);

      await prisma.custodyEntry.create({
        data: {
          documentId: document.id,
          actorId: req.user.id,
          action: 'UPLOAD',
          prevEntryHash: prevHash || null,
          entryHash,
          caseId,
          notes: `Initial upload: ${req.file.originalname}`,
        },
      });

      // Index for RAG (async, don't block)
      indexDocument(document.id, req.body.ocrText || `Document: ${title || req.file.originalname}`)
        .catch(err => console.error('RAG indexing failed:', err));

      // Update case priority
      updateCasePriority(caseId).catch(err => console.error('Priority update failed:', err));

      res.status(201).json({
        document: {
          id: document.id,
          caseId: document.caseId,
          filename: document.filename,
          version: document.version,
          sha256Hash: document.sha256Hash,
          docType: document.docType,
          integrity: document.integrity,
          uploadedAt: document.uploadedAt,
        },
        demo: true,
      });
    } catch (error) {
      // Clean up on error
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      next(error);
    }
  }
);

/**
 * GET /api/documents/:id
 * Get document metadata
 */
router.get('/:id', authenticate, requireDocumentAccess, async (req, res, next) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
      include: {
        uploader: { select: { id: true, name: true, role: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
        signatures: {
          include: { user: { select: { name: true, role: true } } },
          orderBy: { signedAt: 'desc' },
        },
        redactions: {
          include: { actor: { select: { name: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
        certificates: {
          include: { generator: { select: { name: true, role: true } } },
          orderBy: { issuedAt: 'desc' },
        },
        _count: { select: { versions: true } },
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/documents/:id/versions
 * Get full version chain with hashes
 */
router.get('/:id/versions', authenticate, requireDocumentAccess, async (req, res, next) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
      include: {
        parentVersion: {
          include: {
            parentVersion: {
              include: {
                parentVersion: true, // Up to 3 levels deep
              },
            },
          },
        },
        childVersions: {
          orderBy: { version: 'asc' },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Build version chain
    const versions = [];

    // Add parent versions (recursively)
    let current = document.parentVersion;
    while (current) {
      versions.unshift({
        id: current.id,
        version: current.version,
        filename: current.filename,
        sha256Hash: current.sha256Hash,
        uploadedBy: current.uploadedBy,
        uploadedAt: current.uploadedAt,
        summary: `Version ${current.version}`,
      });
      current = current.parentVersion;
    }

    // Add current document
    versions.push({
      id: document.id,
      version: document.version,
      filename: document.filename,
      sha256Hash: document.sha256Hash,
      uploadedBy: document.uploadedBy,
      uploadedAt: document.uploadedAt,
      summary: `Current version (${document.version})`,
    });

    // Add child versions
    for (const child of document.childVersions) {
      versions.push({
        id: child.id,
        version: child.version,
        filename: child.filename,
        sha256Hash: child.sha256Hash,
        uploadedBy: child.uploadedBy,
        uploadedAt: child.uploadedAt,
        summary: `Version ${child.version}`,
      });
    }

    res.json({ versions, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/documents/:id/download
 * Download decrypted document (logs custody entry)
 */
router.get('/:id/download', authenticate, requireDocumentAccess, auditLog('download', 'DOCUMENT'), async (req, res, next) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Read encrypted file
    const encrypted = await fs.readFile(document.encBlobRef);
    const iv = Buffer.from(document.encIv, 'base64');
    const tag = Buffer.from(document.encTag, 'base64');

    // Decrypt
    const decrypted = decrypt(encrypted, iv, tag);

    // Create custody entry
    const prevHash = await getLastCustodyHash(document.caseId);
    const entryHash = sha256(`${prevHash || ''}|DOWNLOAD|${req.user.id}|${new Date().toISOString()}`);

    await prisma.custodyEntry.create({
      data: {
        documentId: document.id,
        actorId: req.user.id,
        action: 'DOWNLOAD',
        prevEntryHash: prevHash || null,
        entryHash,
        caseId: document.caseId,
        notes: `Downloaded by ${req.user.name}`,
      },
    });

    // Set headers for download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${document.filename}"`);
    res.setHeader('Content-Length', decrypted.length);
    res.setHeader('X-Content-SHA256', document.sha256Hash);

    res.send(decrypted);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/documents/:id/view
 * View document (logs custody entry, returns metadata + optional preview)
 */
router.get('/:id/view', authenticate, requireDocumentAccess, auditLog('view', 'DOCUMENT'), async (req, res, next) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        filename: true,
        version: true,
        sha256Hash: true,
        docType: true,
        integrity: true,
        restricted: true,
        redactedCopy: true,
        signed: true,
        signedBy: true,
        ocrText: true,
        uploadedAt: true,
        updatedAt: true,
        caseId: true,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Create custody entry
    const prevHash = await getLastCustodyHash(document.caseId);
    const entryHash = sha256(`${prevHash || ''}|VIEW|${req.user.id}|${new Date().toISOString()}`);

    await prisma.custodyEntry.create({
      data: {
        documentId: document.id,
        actorId: req.user.id,
        action: 'VIEW',
        prevEntryHash: prevHash || null,
        entryHash,
        caseId: document.caseId,
        notes: `Viewed by ${req.user.name}`,
      },
    });

    res.json({ document, demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/documents/:id
 * Update document metadata (NOT file content - that's immutable)
 */
router.patch(
  '/:id',
  authenticate,
  requireDocumentAccess,
  requireRole('IO', 'REC', 'PP', 'SYS'),
  auditLog('update_metadata', 'DOCUMENT'),
  async (req, res, next) => {
    try {
      const data = updateDocSchema.parse(req.body);

      const document = await prisma.document.update({
        where: { id: req.params.id },
        data: {
          filename: data.title,
          docType: data.docType,
          restricted: data.restricted,
          ocrText: data.ocrText,
        },
      });

      res.json({ document, demo: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/documents/:id
 * Soft delete (lock) document - cannot be undone
 */
router.delete(
  '/:id',
  authenticate,
  requireDocumentAccess,
  requireRole('SYS', 'IO'),
  auditLog('lock', 'DOCUMENT'),
  async (req, res, next) => {
    try {
      const document = await prisma.document.update({
        where: { id: req.params.id },
        data: { locked: true },
      });

      // Create custody entry
      const prevHash = await getLastCustodyHash(document.caseId);
      const entryHash = sha256(`${prevHash || ''}|LOCK|${req.user.id}|${new Date().toISOString()}`);

      await prisma.custodyEntry.create({
        data: {
          documentId: document.id,
          actorId: req.user.id,
          action: 'TRANSFER', // Using TRANSFER for lock
          prevEntryHash: prevHash || null,
          entryHash,
          caseId: document.caseId,
          notes: `Document locked by ${req.user.name}`,
        },
      });

      res.json({ success: true, message: 'Document locked (immutable)', demo: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Helper: Get last custody entry hash for a case
 */
async function getLastCustodyHash(caseId) {
  const lastEntry = await prisma.custodyEntry.findFirst({
    where: { caseId },
    orderBy: { timestamp: 'desc' },
    select: { entryHash: true },
  });
  return lastEntry?.entryHash || null;
}

// Need crypto import for randomUUID
import crypto from 'crypto';

export default router;