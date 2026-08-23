import { NextRequest, NextResponse } from 'next/server'
import { getMLSAdapter } from '@/lib/mls/adapter'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = ratelimit(`property-rooms:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = getMLSAdapter() as any

  if (typeof adapter.getPropertyRooms !== 'function') {
    return NextResponse.json([])
  }

  try {
    const rooms = await adapter.getPropertyRooms(id)
    return NextResponse.json(rooms, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch (err) {
    console.error('[/api/properties/[id]/rooms]', err)
    return NextResponse.json([])
  }
}
