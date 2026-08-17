import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'
import { sendEmail, emailResetPassword } from '@/lib/email'

export async function POST(req: NextRequest) {
  const rl = ratelimit(`forgot:${getIP(req)}`, 3, 10 * 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)
  const { email } = await req.json()
  if (!email) return NextResponse.json({ ok: true }) // don't leak existence

  const user = await (db as any).user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return NextResponse.json({ ok: true })

  // Invalidate old tokens
  await (db as any).passwordResetToken.deleteMany({ where: { userId: user.id } })

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await (db as any).passwordResetToken.create({ data: { userId: user.id, token, expiresAt } })

  const appUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const resetUrl = `${appUrl}/reset-password?token=${token}`

  const tmpl = emailResetPassword(user.name ?? 'there', resetUrl)
  await sendEmail({ to: email, ...tmpl }).catch(() => {})

  // Dev fallback: log reset URL
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[RESET URL] ${resetUrl}`)
  }

  return NextResponse.json({ ok: true })
}
