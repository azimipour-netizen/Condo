import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

const QuerySchema = z.object({
  city: z.string().min(1),
  propertyType: z.string().min(1),
  sqft: z.coerce.number().positive().optional(),
  bedroomsMin: z.coerce.number().int().min(0).optional(),
})

const TAKE = 6

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = ratelimit(`comparables:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const { id } = await params

  try {
    const q = QuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()))

    // `id` here is the AMPRE ListingKey (matches the URL convention used by
    // listing-history/rooms) — exclude by the DB's listingId field, not its
    // own UUID primary key, or the current listing could appear in its own
    // comparables if it's also present in our synced DB.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base: any = {
      listingId: { not: id },
      city: q.city,
      propertyType: q.propertyType.replace('-', '_'),
    }
    if (q.sqft) {
      base.sqft = { gte: Math.round(q.sqft * 0.75), lte: Math.round(q.sqft * 1.25) }
    } else if (q.bedroomsMin) {
      base.bedrooms = { gte: q.bedroomsMin }
    }

    const select = {
      id: true, listingId: true, price: true, soldPrice: true, soldDate: true,
      bedrooms: true, bathroomsTotal: true, sqft: true, address: true, neighbourhood: true,
      images: { select: { url: true }, orderBy: { order: 'asc' as const }, take: 1 },
    }

    // Sold prices come from the VOW feed, which TRREB restricts to
    // registered users — same gate as the map's Sold tab and listing-history.
    const session = await auth()
    const signedIn = !!session?.user?.id

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [soldRows, activeRows] = await Promise.all([
      signedIn
        ? (db as any).property.findMany({
            where:   { ...base, status: 'sold' },
            select,
            orderBy: { soldDate: 'desc' },
            take:    TAKE,
          })
        : Promise.resolve([]),
      (db as any).property.findMany({
        where:   { ...base, status: 'active', transactionType: 'sale' },
        select,
        orderBy: { listedAt: 'desc' },
        take:    TAKE,
      }),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape = (rows: any[], sold: boolean) => rows.map(r => ({
      id:            r.id,
      listingId:     r.listingId,
      price:         Number(sold ? (r.soldPrice ?? r.price) : r.price),
      soldDate:      sold ? r.soldDate : null,
      bedrooms:      r.bedrooms,
      bathroomsTotal: Number(r.bathroomsTotal),
      sqft:          r.sqft ?? null,
      address:       r.address ?? null,
      neighbourhood: r.neighbourhood ?? null,
      thumbnail:     r.images[0]?.url ?? null,
    }))

    return NextResponse.json({
      sold: shape(soldRows, true),
      active: shape(activeRows, false),
      soldRequiresAuth: !signedIn,
    }, {
      headers: signedIn
        ? { 'Cache-Control': 'private, no-store' }
        : { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ sold: [], active: [] })
    }
    console.error('[/api/properties/[id]/comparables]', err)
    return NextResponse.json({ sold: [], active: [] })
  }
}
