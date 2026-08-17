import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = ratelimit(`pricehistory:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const { id } = await params
  try {
    const history = await (db as any).priceHistory.findMany({
      where: { propertyId: id },
      orderBy: { recordedAt: 'asc' },
      select: { price: true, recordedAt: true },
    })

    // If no recorded history, seed from current property price
    if (history.length === 0) {
      const prop = await (db as any).property.findUnique({
        where: { id },
        select: { price: true, listedAt: true },
      })
      if (prop) {
        await (db as any).priceHistory.create({
          data: { propertyId: id, price: prop.price, recordedAt: prop.listedAt },
        }).catch(() => {})
        return NextResponse.json([{ price: Number(prop.price), recordedAt: prop.listedAt }])
      }
    }

    return NextResponse.json(history.map((h: any) => ({ price: Number(h.price), recordedAt: h.recordedAt })))
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
