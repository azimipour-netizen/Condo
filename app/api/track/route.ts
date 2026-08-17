import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  const rl = ratelimit(`track:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)
  try {
    const { path, propertyId, sessionId } = await req.json()
    if (!path) return NextResponse.json({ ok: false }, { status: 400 })

    await (db as any).pageView.create({
      data: { path, propertyId: propertyId ?? null, sessionId: sessionId ?? null },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
