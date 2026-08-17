import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const conversations = await (db as any).aIConversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      sessionId: true,
      filtersState: true,
      createdAt: true,
      updatedAt: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 1,
        select: { role: true, content: true },
      },
    },
  })

  return NextResponse.json({ conversations })
}

export async function POST(req: NextRequest) {
  const rl = ratelimit(`savechat:${getIP(req)}`, 20, 600_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, filtersState } = await req.json()
  if (!Array.isArray(messages) || messages.length < 2) {
    return NextResponse.json({ error: 'At least 2 messages required' }, { status: 400 })
  }

  const conversation = await (db as any).aIConversation.create({
    data: {
      userId: session.user.id,
      sessionId: crypto.randomUUID(),
      filtersState: filtersState ?? {},
      messages: {
        create: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      },
    },
    select: { id: true, createdAt: true },
  })

  return NextResponse.json({ conversation }, { status: 201 })
}
