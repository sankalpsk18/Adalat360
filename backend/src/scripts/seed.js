/**
 * Demo Data Seeding Script for ADALAT360
 * Creates synthetic data matching the frontend screenshots
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { generateKeyPair, encryptPrivateKey, sha256 } from '../utils/crypto.js';

const prisma = new PrismaClient();

export async function seedDemoData() {
  console.log('🌱 Seeding ADALAT360 demo data...');

  // Clean existing data (in order of dependencies)
  await prisma.ragQueryCache.deleteMany();
  await prisma.ragChunk.deleteMany();
  await prisma.signature.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.redaction.deleteMany();
  await prisma.approvalRequest.deleteMany();
  await prisma.conflictAlert.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.custodyEntry.deleteMany();
  await prisma.exhibitEntry.deleteMany();
  await prisma.document.deleteMany();
  await prisma.case.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // ============================================
  // USERS (one per role/department for demo)
  // ============================================
  const passwordHash = await bcrypt.hash('demo123', 12);

  // IO - Crime Branch
  const io1Keys = generateKeyPair();
  const io1 = await prisma.user.create({
    data: {
      name: 'Insp. R. Deshmukh',
      serviceBarId: 'IO-CB-2026-001',
      passwordHash,
      role: 'IO',
      department: 'City Police — Crime Branch',
      publicKey: io1Keys.publicKey,
      privateKeyEnc: encryptPrivateKey(io1Keys.privateKey),
    },
  });

  // REC - Records Section
  const rec1Keys = generateKeyPair();
  const rec1 = await prisma.user.create({
    data: {
      name: 'SI D. Patil',
      serviceBarId: 'REC-RS-2026-001',
      passwordHash,
      role: 'REC',
      department: 'Records Section',
      publicKey: rec1Keys.publicKey,
      privateKeyEnc: encryptPrivateKey(rec1Keys.privateKey),
    },
  });

  // FSL - Regional Forensic Science Laboratory
  const fsl1Keys = generateKeyPair();
  const fsl1 = await prisma.user.create({
    data: {
      name: 'Dr. A. Nair',
      serviceBarId: 'FSL-RFSL-2026-001',
      passwordHash,
      role: 'FSL',
      department: 'Regional Forensic Science Laboratory',
      publicKey: fsl1Keys.publicKey,
      privateKeyEnc: encryptPrivateKey(fsl1Keys.privateKey),
    },
  });

  // PP - Legal Cell
  const pp1Keys = generateKeyPair();
  const pp1 = await prisma.user.create({
    data: {
      name: 'Adv. S. Iyer',
      serviceBarId: 'PP-LC-2026-001',
      passwordHash,
      role: 'PP',
      department: 'Legal Cell',
      publicKey: pp1Keys.publicKey,
      privateKeyEnc: encryptPrivateKey(pp1Keys.privateKey),
    },
  });

  // CRT - District Court
  const crt1Keys = generateKeyPair();
  const crt1 = await prisma.user.create({
    data: {
      name: 'Hon. Court Officer K. Menon',
      serviceBarId: 'CRT-DC-2026-001',
      passwordHash,
      role: 'CRT',
      department: 'District Court Registry',
      publicKey: crt1Keys.publicKey,
      privateKeyEnc: encryptPrivateKey(crt1Keys.privateKey),
    },
  });

  // IO - EOW
  const io2Keys = generateKeyPair();
  const io2 = await prisma.user.create({
    data: {
      name: 'SI M. Kulkarni',
      serviceBarId: 'IO-EOW-2026-001',
      passwordHash,
      role: 'IO',
      department: 'Economic Offences Wing',
      publicKey: io2Keys.publicKey,
      privateKeyEnc: encryptPrivateKey(io2Keys.privateKey),
    },
  });

  // SYS - IT Cell
  const sys1Keys = generateKeyPair();
  const sys1 = await prisma.user.create({
    data: {
      name: 'ops.admin',
      serviceBarId: 'SYS-IT-2026-001',
      passwordHash,
      role: 'SYS',
      department: 'IT Cell',
      publicKey: sys1Keys.publicKey,
      privateKeyEnc: encryptPrivateKey(sys1Keys.privateKey),
    },
  });

  // IO - Cyber Cell (suspended per seed data)
  const io3Keys = generateKeyPair();
  const io3 = await prisma.user.create({
    data: {
      name: 'Insp. P. Rane',
      serviceBarId: 'IO-CC-2026-001',
      passwordHash,
      role: 'IO',
      department: 'Cyber Cell',
      publicKey: io3Keys.publicKey,
      privateKeyEnc: encryptPrivateKey(io3Keys.privateKey),
      status: 'suspended',
    },
  });

  console.log('👥 Created 8 users');

  // Map users for easy reference
  const userMap = { io1, rec1, fsl1, pp1, crt1, io2, sys1, io3 };

  // ============================================
  // CASES (matching frontend screenshots)
  // ============================================
  const c1 = await prisma.case.create({
    data: {
      id: 'CR-2026-0417',
      caseNumber: 'CR-2026-0417',
      title: 'Hit-and-run near Central Mall junction',
      status: 'UNDER_INVESTIGATION',
      department: 'City Police — Crime Branch',
      priorityScore: 78,
      priorityLabel: 'HIGH',
      courtDate: new Date('2026-09-15T10:00:00Z'),
      lastActivityAt: new Date('2026-08-28T14:05:00Z'),
      officers: { connect: [{ id: io1.id }, { id: fsl1.id }, { id: pp1.id }] },
    },
  });

  const c2 = await prisma.case.create({
    data: {
      id: 'CR-2026-0388',
      caseNumber: 'CR-2026-0388',
      title: 'Commercial fraud — shell vendor invoices',
      status: 'CHARGESHEET_FILED',
      department: 'Economic Offences Wing',
      priorityScore: 45,
      priorityLabel: 'MEDIUM',
      courtDate: new Date('2026-10-01T10:00:00Z'),
      lastActivityAt: new Date('2026-08-25T11:42:00Z'),
      officers: { connect: [{ id: io2.id }, { id: pp1.id }] },
    },
  });

  const c3 = await prisma.case.create({
    data: {
      id: 'CR-2026-0431',
      caseNumber: 'CR-2026-0431',
      title: 'Cyber intrusion — municipal records server',
      status: 'OPEN',
      department: 'Cyber Cell',
      priorityScore: 82,
      priorityLabel: 'HIGH',
      courtDate: null,
      lastActivityAt: new Date('2026-08-29T08:15:00Z'),
      officers: { connect: [{ id: io3.id }, { id: fsl1.id }] },
    },
  });

  const c4 = await prisma.case.create({
    data: {
      id: 'CR-2025-0912',
      caseNumber: 'CR-2025-0912',
      title: 'Property dispute — forged sale deed',
      status: 'IN_COURT',
      department: 'District Police',
      priorityScore: 28,
      priorityLabel: 'LOW',
      courtDate: new Date('2026-09-10T10:00:00Z'),
      lastActivityAt: new Date('2026-08-20T09:00:00Z'),
      officers: { connect: [{ id: io2.id }, { id: crt1.id }] },
    },
  });

  console.log('📁 Created 4 cases');

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const ivDefault = Buffer.from('000000000000000000000000', 'hex').toString('base64');
  const tagDefault = Buffer.from('0000000000000000', 'hex').toString('base64');

  async function createDoc(data, uploader, custodyNotes) {
    const fileHash = sha256(`MOCK-${data.id}-${Date.now()}`);
    const doc = await prisma.document.create({
      data: {
        id: data.id,
        caseId: data.caseId,
        filename: data.filename,
        version: data.version,
        parentVersionId: data.parentVersionId || null,
        sha256Hash: fileHash,
        encBlobRef: `./uploads/${fileHash}.enc`,
        encIv: ivDefault,
        encTag: tagDefault,
        uploadedBy: uploader.id,
        docType: data.docType,
        integrity: data.integrity,
        restricted: data.restricted ?? false,
        redactedCopy: data.redactedCopy ?? false,
        signed: data.signed ?? false,
        signedBy: data.signedBy || null,
        ocrText: data.ocrText || null,
        department: data.department,
      },
    });

    const prevHash = await getLastCustodyHash(data.caseId);
    const entryHash = sha256(`${prevHash || ''}|UPLOAD|${uploader.id}|${data.uploadedAt}`);

    await prisma.custodyEntry.create({
      data: {
        documentId: doc.id,
        actorId: uploader.id,
        action: 'UPLOAD',
        prevEntryHash: prevHash,
        entryHash,
        caseId: data.caseId,
        notes: custodyNotes,
      },
    });

    return doc;
  }

  async function getLastCustodyHash(caseId) {
    const lastEntry = await prisma.custodyEntry.findFirst({
      where: { caseId },
      orderBy: { timestamp: 'desc' },
      select: { entryHash: true },
    });
    return lastEntry?.entryHash || null;
  }

  // ============================================
  // DOCUMENTS - Create parent versions FIRST, then children
  // ============================================

  // CR-2026-0417 Documents
  // DOC-1001 (no parent)
  await createDoc({
    id: 'DOC-1001', caseId: 'CR-2026-0417', filename: 'FIR No. 417/2026',
    version: 1, docType: 'FIR', integrity: 'VERIFIED', restricted: false,
    redactedCopy: false, signed: true, signedBy: 'Insp. R. Deshmukh',
    ocrText: 'First Information Report registered on 12 June 2026 at 09:20 hrs regarding a vehicle collision reported near Central Mall junction. Complainant reports a dark sedan leaving the scene.',
    department: 'City Police — Crime Branch', uploadedAt: '2026-06-12T09:40:00Z',
  }, rec1, 'FIR intake at station terminal');

  // DOC-1002-v1 (parent of DOC-1002)
  await createDoc({
    id: 'DOC-1002-v1', caseId: 'CR-2026-0417', filename: 'Witness statement — Witness A (v1)',
    version: 1, docType: 'WITNESS_STATEMENT', integrity: 'VERIFIED', restricted: true,
    department: 'City Police — Crime Branch', uploadedAt: '2026-06-14T10:02:00Z',
  }, io1, 'Witness statement v1 recorded');

  // DOC-1002 (child of DOC-1002-v1)
  await createDoc({
    id: 'DOC-1002', caseId: 'CR-2026-0417', filename: 'Witness statement — Witness A',
    version: 2, parentVersionId: 'DOC-1002-v1', docType: 'WITNESS_STATEMENT',
    integrity: 'VERIFIED', restricted: true, redactedCopy: false, signed: false,
    ocrText: 'Witness A states that a dark sedan was seen near Central Mall at approximately 8:40 PM. Witness revised the earlier stated time of 9:00 PM after reviewing a mobile call log.',
    department: 'City Police — Crime Branch', uploadedAt: '2026-07-04T13:12:00Z',
  }, io1, 'Witness statement v2 recorded - time corrected to 8:40 PM');

  // DOC-1003
  await createDoc({
    id: 'DOC-1003', caseId: 'CR-2026-0417', filename: 'CCTV analysis report — Railway Station approach',
    version: 1, docType: 'FORENSIC_REPORT', integrity: 'VERIFIED', restricted: true,
    redactedCopy: false, signed: true, signedBy: 'Dr. A. Nair',
    ocrText: 'Frame analysis of camera RS-04 places a dark sedan bearing a partially legible registration plate near the Railway Station approach road at 20:50 hrs. Plate confidence: partial.',
    department: 'Regional Forensic Science Laboratory', uploadedAt: '2026-07-11T07:45:00Z',
  }, fsl1, 'CCTV analysis report submitted');

  // DOC-1004
  await createDoc({
    id: 'DOC-1004', caseId: 'CR-2026-0417', filename: 'Suspect statement — alibi',
    version: 1, docType: 'WITNESS_STATEMENT', integrity: 'PENDING', restricted: true,
    ocrText: 'Suspect states presence at City Hospital between 8:30 PM and 9:30 PM accompanying a relative. Hospital visitor register not yet obtained; alibi unverified at time of recording.',
    department: 'City Police — Crime Branch', uploadedAt: '2026-07-18T16:20:00Z',
  }, io1, 'Suspect statement recorded');

  // DOC-1005
  await createDoc({
    id: 'DOC-1005', caseId: 'CR-2026-0417', filename: 'Fingerprint examination report — vehicle exterior',
    version: 1, docType: 'FORENSIC_REPORT', integrity: 'VERIFIED', restricted: true,
    redactedCopy: false, signed: true, signedBy: 'Dr. A. Nair',
    ocrText: 'Latent prints lifted from the driver-side door handle of exhibit EX-2026-014 correspond to the reference set of the named suspect. Points of comparison: sufficient for identification per laboratory protocol.',
    department: 'Regional Forensic Science Laboratory', uploadedAt: '2026-08-02T10:30:00Z',
  }, fsl1, 'Fingerprint examination completed');

  // DOC-1006-v1 (parent of v2)
  await createDoc({
    id: 'DOC-1006-v1', caseId: 'CR-2026-0417', filename: 'Draft charge sheet (v1)',
    version: 1, docType: 'CHARGE_SHEET', integrity: 'VERIFIED', restricted: true,
    department: 'City Police — Crime Branch', uploadedAt: '2026-08-20T09:10:00Z',
  }, io1, 'Draft charge sheet v1 created');

  // DOC-1006-v2 (parent of v3)
  await createDoc({
    id: 'DOC-1006-v2', caseId: 'CR-2026-0417', filename: 'Draft charge sheet (v2)',
    version: 2, parentVersionId: 'DOC-1006-v1', docType: 'CHARGE_SHEET',
    integrity: 'VERIFIED', restricted: true,
    department: 'City Police — Crime Branch', uploadedAt: '2026-08-24T15:35:00Z',
  }, pp1, 'Legal Cell review — sections revised');

  // DOC-1006 (child of v2)
  await createDoc({
    id: 'DOC-1006', caseId: 'CR-2026-0417', filename: 'Draft charge sheet',
    version: 3, parentVersionId: 'DOC-1006-v2', docType: 'CHARGE_SHEET',
    integrity: 'PENDING', restricted: true, redactedCopy: false, signed: false,
    ocrText: 'Draft charge sheet compiled from investigation record. Sections cited revised per Legal Cell review. Witness timing stated as 8:40 PM per revised statement. Annexure F: fingerprint examination report attached.',
    department: 'City Police — Crime Branch', uploadedAt: '2026-08-28T14:05:00Z',
  }, io1, 'Draft charge sheet v3 - forensic annexure added');

  // CR-2026-0388 Document
  await createDoc({
    id: 'DOC-2001', caseId: 'CR-2026-0388', filename: 'Charge sheet — EOW/388',
    version: 1, docType: 'CHARGE_SHEET', integrity: 'VERIFIED', restricted: false,
    redactedCopy: true, signed: true, signedBy: 'SI M. Kulkarni',
    ocrText: 'Charge sheet filed before the competent court. Financial annexures enclosed. Personal identifiers of complainants redacted in the shareable copy.',
    department: 'Economic Offences Wing', uploadedAt: '2026-08-25T11:42:00Z',
  }, io2, 'Charge sheet filed');

  // CR-2026-0431 Document
  await createDoc({
    id: 'DOC-3001', caseId: 'CR-2026-0431', filename: 'Server disk image — device extract',
    version: 1, docType: 'DEVICE_EXTRACT', integrity: 'MISMATCH', restricted: true,
    ocrText: 'Forensic disk image of municipal records server. Acquisition log attached. Recomputed hash at last verification did not match the acquisition hash — flagged for review.',
    department: 'Cyber Cell', uploadedAt: '2026-08-01T04:00:00Z',
  }, io3, 'Disk image acquisition');

  // CR-2025-0912 Document
  await createDoc({
    id: 'DOC-4001', caseId: 'CR-2025-0912', filename: 'Judgment copy — interim order',
    version: 1, docType: 'JUDGMENT', integrity: 'VERIFIED', restricted: false,
    redactedCopy: false, signed: true, signedBy: 'Hon. Court Officer K. Menon',
    ocrText: 'Interim order recorded by the court directing preservation of the disputed instrument pending expert examination.',
    department: 'District Court Registry', uploadedAt: '2026-08-20T09:00:00Z',
  }, crt1, 'Interim order uploaded by registry');

  console.log('📄 Created all documents');

  // ============================================
  // EXHIBITS
  // ============================================
  await prisma.exhibitEntry.create({
    data: {
      id: 'EX-2026-014', caseId: 'CR-2026-0417', exhibitCode: 'EX-2026-014',
      label: 'Dark sedan (registration partially legible)', category: 'VEHICLE',
      status: 'WITH_FSL', location: 'Regional FSL — Vehicle Bay 3',
      holder: 'Regional FSL — Vehicle Bay 3',
      sealHash: 'd41d8cd98f00b204e9800998ecf8427e11aa22bb33cc44dd55ee66ff7788990a',
    },
  });

  await prisma.exhibitEntry.create({
    data: {
      id: 'EX-2026-015', caseId: 'CR-2026-0417', exhibitCode: 'EX-2026-015',
      label: 'Mobile handset recovered from suspect', category: 'DEVICE',
      status: 'IN_MALKHANA', location: 'Malkhana — City Police',
      holder: 'Malkhana — City Police',
      sealHash: '6b1f0a37cc92de4508a1bb2740cf39e6a7d5108bb3e2c46f90da75c1e8f3b204',
    },
  });

  await prisma.exhibitEntry.create({
    data: {
      id: 'EX-2026-031', caseId: 'CR-2026-0388', exhibitCode: 'EX-2026-031',
      label: 'Cash bundle — seized at premises', category: 'CASH',
      status: 'IN_COURT', location: 'District Court Malkhana',
      holder: 'District Court Malkhana',
      sealHash: '17ca88b0de4f2391065ab7cc203e19d4f8b6027ae5c3149d0b7e2f6a8cd31450',
    },
  });

  await prisma.exhibitEntry.create({
    data: {
      id: 'EX-2026-044', caseId: 'CR-2026-0431', exhibitCode: 'EX-2026-044',
      label: 'Server hard disk (write-blocked copy)', category: 'DEVICE',
      status: 'IN_TRANSIT', location: 'Courier — Cyber Cell to FSL',
      holder: 'Courier — Cyber Cell to FSL',
      sealHash: '902ab13cc74e0f5681d2ba39ee405c1728fd6b04a3e19c75f0b6d284ac1e3307',
    },
  });

  await prisma.exhibitEntry.create({
    data: {
      id: 'EX-2025-102', caseId: 'CR-2025-0912', exhibitCode: 'EX-2025-102',
      label: 'Disputed sale deed (original instrument)', category: 'DOCUMENT',
      status: 'IN_COURT', location: 'District Court Registry',
      holder: 'District Court Registry',
      sealHash: '3fc0a71bb2d94e5807a6cc13ee29d40f8b17562ae0c34d91f7b2065ac8de1123',
    },
  });

  console.log('🔍 Created 5 exhibits');

  // ============================================
  // ADDITIONAL CUSTODY ENTRIES
  // ============================================
  const custodyEntries = [
    { documentId: 'DOC-1001', actorId: io1.id, action: 'VIEW', caseId: 'CR-2026-0417', timestamp: '2026-06-12T11:05:00Z', notes: 'IO reviewed FIR' },
    { documentId: 'DOC-1003', actorId: io1.id, action: 'TRANSFER', caseId: 'CR-2026-0417', timestamp: '2026-06-20T08:15:00Z', notes: 'Vehicle exhibit transferred to FSL' },
    { documentId: 'DOC-1003', actorId: fsl1.id, action: 'SIGN', caseId: 'CR-2026-0417', timestamp: '2026-07-11T07:52:00Z', notes: 'DSC signature applied to technical particulars' },
    { documentId: 'DOC-1006', actorId: pp1.id, action: 'VERIFY', caseId: 'CR-2026-0417', timestamp: '2026-08-24T15:30:00Z', notes: 'Integrity check before legal review' },
    { documentId: 'DOC-1006', actorId: pp1.id, action: 'EXPORT', caseId: 'CR-2026-0417', timestamp: '2026-08-28T14:20:00Z', notes: 'Draft exported for legal cell review' },
    { documentId: 'DOC-3001', actorId: fsl1.id, action: 'VERIFY', caseId: 'CR-2026-0431', timestamp: '2026-08-29T08:15:00Z', notes: 'Recomputed hash does not match acquisition hash', broken: true },
  ];

  for (const entry of custodyEntries) {
    const prevHash = await getLastCustodyHash(entry.caseId);
    const entryHash = entry.broken
      ? sha256('BROKEN-HASH-INTENTIONAL')
      : sha256(`${prevHash || ''}|${entry.action}|${entry.actorId}|${entry.timestamp}`);

    await prisma.custodyEntry.create({
      data: {
        documentId: entry.documentId,
        actorId: entry.actorId,
        action: entry.action,
        prevEntryHash: prevHash,
        entryHash,
        caseId: entry.caseId,
        timestamp: new Date(entry.timestamp),
        notes: entry.notes,
        broken: entry.broken || false,
      },
    });
  }

  console.log('🔗 Created custody chain entries');

  // ============================================
  // CONFLICT ALERTS
  // ============================================
  const conflicts = [
    { id: 'CF-1', caseId: 'CR-2026-0417', documentIds: JSON.stringify(['DOC-1002', 'DOC-1006']), description: 'Witness sighting time was revised from 9:00 PM to 8:40 PM; the superseded time still appears in an earlier charge sheet draft.', severity: 'MEDIUM' },
    { id: 'CF-2', caseId: 'CR-2026-0417', documentIds: JSON.stringify(['DOC-1002', 'DOC-1003']), description: 'The same vehicle is placed at two locations roughly 10 minutes apart with no route corroboration on record.', severity: 'MEDIUM' },
    { id: 'CF-3', caseId: 'CR-2026-0417', documentIds: JSON.stringify(['DOC-1004']), description: 'Suspect asserts an alibi overlapping both sightings; the alibi is recorded as unverified (hospital register not obtained).', severity: 'HIGH' },
    { id: 'CF-4', caseId: 'CR-2026-0417', documentIds: JSON.stringify(['DOC-1005']), description: 'Fingerprint identification places the suspect in contact with the vehicle, but the report does not establish time of contact.', severity: 'MEDIUM' },
    { id: 'CF-5', caseId: 'CR-2026-0417', documentIds: JSON.stringify(['DOC-1006']), description: 'Charge sheet draft v1 cites the superseded 9:00 PM timing; v3 is the current version.', severity: 'LOW' },
    { id: 'CF-6', caseId: 'CR-2026-0431', documentIds: JSON.stringify(['DOC-3001']), description: 'Hash mismatch on server disk image — recomputed hash does not match acquisition hash', severity: 'CRITICAL' },
  ];

  for (const c of conflicts) {
    await prisma.conflictAlert.create({ data: c });
  }
  console.log('⚠️ Created 6 conflict alerts');

  // ============================================
  // APPROVAL REQUESTS
  // ============================================
  const approvals = [
    { id: 'AP-01', resourceType: 'DOCUMENT', resourceId: 'DOC-1006', caseId: 'CR-2026-0417', requestedBy: pp1.id, approverRole: 'IO' },
    { id: 'AP-02', resourceType: 'DOCUMENT', resourceId: 'DOC-1003', caseId: 'CR-2026-0417', requestedBy: fsl1.id, approverRole: 'PP' },
    { id: 'AP-03', resourceType: 'DOCUMENT', resourceId: 'DOC-3001', caseId: 'CR-2026-0431', requestedBy: sys1.id, approverRole: 'IO' },
    { id: 'AP-04', resourceType: 'CASE', resourceId: 'CR-2026-0431', caseId: 'CR-2026-0431', requestedBy: io3.id, approverRole: 'FSL' },
    { id: 'AP-05', resourceType: 'DOCUMENT', resourceId: 'DOC-2001', caseId: 'CR-2026-0388', requestedBy: rec1.id, approverRole: 'CRT' },
  ];

  for (const a of approvals) {
    await prisma.approvalRequest.create({ data: { ...a, status: 'PENDING' } });
  }
  console.log('📋 Created 5 approval requests');

  // ============================================
  // AUDIT LOGS
  // ============================================
  const auditLogs = [
    { actorId: pp1.id, action: 'EXPORT', resourceType: 'DOCUMENT', resourceId: 'DOC-1006', caseId: 'CR-2026-0417', timestamp: new Date('2026-08-28T14:20:00Z'), ip: '10.24.6.51' },
    { actorId: io1.id, action: 'EDIT_VERSION', resourceType: 'DOCUMENT', resourceId: 'DOC-1006', caseId: 'CR-2026-0417', timestamp: new Date('2026-08-28T14:05:00Z'), ip: '10.24.6.12' },
    { actorId: fsl1.id, action: 'VERIFY', resourceType: 'DOCUMENT', resourceId: 'DOC-3001', caseId: 'CR-2026-0431', timestamp: new Date('2026-08-29T08:15:00Z'), ip: '10.31.2.8' },
    { actorId: rec1.id, action: 'REDACT', resourceType: 'DOCUMENT', resourceId: 'DOC-2001', caseId: 'CR-2026-0388', timestamp: new Date('2026-08-25T11:50:00Z'), ip: '10.24.6.77' },
    { actorId: crt1.id, action: 'VIEW', resourceType: 'DOCUMENT', resourceId: 'DOC-4001', caseId: 'CR-2025-0912', timestamp: new Date('2026-08-20T09:05:00Z'), ip: '10.55.1.4' },
    { actorId: sys1.id, action: 'ROLE_GRANT', resourceType: 'USER', resourceId: io3.id, caseId: null, timestamp: new Date('2026-08-19T06:40:00Z'), ip: '10.0.0.2' },
    { actorId: io3.id, action: 'DOWNLOAD', resourceType: 'DOCUMENT', resourceId: 'DOC-3001', caseId: 'CR-2026-0431', timestamp: new Date('2026-08-12T13:33:00Z'), ip: '10.31.2.19' },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({ data: log });
  }
  console.log('📊 Created 7 audit log entries');

  // ============================================
  // RAG CHUNKS
  // ============================================
  const docs = await prisma.document.findMany({ where: { ocrText: { not: null } } });
  for (const doc of docs) {
    const chunks = [doc.ocrText.slice(0, 500), doc.ocrText.slice(500, 1000)].filter(c => c.length > 50);
    for (let i = 0; i < chunks.length; i++) {
      const embedding = new Array(1024).fill(0).map(() => Math.random() * 0.01);
      await prisma.ragChunk.create({
        data: { documentId: doc.id, chunkIndex: i, content: chunks[i], embedding: JSON.stringify(embedding) },
      });
    }
  }
  console.log('🔍 Created RAG chunks for documents');

  console.log('✅ Demo data seeding complete!');
  console.log('');
  console.log('🔑 Demo login credentials (passphrase: demo123):');
  console.log('   IO (Crime Branch):     IO-CB-2026-001');
  console.log('   REC (Records):         REC-RS-2026-001');
  console.log('   FSL (Forensics):       FSL-RFSL-2026-001');
  console.log('   PP (Prosecutor):       PP-LC-2026-001');
  console.log('   CRT (Court Officer):   CRT-DC-2026-001');
  console.log('   IO (EOW):              IO-EOW-2026-001');
  console.log('   SYS (Admin):           SYS-IT-2026-001');
  console.log('   IO (Cyber - suspended): IO-CC-2026-001');
}

async function main() {
  try {
    await seedDemoData();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}