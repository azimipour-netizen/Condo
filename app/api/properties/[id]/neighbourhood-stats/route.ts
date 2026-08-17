import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = ratelimit(`nbhd:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const { id } = await params
  try {
    const property = await (db as any).property.findUnique({
      where: { id },
      select: { neighbourhood: true, city: true, propertyType: true },
    })
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const where: Record<string, unknown> = {
      status: 'active',
      city: property.city,
      propertyType: property.propertyType,
      id: { not: id },
    }
    if (property.neighbourhood) where.neighbourhood = property.neighbourhood

    const [agg, count] = await Promise.all([
      (db as any).property.aggregate({ where, _avg: { price: true }, _min: { price: true }, _max: { price: true } }),
      (db as any).property.count({ where }),
    ])

    return NextResponse.json({
      neighbourhood: property.neighbourhood ?? property.city,
      count,
      avgPrice: agg._avg.price ? Number(agg._avg.price) : null,
      minPrice: agg._min.price ? Number(agg._min.price) : null,
      maxPrice: agg._max.price ? Number(agg._max.price) : null,
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
