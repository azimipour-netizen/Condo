import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const searches = await (db as any).savedSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, filters: true, createdAt: true },
    })
    return NextResponse.json({ searches })
  } catch {
    return NextResponse.json({ searches: [] })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, filters } = await req.json()
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }

  try {
    const search = await (db as any).savedSearch.create({
      data: { userId: session.user.id, name: name.trim(), filters: filters ?? {} },
      select: { id: true, name: true, filters: true, createdAt: true },
    })
    return NextResponse.json({ search })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
