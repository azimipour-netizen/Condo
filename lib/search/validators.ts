import { z } from 'zod'
import type { SearchFilters } from '@/types/search'

const PropertyTypeSchema = z.enum([
  'detached', 'semi-detached', 'townhouse', 'condo', 'multiplex', 'vacant_land', 'commercial',
])

const GeoPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

const BoundingBoxSchema = z.object({
  north: z.number(),
  south: z.number(),
  east: z.number(),
  west: z.number(),
})

const LocationSchema = z.object({
  type: z.enum(['city', 'neighbourhood', 'intersection', 'bbox', 'radius']),
  value: z.string().max(200).optional(),
  center: GeoPointSchema.optional(),
  radiusKm: z.number().min(0.1).max(50).optional(),
  bbox: BoundingBoxSchema.optional(),
})

export const SearchFiltersSchema = z.object({
  location: LocationSchema.optional(),
  propertyTypes: z.array(PropertyTypeSchema).max(7).optional(),
  priceMin: z.number().min(0).max(100_000_000).optional(),
  priceMax: z.number().min(0).max(100_000_000).optional(),
  bedroomsMin: z.number().min(0).max(20).optional(),
  bedroomsMax: z.number().min(0).max(20).optional(),
  bathroomsMin: z.number().min(0).max(20).optional(),
  parkingMin: z.number().min(0).max(20).optional(),
  sqftMin: z.number().min(0).max(50_000).optional(),
  sqftMax: z.number().min(0).max(50_000).optional(),
  hasParking: z.boolean().optional(),
  transactionType: z.enum(['sale', 'lease']).optional(),
  // Free-text phrases matched against description/title. Capped tightly: each
  // keyword becomes its own ILIKE over a large table.
  keywords: z.array(z.string().min(2).max(60)).max(5).optional(),
  preferences: z.array(z.string().max(100)).max(20).optional(),
})

/** Validate AI-generated filter params — never trust raw model output */
export function validateSearchFilters(raw: unknown): SearchFilters {
  return SearchFiltersSchema.parse(raw)
}
