import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (db as any).openHouse.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
