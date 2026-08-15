import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ ids: [] })
  try {
    const rows = await (db as any).savedProperty.findMany({
      where: { userId: session.user.id },
      select: { propertyId: true },
    })
    return NextResponse.json({ ids: rows.map((r: any) => r.propertyId) })
  } catch {
    return NextResponse.json({ ids: [] })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { propertyId } = await req.json()
  if (!propertyId) return NextResponse.json({ error: 'propertyId required' }, { status: 400 })
  try {
    await (db as any).savedProperty.upsert({
      where: { userId_propertyId: { userId: session.user.id, propertyId } },
      create: { userId: session.user.id, propertyId },
      update: {},
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/properties/saved] DB error:', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { propertyId } = await req.json()
  if (!propertyId) return NextResponse.json({ error: 'propertyId required' }, { status: 400 })
  await (db as any).savedProperty.deleteMany({
    where: { userId: session.user.id, propertyId },
  })
  return NextResponse.json({ ok: true })
}
