import type { SearchFilters } from '@/types/search'

/**
 * Caches the *parsed filters* Claude extracted from a query the deterministic
 * parser (lib/search/parse-query.ts) couldn't resolve on its own — never the
 * listing results, which go stale as the sync cron runs. Search queries
 * cluster hard on text ("2 bed condo north york", "condo for rent midtown
 * toronto"), so once one user's phrasing has been parsed, every later user
 * who types the same thing skips the Claude call entirely and goes straight
 * to the DB query.
 *
 * In-memory Map, matching lib/ratelimit.ts's pattern — the app runs as a
 * single pm2 process (see VPS config), so there's no cross-instance
 * consistency to worry about, and this avoids a DB table or Redis for what
 * is deliberately disposable data: worst case on a miss is one extra Claude
 * call, exactly like before this cache existed.
 *
 * Bounded by count (LRU-ish via re-insertion on hit), not a background timer:
 * a fixed cap is a simpler ceiling on memory than track-and-sweep, and hit
 * queries naturally survive eviction by getting pushed back to the front.
 */

const MAX_ENTRIES = 2000
const TTL_MS = 6 * 60 * 60 * 1000 // 6h — long enough to matter, short enough that a schema/logic change (redeploy restarts the process anyway) can't linger stale for days

interface Entry {
  filters: SearchFilters
  expiresAt: number
}

const cache = new Map<string, Entry>()

/**
 * Normalizes so trivial phrasing differences still hit: case, punctuation,
 * and repeated whitespace don't change what should be searched. Word ORDER
 * is preserved deliberately — "condo for rent" and "rent for condo" are not
 * guaranteed to parse the same way, so collapsing order risks a false hit
 * returning the wrong filters for a differently-phrased query.
 */
export function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getCachedFilters(query: string): SearchFilters | null {
  const key = normalizeQuery(query)
  if (!key) return null
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() >= entry.expiresAt) {
    cache.delete(key)
    return null
  }
  // Re-insert to mark as recently used (Map preserves insertion order, so
  // this pushes it to the back of the eviction queue).
  cache.delete(key)
  cache.set(key, entry)
  return entry.filters
}

export function setCachedFilters(query: string, filters: SearchFilters): void {
  const key = normalizeQuery(query)
  if (!key) return

  if (cache.size >= MAX_ENTRIES && !cache.has(key)) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }

  cache.set(key, { filters, expiresAt: Date.now() + TTL_MS })
}
