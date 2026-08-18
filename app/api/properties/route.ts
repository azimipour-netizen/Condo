import { NextRequest, NextResponse } from 'next/server'
import { getMLSAdapter } from '@/lib/mls/adapter'
import { validateSearchFilters } from '@/lib/search/validators'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'
import { z } from 'zod'

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  bedroomsMin: z.coerce.number().optional(),
  bathroomsMin: z.coerce.number().optional(),
  hasParking: z.coerce.boolean().optional(),
  propertyType: z.string().optional(),
  neighbourhood: z.string().optional(),
  city: z.string().optional(),
  north: z.coerce.number().optional(),
  south: z.coerce.number().optional(),
  east: z.coerce.number().optional(),
  west: z.coerce.number().optional(),
})

export async function GET(req: NextRequest) {
  const rl = ratelimit(`properties:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries())
    const q = QuerySchema.parse(params)

    const filters = validateSearchFilters({
      ...(q.priceMin && { priceMin: q.priceMin }),
      ...(q.priceMax && { priceMax: q.priceMax }),
      ...(q.bedroomsMin && { bedroomsMin: q.bedroomsMin }),
      ...(q.bathroomsMin && { bathroomsMin: q.bathroomsMin }),
      ...(q.hasParking && { hasParking: true }),
      ...(q.propertyType && { propertyTypes: [q.propertyType] }),
      ...(q.neighbourhood && { location: { type: 'neighbourhood', value: q.neighbourhood } }),
      ...(q.north && q.south && q.east && q.west && {
        location: { type: 'bbox', bbox: { north: q.north, south: q.south, east: q.east, west: q.west } },
      }),
    })

    const adapter = getMLSAdapter()
    const result = await adapter.searchListings(filters, q.page, q.limit)

    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', issues: err.issues }, { status: 400 })
    }
    console.error('[/api/properties]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
