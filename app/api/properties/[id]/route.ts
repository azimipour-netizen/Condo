import { NextRequest, NextResponse } from 'next/server'
import { getMLSAdapter } from '@/lib/mls/adapter'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = ratelimit(`property:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const { id } = await params
  try {
    const adapter = getMLSAdapter()
    const property = await adapter.getListing(id)

    if (!property) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (err) {
    console.error(`[/api/properties/${id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
