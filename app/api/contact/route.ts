import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { notify } from '@/lib/notify'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'
import { sendEmail, emailContactConfirmation } from '@/lib/email'

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(3000),
})

export async function POST(req: NextRequest) {
  const rl = ratelimit(`contact:${getIP(req)}`, 5, 10 * 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)
  try {
    const body = await req.json()
    const data = Schema.parse(body)

    await (db as any).contactInquiry.create({ data })

    await notify(
      `📬 <b>New contact inquiry</b>\n<b>From:</b> ${data.name} (${data.email})\n<b>Subject:</b> ${data.subject}\n\n${data.message.slice(0, 300)}${data.message.length > 300 ? '…' : ''}`
    ).catch(() => {})

    const tmpl = emailContactConfirmation(data.name, data.subject, data.message)
    await sendEmail({ to: data.email, ...tmpl }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
