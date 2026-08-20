import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

const QuerySchema = z.object({
  north: z.coerce.number(),
  south: z.coerce.number(),
  east:  z.coerce.number(),
  west:  z.coerce.number(),
  priceMin:     z.coerce.number().optional(),
  priceMax:     z.coerce.number().optional(),
  bedroomsMin:  z.coerce.number().optional(),
  bathroomsMin: z.coerce.number().optional(),
  propertyType: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const rl = ratelimit(`map-pins:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries())
    const q = QuerySchema.parse(params)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'active',
      transactionType: 'sale',
      latitude:  { gte: q.south, lte: q.north },
      longitude: { gte: q.west,  lte: q.east  },
    }

    if (q.priceMin)     where.price      = { ...where.price,      gte: q.priceMin }
    if (q.priceMax)     where.price      = { ...where.price,      lte: q.priceMax }
    if (q.bedroomsMin)  where.bedrooms   = { gte: q.bedroomsMin }
    if (q.bathroomsMin) where.bathroomsTotal = { gte: q.bathroomsMin }
    if (q.propertyType) where.propertyType   = q.propertyType.replace('-', '_')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (db as any).property.findMany({
      where,
      select: {
        id:             true,
        listingId:      true,
        latitude:       true,
        longitude:      true,
        price:          true,
        bedrooms:       true,
        bathroomsTotal: true,
        sqft:           true,
        address:        true,
        neighbourhood:  true,
        city:           true,
        images: {
          select:   { url: true },
          orderBy:  { order: 'asc' },
          take:     1,
        },
      },
      take:    3000,
      orderBy: { listedAt: 'desc' },
    })

    const pins = rows.map((r: any) => ({
      id:             r.id,
      listingId:      r.listingId,
      lat:            Number(r.latitude),
      lng:            Number(r.longitude),
      price:          Number(r.price),
      bedrooms:       r.bedrooms,
      bathroomsTotal: Number(r.bathroomsTotal),
      sqft:           r.sqft ?? null,
      address:        r.address ?? null,
      neighbourhood:  r.neighbourhood ?? null,
      city:           r.city,
      thumbnail:      r.images[0]?.url ?? null,
    }))

    return NextResponse.json(pins, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Missing bbox params' }, { status: 400 })
    }
    console.error('[/api/properties/map-pins]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
