import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = ratelimit(`openhouses:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const { id: propertyId } = await params
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openHouses = await (db as any).openHouse.findMany({
      where: { propertyId, startsAt: { gte: new Date() } },
      orderBy: { startsAt: 'asc' },
    })
    return NextResponse.json({ openHouses })
  } catch {
    return NextResponse.json({ openHouses: [] })
  }
}
