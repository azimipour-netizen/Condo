import type { IMLSAdapter } from '../types'
import type { Property, PropertySummary } from '@/types/property'
import type { SearchFilters, SearchResult } from '@/types/search'
import { MOCK_PROPERTIES } from './mock-data'

/**
 * Mock MLS adapter — Phase 1–3 development only.
 * Swap for a real provider adapter in Phase 4.
 */
export class MockMLSAdapter implements IMLSAdapter {
  readonly name = 'mock'

  async searchListings(filters: SearchFilters, page = 1, limit = 20): Promise<SearchResult> {
    await simulateLatency()

    let results = [...MOCK_PROPERTIES]

    // Price filter
    if (filters.priceMax) results = results.filter(p => p.price <= filters.priceMax!)
    if (filters.priceMin) results = results.filter(p => p.price >= filters.priceMin!)

    // Bedroom filter
    if (filters.bedroomsMin) results = results.filter(p => p.bedrooms >= filters.bedroomsMin!)

    // Property type filter
    if (filters.propertyTypes?.length) {
      results = results.filter(p => filters.propertyTypes!.includes(p.propertyType))
    }

    // Parking filter
    if (filters.hasParking) results = results.filter(p => p.parkingSpaces > 0)

    // Neighbourhood / city text filter
    if (filters.location?.type === 'neighbourhood' && filters.location.value) {
      const q = filters.location.value.toLowerCase()
      results = results.filter(p =>
        p.location.neighbourhood?.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q)
      )
    }

    // Bounding box filter (viewport-based search)
    const bbox = filters.bbox ?? filters.location?.bbox
    if (bbox && filters.location?.type === 'bbox') {
      results = results.filter(p => {
        const lat = Number(p.location.latitude)
        const lng = Number(p.location.longitude)
        return lat >= bbox.south && lat <= bbox.north && lng >= bbox.west && lng <= bbox.east
      })
    }

    const total = results.length
    const start = (page - 1) * limit
    const pageResults = results.slice(start, start + limit)

    return {
      properties: pageResults.map(toSummary),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      appliedFilters: filters,
    }
  }

  async getListing(id: string): Promise<Property | null> {
    await simulateLatency()
    return MOCK_PROPERTIES.find(p => p.id === id || p.listingId === id) ?? null
  }

  async getUpdatedListings(_since: Date): Promise<Property[]> {
    return MOCK_PROPERTIES
  }

  async ping(): Promise<boolean> {
    return true
  }
}

function toSummary(p: Property): PropertySummary {
  return {
    id: p.id, status: p.status, transactionType: p.transactionType, price: p.price,
    propertyType: p.propertyType, bedrooms: p.bedrooms, bathroomsTotal: p.bathroomsTotal,
    parkingSpaces: p.parkingSpaces, sqft: p.sqft, sqftRange: p.sqftRange, lotSize: p.lotSize,
    crossStreet: p.crossStreet, yearBuilt: p.yearBuilt,
    maintenanceFee: p.maintenanceFee, taxes: p.taxes, title: p.title,
    description: p.description, features: p.features,
    location: p.location, thumbnail: p.images[0]?.url ?? null,
    listedAt: p.listedAt, updatedAt: p.updatedAt,
  }
}

async function simulateLatency() {
  await new Promise(r => setTimeout(r, 120 + Math.random() * 180))
}
