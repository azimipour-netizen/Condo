import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const record = await (db as any).passwordResetToken.findUnique({ where: { token } })
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Link expired or already used' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)
  await Promise.all([
    (db as any).user.update({ where: { id: record.userId }, data: { passwordHash: hash } }),
    (db as any).passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ])

  return NextResponse.json({ ok: true })
}
