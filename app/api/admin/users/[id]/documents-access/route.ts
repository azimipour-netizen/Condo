import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session.user as any).role
  if (role !== 'agent' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { unlocked } = await req.json()

  try {
    const updated = await (db as any).user.update({
      where: { id },
      data: { documentsUnlocked: Boolean(unlocked) },
      select: { id: true, documentsUnlocked: true },
    })
    return NextResponse.json({ user: updated })
  } catch {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
}
