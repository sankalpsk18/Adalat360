/**
 * RAG (Conflict-aware Ask) Routes for ADALAT360
 * POST /api/rag/cases/:caseId/ask - Ask a question about a case (uses LLM)
 * GET  /api/rag/cases/:caseId/cache - View query cache
 * DELETE /api/rag/cases/:caseId/cache - Clear query cache
 *
 * ONLY feature that uses Nemotron 3 Ultra via OpenRouter
 * Rate limited to ~40 RPM with caching
 */

import express from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { prisma } from '../index.js';
import { authenticate, requireCaseAccess, requireRole, auditLog } from '../middleware/rbac.js';
import { searchCase } from '../services/embeddings.js';
import { callWithLimit, getUsageStats } from '../utils/llmLimiter.js';
import { sha256 } from '../utils/crypto.js';

const router = express.Router();

// OpenRouter client for Nemotron 3 Ultra
const openrouter = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b';

// Validation schemas
const askSchema = z.object({
  question: z.string().min(1, 'Question is required').max(2000),
  useCache: z.boolean().default(true),
});

/**
 * Normalize question for caching
 */
function normalizeQuestion(question) {
  return question
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

/**
 * Deterministic contradiction detection (NO LLM)
 * Checks for conflicting values in retrieved chunks
 */
function detectConflicts(chunks) {
  const conflicts = [];
  const entities = new Map(); // entity -> [{ value, chunkId, source }]

  // Simple entity extraction patterns
  const patterns = {
    time: /\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?|\d{1,2}\s*(?:AM|PM|am|pm))\b/g,
    date: /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/g,
    location: /\b(?:at|near|in|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    person: /\b(?:witness|suspect|accused|officer)\s+([A-Z][a-z]+)/gi,
    amount: /\b(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{2})?/g,
  };

  for (const chunk of chunks) {
    const content = chunk.content;

    // Extract entities
    for (const [type, pattern] of Object.entries(patterns)) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const value = match[1] || match[0];
        const key = `${type}:${value.toLowerCase()}`;

        if (!entities.has(key)) {
          entities.set(key, []);
        }
        entities.get(key).push({
          value,
          chunkId: chunk.chunkId,
          documentId: chunk.documentId,
          source: chunk.content.slice(Math.max(0, match.index - 50), match.index + value.length + 50),
          similarity: chunk.similarity,
        });
      }
    }
  }

  // Find conflicts: same entity type with different values
  for (const [key, occurrences] of entities) {
    if (occurrences.length > 1) {
      const uniqueValues = [...new Set(occurrences.map(o => o.value))];
      if (uniqueValues.length > 1) {
        conflicts.push({
          type: key.split(':')[0],
          entity: key,
          values: uniqueValues,
          sources: occurrences.map(o => ({
            documentId: o.documentId,
            chunkId: o.chunkId,
            quote: o.source,
            similarity: o.similarity,
          })),
        });
      }
    }
  }

  return conflicts;
}

/**
 * Build prompt for Nemotron
 */
function buildPrompt(question, chunks, conflicts) {
  const context = chunks.map((chunk, i) =>
    `[Source ${i + 1}] (Doc: ${chunk.documentId}, Similarity: ${(chunk.similarity * 100).toFixed(1)}%)\n${chunk.content}`
  ).join('\n\n---\n\n');

  const conflictText = conflicts.length > 0
    ? `\n\n⚠️ POTENTIAL CONFLICTS DETECTED:\n${conflicts.map(c =>
      `- ${c.type.toUpperCase()}: Conflicting values [${c.values.join(', ')}] across ${c.sources.length} sources`
    ).join('\n')}`
    : '\n\nNo obvious conflicts detected in retrieved sources.';

  return `You are an AI assistant for ADALAT360, a legal evidence management system.
Answer the user's question based ONLY on the provided source documents from the case file.

INSTRUCTIONS:
1. Answer with citations to source documents using [Source N] format
2. If sources conflict, EXPLICITLY STATE THE CONFLICT and present both/all versions
3. Do NOT silently pick one version - highlight uncertainty
4. If information is not in sources, say "Not found in provided case documents"
5. Be precise, professional, and concise

QUESTION: ${question}

SOURCE DOCUMENTS:
${context}${conflictText}

ANSWER:`;
}

/**
 * POST /api/rag/cases/:caseId/ask
 * Ask a question about a case (Conflict-aware RAG)
 * This is the ONLY endpoint that calls the LLM
 */
