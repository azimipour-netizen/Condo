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
}

export interface PropertyImage {
  url: string
  order: number
  alt: string | null
}

export interface PropertySummary {
  id: string
  status: PropertyStatus
  price: number
  propertyType: PropertyType
  bedrooms: number
  bathroomsTotal: number
  parkingSpaces: number
  sqft: number | null
  title: string
  location: PropertyLocation
  thumbnail: string | null
  listedAt?: string | null
}
