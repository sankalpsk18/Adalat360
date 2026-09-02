/**
 * Embedding Service for ADALAT360 RAG
 * Uses local/free embedding model (NOT Nemotron Ultra)
 */

import { prisma } from '../index.js';
import { sha256 } from '../utils/crypto.js';

// Embedding configuration
const EMBEDDING_DIM = 1024; // Adjust based on model
const CHUNK_SIZE = 500; // Characters per chunk
const CHUNK_OVERLAP = 50; // Overlap between chunks

/**
 * Generate embeddings for text chunks
 * In production, this would call a local embedding model or free API
 * For prototype, we'll use a deterministic hash-based embedding
 *
 * @param {string[]} texts - Text chunks to embed
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
export async function generateEmbeddings(texts) {
  // For prototype: use deterministic hash-based embeddings
  // In production, replace with actual embedding model call:
  // const response = await fetch(EMBEDDING_API_URL, { ... })

  return texts.map(text => {
    // Create deterministic "embedding" from text hash
    // This is NOT a real embedding - replace with real model in production
    const hash = sha256(text);
    const vector = new Array(EMBEDDING_DIM).fill(0);

    // Fill vector deterministically from hash
    for (let i = 0; i < hash.length; i += 2) {
      const idx = parseInt(hash.slice(i, i + 2), 16) % EMBEDDING_DIM;
      vector[idx] = (vector[idx] + 1) / 256; // Normalize-ish
    }

    // Normalize to unit vector
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
  });
}

/**
 * Chunk text into overlapping segments
 * @param {string} text - Text to chunk
 * @param {number} chunkSize - Max characters per chunk
 * @param {number} overlap - Overlap between chunks
 * @returns {string[]} Text chunks
 */
export function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks.filter(c => c.trim().length > 0);
}

/**
 * Store document chunks with embeddings
 * @param {string} documentId - Document ID
 * @param {string} text - Full document text (OCR or extracted)
 * @returns {Promise<void>}
 */
export async function indexDocument(documentId, text) {
  // Remove existing chunks
  await prisma.ragChunk.deleteMany({
    where: { documentId },
  });

  // Chunk and embed
  const chunks = chunkText(text);
  if (chunks.length === 0) return;

  const embeddings = await generateEmbeddings(chunks);

  // Store chunks
  await prisma.ragChunk.createMany({
    data: chunks.map((chunk, index) => ({
      documentId,
      chunkIndex: index,
      content: chunk,
      embedding: JSON.stringify(embeddings[index]),
    })),
  });
}

/**
 * Cosine similarity between two vectors
 * @param {number[]} a - Vector A
 * @param {number[]} b - Vector B
 * @returns {number} Similarity score (0-1)
 */
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Search for relevant chunks across a case
 * @param {string} caseId - Case ID
 * @param {string} query - Search query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array>} Top matching chunks with metadata
 */
export async function searchCase(caseId, query, topK = 10) {
  // Get query embedding
  const [queryEmbedding] = await generateEmbeddings([query]);

  // Get all chunks for the case
  const documents = await prisma.document.findMany({
    where: { caseId },
    select: { id: true, title: true, caseId: true },
  });

  const documentIds = documents.map(d => d.id);
  if (documentIds.length === 0) return [];

  const chunks = await prisma.ragChunk.findMany({
    where: { documentId: { in: documentIds } },
    select: { id: true, documentId: true, chunkIndex: true, content: true, embedding: true },
  });

  if (chunks.length === 0) return [];

  // Compute similarities
  const results = chunks.map(chunk => {
    const embedding = JSON.parse(chunk.embedding);
    const similarity = cosineSimilarity(queryEmbedding, embedding);
    return {
      chunkId: chunk.id,
      documentId: chunk.documentId,
      chunkIndex: chunk.chunkIndex,
      content: chunk.content,
      similarity,
    };
  });

  // Sort by similarity and return top K
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, topK);
}

/**
 * Get document chunks for a specific document
 * @param {string} documentId - Document ID
 * @returns {Promise<Array>} Document chunks
 */
export async function getDocumentChunks(documentId) {
  return prisma.ragChunk.findMany({
    where: { documentId },
    orderBy: { chunkIndex: 'asc' },
    select: { chunkIndex: true, content: true },
  });
}