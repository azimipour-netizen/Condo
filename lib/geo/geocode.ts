/**
 * Lightweight Google Maps Geocoding for AMPRE listings.
 * AMPRE provides no Latitude/Longitude — we derive coordinates from PostalCode.
 * Canadian postal codes are precise enough for map pin placement (~half-block radius).
 */

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''

// In-process cache keyed by postal code (reset on cold start)
const cache = new Map<string, { lat: number; lng: number } | null>()

export async function geocodePostalCode(
  postalCode: string,
  city: string,
): Promise<{ lat: number; lng: number } | null> {
  if (!API_KEY || !postalCode) return null

  const key = postalCode.replace(/\s/g, '').toUpperCase()
  if (cache.has(key)) return cache.get(key)!

  try {
    const q = encodeURIComponent(`${key} ${city} Canada`)
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${q}&key=${API_KEY}`,
      { next: { revalidate: 86400 } },
    )
    if (!res.ok) { cache.set(key, null); return null }
    const data = await res.json()
    const loc = data.results?.[0]?.geometry?.location
    if (!loc) { cache.set(key, null); return null }
    const result = { lat: loc.lat, lng: loc.lng }
    cache.set(key, result)
    return result
  } catch {
    cache.set(key, null)
    return null
  }
}

/** Geocode multiple postal codes in parallel, up to concurrency limit */
export async function geocodeBatch(
  items: Array<{ postalCode: string | null; city: string }>,
  concurrency = 8,
): Promise<Array<{ lat: number; lng: number } | null>> {
  const results: Array<{ lat: number; lng: number } | null> = new Array(items.length).fill(null)
  const queue = items.map((item, i) => ({ item, i }))

  async function worker() {
    while (queue.length > 0) {
      const entry = queue.shift()
      if (!entry) break
      const { item, i } = entry
      if (item.postalCode) {
        results[i] = await geocodePostalCode(item.postalCode, item.city)
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))
  return results
}
