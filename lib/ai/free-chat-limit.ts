/**
 * Anonymous AI-chat allowance: a fixed number of free searches per visitor
 * before the AI assistant requires an account. Classic filter/map search
 * (/search) stays unlimited and unauthenticated — this gates only the AI
 * chat, which is the expensive, Claude-backed surface.
 *
 * In-memory Map, keyed by IP, matching lib/ratelimit.ts's pattern (the app
 * runs a single pm2 process, so no cross-instance state is needed). Unlike
 * the per-minute rate limiter, this is deliberately NOT a short rolling
 * window — resetting daily would let a visitor dodge the login requirement
 * indefinitely just by waiting a day, defeating the point of the gate. The
 * long TTL here exists only to bound memory and avoid permanently
 * penalizing an IP that gets reassigned to a different visitor months
 * later, not to give anyone a fresh allowance on a normal timescale.
 */

export const FREE_CHAT_LIMIT = 3
const TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days — a memory bound, not a "reset"

interface Entry { count: number; expiresAt: number }
const store = new Map<string, Entry>()

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now >= entry.expiresAt) store.delete(key)
    }
  }, 60 * 60 * 1000)
}

export function checkFreeChatLimit(ip: string): { allowed: boolean; used: number } {
  const entry = store.get(ip)
  if (!entry || Date.now() >= entry.expiresAt) {
    return { allowed: true, used: 0 }
  }
  return { allowed: entry.count < FREE_CHAT_LIMIT, used: entry.count }
}

/** Call once per new anonymous chat that passes the gate — counts the attempt, not just successes. */
export function recordFreeChat(ip: string): void {
  const entry = store.get(ip)
  if (!entry || Date.now() >= entry.expiresAt) {
    store.set(ip, { count: 1, expiresAt: Date.now() + TTL_MS })
    return
  }
  entry.count++
}
