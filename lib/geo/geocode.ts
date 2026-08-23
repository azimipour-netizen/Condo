/**
 * Postal-code geolocation for AMPRE listings — no external API, no billing risk.
 * AMPRE provides no Latitude/Longitude; we derive coordinates from PostalCode.
 *
 * Two tiers:
 *  1. Exact postal code, from coordinates already resolved and stored on a
 *     Property row (see primeGeocodeCache). This is where the vast majority
 *     of lookups land after the first full sync — free forever, since it's
 *     data we already have.
 *  2. Forward Sortation Area (the postal code's first 3 characters) centroid,
 *     from a bundled free dataset (GeoNames, public domain / CC-BY 4.0),
 *     covering every FSA in Canada. Used only for a postal code we have never
 *     seen before — new listings in already-covered neighbourhoods, mostly.
 *     A small deterministic offset spreads listings sharing an FSA instead of
 *     stacking them on one identical point.
 *
 * This replaced the Google Geocoding API after repeated MLS sync restarts
 * (each one losing the in-process cache) ran up unpredictable API billing.
 */

import fsaCentroids from './data/fsa-centroids.json'

const FSA_CENTROIDS = fsaCentroids as unknown as Record<string, [number, number]>

// In-process cache keyed by full postal code (reset on cold start, refilled by
// primeGeocodeCache from the database at the start of every sync run).
const cache = new Map<string, { lat: number; lng: number } | null>()

/**
 * Seed the cache from coordinates already stored on Property rows. A sync
 * that restarts would otherwise treat every postal code as new, which is
 * exactly what turned a handful of sync crashes into a large, unnecessary
 * geocoding bill under the old Google-backed implementation. With no
 * external API left to call, priming still matters: it's what makes
 * previously-seen postal codes resolve at full precision instead of
 * falling back to the coarser FSA centroid.
 */
export function primeGeocodeCache(
  rows: Array<{ postalCode: string | null; latitude: unknown; longitude: unknown }>,
): number {
  let added = 0
  for (const r of rows) {
    if (!r.postalCode) continue
    const key = r.postalCode.replace(/\s/g, '').toUpperCase()
    if (cache.has(key)) continue
    const lat = Number(r.latitude)
    const lng = Number(r.longitude)
    if (!isFinite(lat) || !isFinite(lng)) continue
    cache.set(key, { lat, lng })
    added++
  }
  return added
}

/** Stable small offset so postal codes sharing one FSA don't stack exactly. */
function jitter(seed: string): { dLat: number; dLng: number } {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  // ±0.008° is roughly ±800m at GTA latitudes — enough to separate pins
  // within a neighbourhood without wandering into the next one.
  const dLat = ((h % 1000) / 1000 - 0.5) * 0.016
  const dLng = (((h >> 10) % 1000) / 1000 - 0.5) * 0.016
  return { dLat, dLng }
}

export async function geocodePostalCode(
  postalCode: string,
  _city: string,
): Promise<{ lat: number; lng: number } | null> {
  if (!postalCode) return null

  const key = postalCode.replace(/\s/g, '').toUpperCase()
  if (cache.has(key)) return cache.get(key)!

  const fsa = key.slice(0, 3)
  const centroid = FSA_CENTROIDS[fsa]
  if (!centroid) {
    cache.set(key, null)
    return null
  }

  const { dLat, dLng } = jitter(key)
  const result = { lat: centroid[0] + dLat, lng: centroid[1] + dLng }
  cache.set(key, result)
  return result
}

/** Resolve multiple postal codes. Kept async for call-site compatibility —
 * lookups are pure local computation now, so this resolves immediately. */
export async function geocodeBatch(
  items: Array<{ postalCode: string | null; city: string }>,
): Promise<Array<{ lat: number; lng: number } | null>> {
  return Promise.all(
    items.map(item => item.postalCode ? geocodePostalCode(item.postalCode, item.city) : Promise.resolve(null)),
  )
}
