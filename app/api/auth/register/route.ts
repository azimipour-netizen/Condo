import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { notify } from '@/lib/notify'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'
import { sendEmail, emailVerifyAddress } from '@/lib/email'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { checkSignupEmail } from '@/lib/security/email-guard'

const RegisterSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  turnstileToken: z.string().optional(),
  // Honeypot: hidden from real users, so anything here is a bot.
  company: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  // 3 signups per IP per hour. Real households rarely exceed this; scripted
  // signup floods always do.
  const rl = ratelimit(`register:${getIP(req)}`, 3, 60 * 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)
  try {
    const body = await req.json()
    const { name, email, password, turnstileToken, company } = RegisterSchema.parse(body)

    // Honeypot tripped — pretend it worked so the bot does not learn to retry.
    if (company) {
      console.warn(`[register] honeypot tripped from ${getIP(req)}`)
      return NextResponse.json({ ok: true })
    }

    const emailCheck = checkSignupEmail(email)
    if (!emailCheck.ok) {
      return NextResponse.json({ error: emailCheck.reason }, { status: 400 })
    }

    const human = await verifyTurnstile(turnstileToken, getIP(req))
    if (!human) {
      return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (db as any).user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await (db as any).user.create({ data: { name, email, passwordHash } })

    notify(`👤 <b>New User Registered</b>\n${name} &lt;${email}&gt;`)

    // Send verification email
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await (db as any).emailVerificationToken.create({ data: { userId: user.id, token, expiresAt } })

    const appUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`

    const tmpl = emailVerifyAddress(name, verifyUrl)
    await sendEmail({ to: email, ...tmpl }).catch(() => {})
    if (process.env.NODE_ENV !== 'production') console.log(`[VERIFY URL] ${verifyUrl}`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
