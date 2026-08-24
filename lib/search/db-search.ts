import { db } from '@/lib/db'
import type { SearchFilters, SearchResult } from '@/types/search'
import type { PropertySummary } from '@/types/property'

/**
 * DB-backed equivalent of PropTxAdapter.searchListings(). The AMPRE-backed
 * version hits a live external OData API and geocodes every result on the
 * fly — each search round-trips to query.ampre.ca plus a geocoder call per
 * row, which is most of the AI assistant's response latency. This queries
 * the already-synced local Postgres copy instead: same data (kept fresh by
 * the incremental sync cron), indexed, no external network hop, no
 * per-request geocoding since sync already stored lat/lng.
 */

// Pre-amalgamation Toronto boroughs aren't a literal Property.city value —
// AMPRE splits Toronto into district codes ("Toronto C06"...). Mirrors the
// same fallback used in PropTxAdapter.buildFilter().
const LEGACY_TORONTO_BOROUGHS = new Set(['north york', 'etobicoke', 'scarborough', 'east york', 'toronto'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function locationWhere(loc: SearchFilters['location']): Record<string, any> {
  if (!loc) return {}

  if (loc.type === 'city' && loc.value) {
    return LEGACY_TORONTO_BOROUGHS.has(loc.value.toLowerCase())
      ? { city: { startsWith: 'Toronto' } }
      : { city: { equals: loc.value, mode: 'insensitive' } }
  }

  if (loc.type === 'neighbourhood' && loc.value) {
    return {
      OR: [
        { neighbourhood: { contains: loc.value, mode: 'insensitive' } },
        { city: { contains: loc.value, mode: 'insensitive' } },
      ],
    }
  }

  if (loc.type === 'intersection' && loc.value) {
    const streets = loc.value
      .split(/\s+(?:and|&|\/|at|@)\s+/i)
      .map(s => s.trim())
      .filter(Boolean)
    if (streets.length === 0) return {}
    return {
      OR: streets.flatMap(s => [
        { crossStreet: { contains: s, mode: 'insensitive' } },
        { address: { contains: s, mode: 'insensitive' } },
      ]),
    }
  }

  if (loc.type === 'bbox' && loc.bbox) {
    return {
      latitude: { gte: loc.bbox.south, lte: loc.bbox.north },
      longitude: { gte: loc.bbox.west, lte: loc.bbox.east },
    }
  }

  if (loc.type === 'radius' && loc.center && loc.radiusKm) {
    const dLat = loc.radiusKm / 111
    const dLng = loc.radiusKm / (111 * Math.cos((loc.center.latitude * Math.PI) / 180))
    return {
      latitude: { gte: loc.center.latitude - dLat, lte: loc.center.latitude + dLat },
      longitude: { gte: loc.center.longitude - dLng, lte: loc.center.longitude + dLng },
    }
  }

  return {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSummary(r: any): PropertySummary {
  return {
    id: r.listingId,
    status: r.status,
    transactionType: r.transactionType,
    price: Number(r.price),
    propertyType: r.propertyType.replace('_', '-'),
    bedrooms: r.bedrooms,
    bathroomsTotal: Number(r.bathroomsTotal),
    parkingSpaces: r.parkingSpaces,
    sqft: r.sqft,
    sqftRange: r.sqftRange,
    lotSize: r.lotSize,
    crossStreet: r.crossStreet,
    yearBuilt: r.yearBuilt,
    maintenanceFee: r.maintenanceFee ? Number(r.maintenanceFee) : null,
    taxes: r.taxes ? Number(r.taxes) : null,
    title: r.title,
    description: r.description,
    features: r.features,
    location: {
      latitude: r.latitude ? Number(r.latitude) : null,
      longitude: r.longitude ? Number(r.longitude) : null,
      displayMode: r.displayMode,
      address: r.address,
      neighbourhood: r.neighbourhood,
      city: r.city,
      province: r.province,
      postalCode: r.postalCode,
    },
    thumbnail: r.images[0]?.url ?? null,
    listedAt: r.listedAt?.toISOString() ?? null,
    updatedAt: r.updatedAt?.toISOString() ?? null,
  }
}

export async function searchListingsDb(filters: SearchFilters, page = 1, limit = 20): Promise<SearchResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {
    status: 'active',
    transactionType: filters.transactionType ?? 'sale',
  }

  if (filters.priceMin) where.price = { ...where.price, gte: filters.priceMin }
  if (filters.priceMax) where.price = { ...where.price, lte: filters.priceMax }
  if (filters.bedroomsMin) where.bedrooms = { ...where.bedrooms, gte: filters.bedroomsMin }
  if (filters.bedroomsMax) where.bedrooms = { ...where.bedrooms, lte: filters.bedroomsMax }
  if (filters.bathroomsMin) where.bathroomsTotal = { gte: filters.bathroomsMin }
  if (filters.parkingMin || filters.hasParking) where.parkingSpaces = { gte: filters.parkingMin ?? 1 }
  if (filters.sqftMin) where.sqft = { ...where.sqft, gte: filters.sqftMin }
  if (filters.sqftMax) where.sqft = { ...where.sqft, lte: filters.sqftMax }
  if (filters.propertyTypes?.length) {
    where.propertyType = { in: filters.propertyTypes.map(t => t.replace('-', '_')) }
  }

  Object.assign(where, locationWhere(filters.location))

  const select = {
    listingId: true, status: true, transactionType: true, price: true,
    propertyType: true, bedrooms: true, bathroomsTotal: true, parkingSpaces: true,
    sqft: true, sqftRange: true, lotSize: true, crossStreet: true, yearBuilt: true,
    maintenanceFee: true, taxes: true, title: true, description: true, features: true,
    latitude: true, longitude: true, displayMode: true, address: true, neighbourhood: true,
    city: true, province: true, postalCode: true, listedAt: true, updatedAt: true,
    images: { select: { url: true }, orderBy: { order: 'asc' as const }, take: 1 },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, total] = await Promise.all([
    (db as any).property.findMany({
      where,
      select,
      orderBy: { listedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    (db as any).property.count({ where }),
  ])

  return {
    properties: rows.map(toSummary),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    appliedFilters: filters,
  }
}
