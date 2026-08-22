import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

const QuerySchema = z.object({
  north: z.coerce.number(),
  south: z.coerce.number(),
  east:  z.coerce.number(),
  west:  z.coerce.number(),
  // Which set of listings the map is showing. Defaults to for-sale.
  listingType:  z.enum(['sale', 'lease', 'sold']).optional(),
  // Sold only: how far back to look, in days.
  soldWithinDays: z.coerce.number().int().min(1).max(3650).optional(),
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
    const listingType = q.listingType ?? 'sale'

    // Sold prices come from the VOW feed, which TRREB restricts to registered
    // users. Anonymous visitors asking for sold get an empty set, not a 401 —
    // the map should still render while the UI prompts them to sign in.
    let signedIn = false
    if (listingType === 'sold') {
      const session = await auth()
      signedIn = !!session?.user?.id
      if (!signedIn) {
        return NextResponse.json([], {
          headers: { 'Cache-Control': 'private, no-store', 'X-Requires-Auth': '1' },
        })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      latitude:  { gte: q.south, lte: q.north },
      longitude: { gte: q.west,  lte: q.east  },
    }

    if (listingType === 'sold') {
      where.status = 'sold'
      // Default to the last 30 days so the tab opens on recent activity rather
      // than every sale we hold.
      const days = q.soldWithinDays ?? 30
      where.soldDate = { gte: new Date(Date.now() - days * 86_400_000) }
    } else {
      where.status = 'active'
      where.transactionType = listingType // 'sale' | 'lease'
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
        soldPrice:      true,
        soldDate:       true,
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
      take:    10000,
      orderBy: listingType === 'sold' ? { soldDate: 'desc' } : { listedAt: 'desc' },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pins = rows.map((r: any) => ({
      id:             r.id,
      listingId:      r.listingId,
      lat:            Number(r.latitude),
      lng:            Number(r.longitude),
      // A sold pin shows what it actually sold for, falling back to list price
      // when the feed left ClosePrice empty.
      price:          Number(listingType === 'sold' ? (r.soldPrice ?? r.price) : r.price),
      soldDate:       listingType === 'sold' ? (r.soldDate ?? null) : null,
      listingType,
      bedrooms:       r.bedrooms,
      bathroomsTotal: Number(r.bathroomsTotal),
      sqft:           r.sqft ?? null,
      address:        r.address ?? null,
      neighbourhood:  r.neighbourhood ?? null,
      city:           r.city,
      thumbnail:      r.images[0]?.url ?? null,
    }))

    return NextResponse.json(pins, {
      headers: listingType === 'sold'
        ? { 'Cache-Control': 'private, no-store' }
        : { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Missing bbox params' }, { status: 400 })
    }
    console.error('[/api/properties/map-pins]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
