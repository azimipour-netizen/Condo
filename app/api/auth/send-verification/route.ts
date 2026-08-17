import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { sendEmail, emailVerifyAddress } from '@/lib/email'

export async function POST(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await (db as any).user.findUnique({ where: { id: session.user.id }, select: { emailVerified: true } })
  if (user?.emailVerified) return NextResponse.json({ ok: true, already: true })

  // Delete any existing token for this user
  await (db as any).emailVerificationToken.deleteMany({ where: { userId: session.user.id } })

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  await (db as any).emailVerificationToken.create({
    data: { userId: session.user.id, token, expiresAt },
  })

  const appUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const verifyUrl = `${appUrl}/verify-email?token=${token}`

  const tmpl = emailVerifyAddress(session.user.name ?? 'there', verifyUrl)
  await sendEmail({ to: session.user.email!, ...tmpl }).catch(() => {})

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[VERIFY URL] ${verifyUrl}`)
  }

  return NextResponse.json({ ok: true })
}
