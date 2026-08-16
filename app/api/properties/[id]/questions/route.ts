import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { notify } from '@/lib/notify'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: propertyId } = await params
  try {
    const questions = await (db as any).propertyQuestion.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true, email: true } },
        answers: {
          orderBy: { createdAt: 'asc' },
          include: { agent: { select: { name: true, email: true } } },
        },
      },
    })
    return NextResponse.json({ questions })
  } catch {
    return NextResponse.json({ questions: [] })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: propertyId } = await params
  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'text required' }, { status: 400 })

  const question = await (db as any).propertyQuestion.create({
    data: { propertyId, userId: session.user.id, text: text.trim() },
    include: {
      user: { select: { name: true, email: true } },
      answers: [],
    },
  })

  const appUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  notify(
    `❓ <b>New Q&amp;A Question</b>\n` +
    `👤 ${session.user.name ?? session.user.email}\n` +
    `💬 ${text.trim()}\n` +
    `👉 ${appUrl}/property/${propertyId}`
  )

  return NextResponse.json({ question })
}