router.post(
  '/cases/:caseId/ask',
  authenticate,
  requireCaseAccess,
  auditLog('rag_query', 'CASE'),
  async (req, res, next) => {
    try {
      const { question, useCache } = askSchema.parse(req.body);
      const caseId = req.params.caseId;

      // Check cache first
      const normalizedQuestion = normalizeQuestion(question);
      const cacheKey = `${caseId}:${sha256(normalizedQuestion).slice(0, 16)}`;

      if (useCache) {
        const cached = await prisma.ragQueryCache.findUnique({
          where: { questionNormalized: cacheKey },
        });

        if (cached && new Date(cached.expiresAt) > new Date()) {
          return res.json({
            answer: JSON.parse(cached.answerJson),
            cached: true,
            cacheTimestamp: cached.createdAt,
            demo: true,
          });
        }
      }

      // Retrieve relevant chunks
      const chunks = await searchCase(caseId, question, 10);

      if (chunks.length === 0) {
        return res.json({
          answer: {
            answer: 'No relevant documents found in this case to answer your question.',
            citations: [],
            conflicts: [],
            confidence: 0,
          },
          cached: false,
          demo: true,
        });
      }

      // Detect conflicts deterministically
      const conflicts = detectConflicts(chunks);

      // Build prompt
      const prompt = buildPrompt(question, chunks, conflicts);

      // Call LLM with rate limiting
      const hasOpenRouterKey = Boolean(
        process.env.OPENROUTER_API_KEY &&
        !process.env.OPENROUTER_API_KEY.startsWith('your-'),
      );
      const llmResponse = hasOpenRouterKey
        ? await callWithLimit(async () => {
            const completion = await openrouter.chat.completions.create({
              model: MODEL,
              messages: [
                {
                  role: 'system',
                  content: 'You are a legal evidence analyst. Answer questions based only on provided case documents. Explicitly flag conflicts and uncertainty. Cite sources as [Source N].',
                },
                { role: 'user', content: prompt },
              ],
              temperature: 0.1,
              max_tokens: 2000,
            });
            return completion.choices[0]?.message?.content || 'No response from model';
          })
        : `Relevant case material:\n\n${chunks
            .slice(0, 3)
            .map((chunk, index) => `[Source ${index + 1}] ${chunk.content}`)
            .join('\n\n')}`;

      // Parse LLM response for structured output
      const answer = {
        answer: llmResponse,
        citations: chunks.slice(0, 5).map((c, i) => ({
          sourceNumber: i + 1,
          documentId: c.documentId,
          chunkIndex: c.chunkIndex,
          similarity: Math.round(c.similarity * 100) / 100,
          preview: c.content.slice(0, 200) + '...',
        })),
        conflicts: conflicts.map(c => ({
          type: c.type,
          conflictingValues: c.values,
          sources: c.sources.map(s => ({
            documentId: s.documentId,
            quote: s.quote,
          })),
        })),
        confidence: chunks.length > 0 ? Math.round(chunks[0].similarity * 100) : 0,
        model: MODEL,
        timestamp: new Date().toISOString(),
      };

      // Persist unresolved conflicts as ConflictAlert
      for (const conflict of conflicts) {
        if (conflict.type === 'time' || conflict.type === 'location' || conflict.type === 'identity') {
          await prisma.conflictAlert.create({
            data: {
              caseId,
              documentIds: [...new Set(conflict.sources.map(s => s.documentId))],
              description: `RAG-detected ${conflict.type} conflict: ${conflict.values.join(' vs ')}`,
              severity: 'MEDIUM',
            },
          }).catch(() => { }); // Ignore duplicate errors
        }
      }

      // Cache the response
      if (useCache) {
        await prisma.ragQueryCache.create({
          data: {
            caseId,
            questionNormalized: cacheKey,
            answerJson: JSON.stringify(answer),
            userId: req.user.id,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min TTL
          },
        }).catch(() => { }); // Ignore duplicate cache errors
      }

      res.json({
        answer,
        cached: false,
        chunksRetrieved: chunks.length,
        conflictsDetected: conflicts.length,
        demo: true,
      });
    } catch (error) {
      // Handle rate limit errors
      if (error.status === 429 || error.message?.includes('rate limit')) {
        return res.status(429).json({
          error: 'LLM rate limit exceeded. Please wait a moment and try again.',
          retryAfter: 60,
          demo: true,
        });
      }
      next(error);
    }
  }
);

/**
 * GET /api/rag/cases/:caseId/cache
 * View query cache for a case
 */
router.get('/cases/:caseId/cache', authenticate, requireCaseAccess, async (req, res, next) => {
  try {
    const cache = await prisma.ragQueryCache.findMany({
      where: { caseId: req.params.caseId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      cache: cache.map(c => ({
        id: c.id,
        question: c.questionNormalized,
        createdAt: c.createdAt,
        expiresAt: c.expiresAt,
        answerPreview: JSON.parse(c.answerJson).answer?.slice(0, 100) + '...',
      })),
      demo: true,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/rag/cases/:caseId/cache
 * Clear query cache for a case
 */
router.delete('/cases/:caseId/cache', authenticate, requireCaseAccess, requireRole('SYS', 'IO'), async (req, res, next) => {
  try {
    await prisma.ragQueryCache.deleteMany({
      where: { caseId: req.params.caseId },
    });

    res.json({ success: true, message: 'Query cache cleared', demo: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/rag/usage
 * Get LLM usage statistics (for monitoring rate limit)
 */
router.get('/usage', authenticate, requireRole('SYS'), (req, res) => {
  res.json({
    usage: getUsageStats(),
    demo: true,
  });
});

export default router;