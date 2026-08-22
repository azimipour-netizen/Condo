import type { PropertyType } from './property'

export interface BoundingBox {
  north: number
  south: number
  east: number
  west: number
}

export interface GeoPoint {
  latitude: number
  longitude: number
}

export interface SearchFilters {
  location?: {
    type: 'city' | 'neighbourhood' | 'intersection' | 'bbox' | 'radius'
    value?: string
    center?: GeoPoint
    radiusKm?: number
    bbox?: BoundingBox
  }
  bbox?: BoundingBox
  propertyTypes?: PropertyType[]
  priceMin?: number
  priceMax?: number
  bedroomsMin?: number
  bedroomsMax?: number
  bathroomsMin?: number
  parkingMin?: number
  sqftMin?: number
  sqftMax?: number
  hasParking?: boolean
  /** 'sale' (default) or 'lease'. Sold listings are served from the DB, not here. */
  transactionType?: 'sale' | 'lease'
  preferences?: string[]
}

export interface SearchParams extends SearchFilters {
  page?: number
  limit?: number
  sortBy?: 'price_asc' | 'price_desc' | 'listed_desc' | 'bedrooms_desc'
}

export interface SearchResult {
  properties: import('./property').PropertySummary[]
  total: number
  page: number
  totalPages: number
  appliedFilters: SearchFilters
}
