import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = session.user.role
  const userId = session.user.id

  try {
    let docs: any[]
    if (role === 'agent' || role === 'admin') {
      // Agents see all buyer docs + all agent-side docs they uploaded
      docs = await (db as any).document.findMany({
        orderBy: { uploadedAt: 'desc' },
        include: {
          uploader: { select: { name: true, email: true } },
          receiver: { select: { name: true, email: true } },
        },
      })
    } else {
      // Buyers see their own buyer docs + agent docs addressed to them or broadcast
      docs = await (db as any).document.findMany({
        where: {
          OR: [
            { uploaderId: userId, side: 'buyer' },
            { receiverId: userId, side: 'agent' },
            { receiverId: null, side: 'agent' },
          ],
        },
        orderBy: { uploadedAt: 'desc' },
        include: {
          uploader: { select: { name: true, email: true } },
        },
      })
    }
    return NextResponse.json({ documents: docs })
  } catch {
    return NextResponse.json({ documents: [] })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const doc = await (db as any).document.findUnique({ where: { id } })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (doc.uploaderId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await (db as any).document.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
