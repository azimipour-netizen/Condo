import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const Schema = z.object({
  current: z.string().min(1),
  next: z.string().min(8).max(100),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { current, next } = Schema.parse(body)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (db as any).user.findUnique({ where: { id: session.user.id } })
  if (!user?.passwordHash) {
    return NextResponse.json({ error: 'No password set on this account' }, { status: 400 })
  }

  const valid = await bcrypt.compare(current, user.passwordHash)
  if (!valid) return NextResponse.json({ error: 'Current password incorrect' }, { status: 400 })

  const hash = await bcrypt.hash(next, 12)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (db as any).user.update({ where: { id: session.user.id }, data: { passwordHash: hash } })
  return NextResponse.json({ ok: true })
}
