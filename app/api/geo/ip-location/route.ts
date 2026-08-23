import { NextRequest, NextResponse } from 'next/server'
import { getIP, ratelimit, rateLimitResponse } from '@/lib/ratelimit'

/**
 * Silent IP-based geolocation for the map's default view. No permission
 * prompt — unlike navigator.geolocation, this resolves immediately so the
 * map can open centered on the visitor's area instead of the whole province.
 * Precision is city-level, which is exactly what an initial map view needs.
 */

interface GeoResult { lat: number; lng: number; city: string | null }

const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const cache = new Map<string, { data: GeoResult | null; expiresAt: number }>()

function isPrivateIP(ip: string): boolean {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') return true
  return /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(ip)
}

async function lookup(ip: string): Promise<GeoResult | null> {
  // Primary: ipwho.is — HTTPS, no key, generous free limits.
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(1500) })
    if (res.ok) {
      const d = await res.json()
      if (d.success !== false && typeof d.latitude === 'number' && typeof d.longitude === 'number') {
        return { lat: d.latitude, lng: d.longitude, city: d.city ?? null }
      }
    }
  } catch { /* fall through to secondary */ }

  // Fallback: ip-api.com — HTTP only on the free tier, fine for a server-side call.
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,lat,lon,city`, {
      signal: AbortSignal.timeout(1500),
    })
    if (res.ok) {
      const d = await res.json()
      if (d.status === 'success' && typeof d.lat === 'number' && typeof d.lon === 'number') {
        return { lat: d.lat, lng: d.lon, city: d.city ?? null }
      }
    }
  } catch { /* both failed — caller falls back to a fixed default */ }

  return null
}

export async function GET(req: NextRequest) {
  const ip = getIP(req)

  const rl = ratelimit(`geo-ip:${ip}`, 20, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  if (isPrivateIP(ip)) {
    return NextResponse.json({ lat: null, lng: null, city: null })
  }

  const cached = cache.get(ip)
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data ?? { lat: null, lng: null, city: null })
  }

  const data = await lookup(ip)
  cache.set(ip, { data, expiresAt: Date.now() + CACHE_TTL_MS })

  return NextResponse.json(data ?? { lat: null, lng: null, city: null })
}
