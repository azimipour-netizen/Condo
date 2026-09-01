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
    /**
     * Exact Property.city values to match, for places that have no single
     * literal city value. Toronto's former boroughs are split across district
     * codes in the feed ("Toronto C06", "Toronto C14"...), so North York can
     * only be searched precisely by listing them - matching `startsWith
     * 'Toronto'` instead returns the whole city.
     */
    cityValues?: string[]
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
  /**
   * Free-text phrases matched against the listing's description and title.
   * Every keyword must appear (AND); each may match either field. This is what
   * makes agent-speak like "motivated seller", "power of sale", or "as is"
   * searchable — none of it exists as a structured field.
   */
  keywords?: string[]
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
