export type PropertyStatus = 'active' | 'sold' | 'terminated' | 'expired' | 'suspended'
export type PropertyType = 'detached' | 'semi-detached' | 'townhouse' | 'condo' | 'multiplex' | 'vacant_land' | 'commercial'
export type LocationDisplayMode = 'exact' | 'approximate' | 'neighbourhood' | 'hidden'

export interface PropertyLocation {
  latitude: number | null
  longitude: number | null
  displayMode: LocationDisplayMode
  address: string | null
  neighbourhood: string | null
  city: string
  province: string
  postalCode: string | null
}

export interface Property {
  id: string
  listingId: string
  status: PropertyStatus
  transactionType: 'sale' | 'lease'
  price: number
  propertyType: PropertyType
  bedrooms: number
  bathroomsTotal: number
  parkingSpaces: number
  sqft: number | null
  /** Bucketed range ("3500-5000", "5000 +") — AMPRE's LivingAreaRange, the
   * only size info available when exact BuildingAreaTotal isn't reported
   * (the norm for residential freehold listings). Display fallback only. */
  sqftRange: string | null
  lotSize: string | null
  yearBuilt: number | null
  maintenanceFee: number | null
  taxes: number | null
  title: string
  description: string
  features: string[]
  location: PropertyLocation
  images: PropertyImage[]
  virtualTourUrl?: string | null
  listedAt: string
  updatedAt: string
  // Additional TRREB/AMPRE fields
  rooms: number | null
  kitchens: number | null
  basement: string | null
  crossStreet: string | null
  daysOnMarket: number | null
}

export interface PropertyImage {
  url: string
  order: number
  alt: string | null
}

export interface PropertySummary {
  id: string
  status: PropertyStatus
  transactionType: 'sale' | 'lease'
  price: number
  propertyType: PropertyType
  bedrooms: number
  bathroomsTotal: number
  parkingSpaces: number
  sqft: number | null
  sqftRange: string | null
  lotSize: string | null
  yearBuilt: number | null
  maintenanceFee: number | null
  taxes: number | null
  /** The two nearest cross streets, e.g. "Yonge St/Sheppard Ave". Included on
   * the summary (not just the full Property) so the AI assistant's search
   * results can verify proximity to a named intersection instead of
   * guessing from the street name alone. */
  crossStreet: string | null
  title: string
  description: string
  features: string[]
  location: PropertyLocation
  thumbnail: string | null
  listedAt?: string | null
  updatedAt?: string | null
}
