import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = session.user.role
  if (role !== 'agent' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const users = await (db as any).user.findMany({
      where: { role: 'consumer' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        documentsUnlocked: true,
        createdAt: true,
        _count: { select: { uploadedDocuments: true } },
      },
    })
    return NextResponse.json({ users })
  } catch {
    return NextResponse.json({ users: [] })
  }
}
