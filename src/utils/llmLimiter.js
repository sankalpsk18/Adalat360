/**
 * LLM Rate Limiter for ADALAT360
 * Token bucket implementation to stay under 50 RPM OpenRouter limit
 * We use ~40 RPM to leave buffer
 */

import Bottleneck from 'bottleneck';

// Configuration
const RPM_LIMIT = parseInt(process.env.LLM_RATE_LIMIT_RPM) || 40;
const BURST_LIMIT = parseInt(process.env.LLM_RATE_LIMIT_BURST) || 10;

/**
 * Bottleneck limiter for OpenRouter API calls
 * - 40 requests per minute (conservative under 50 RPM limit)
 * - Burst of 10 for handling brief spikes
 * - Queues requests instead of dropping them
 */
export const llmLimiter = new Bottleneck({
  reservoir: BURST_LIMIT,           // Initial burst capacity
  reservoirRefreshAmount: BURST_LIMIT, // Refill amount
  reservoirRefreshInterval: 60 * 1000, // Refill every minute (ms)
  maxConcurrent: 3,                 // Max concurrent requests
  minTime: 1500,                    // Minimum time between requests (ms) ~40 RPM
  strategy: Bottleneck.strategy.LEAK, // Queue overflow instead of dropping
});

// Track usage for monitoring
let requestCount = 0;
let windowStart = Date.now();

/**
 * Wrapper to call LLM with rate limiting and monitoring
 * @param {Function} fn - Async function that makes the LLM call
 * @returns {Promise<any>} Result of the LLM call
 */
export async function callWithLimit(fn) {
  return llmLimiter.schedule(async () => {
    // Update rolling window counter
    const now = Date.now();
    if (now - windowStart >= 60000) {
      windowStart = now;
      requestCount = 0;
    }
    requestCount++;

    try {
      const result = await fn();
      return result;
    } catch (error) {
      // Re-throw to let caller handle
      throw error;
    }
  });
}

/**
 * Get current LLM usage statistics
 * @returns {Object} Usage stats
 */
export function getUsageStats() {
  const now = Date.now();
  const windowElapsed = (now - windowStart) / 1000; // seconds
  const requestsPerMinute = windowElapsed > 0 ? (requestCount / windowElapsed) * 60 : 0;

  return {
    currentWindowRequests: requestCount,
    windowElapsedSeconds: Math.round(windowElapsed),
    requestsPerMinute: Math.round(requestsPerMinute * 10) / 10,
    limitRPM: RPM_LIMIT,
    burstLimit: BURST_LIMIT,
    queueLength: llmLimiter.running() + llmLimiter.queued(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if we're approaching rate limit
 * @returns {boolean} True if over 80% of limit
 */
export function isNearLimit() {
  const stats = getUsageStats();
  return stats.requestsPerMinute > RPM_LIMIT * 0.8;
}

/**
 * Wait for rate limit to clear (for testing)
 * @returns {Promise<void>}
 */
export async function waitForCapacity() {
  while (isNearLimit()) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export default llmLimiter;