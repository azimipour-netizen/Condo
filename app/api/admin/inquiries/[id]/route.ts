import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const inquiry = await (db as any).contactInquiry.update({
    where: { id },
    data: { read: true },
  })
  return NextResponse.json({ inquiry })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  await (db as any).contactInquiry.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
