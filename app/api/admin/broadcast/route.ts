import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { emailBroadcast } from '@/lib/email'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subject, message } = await req.json()
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'subject and message required' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey || resendKey.length < 5) {
    return NextResponse.json({ error: 'Email not configured (RESEND_API_KEY missing)' }, { status: 503 })
  }

  const users = await (db as any).user.findMany({
    where: { role: 'consumer', email: { not: undefined } },
    select: { email: true, name: true },
    take: 500,
  })

  if (users.length === 0) return NextResponse.json({ sent: 0 })

  const appUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'
  const resend = new Resend(resendKey)
  const FROM = process.env.EMAIL_FROM ?? 'Condohill <noreply@condohill.com>'

  let sent = 0
  const errors: string[] = []

  // Resend batch: max 100 per call
  const CHUNK = 100
  for (let i = 0; i < users.length; i += CHUNK) {
    const chunk = users.slice(i, i + CHUNK)
    const batch = chunk.map((u: { email: string; name: string | null }) => {
      const tmpl = emailBroadcast(u.name ?? 'there', subject, message, appUrl)
      return { from: FROM, to: u.email, subject, html: tmpl.html, text: tmpl.text }
    })
    try {
      await resend.batch.send(batch)
      sent += chunk.length
    } catch (e: any) {
      errors.push(`chunk ${i / CHUNK + 1}: ${e.message}`)
    }
  }

  return NextResponse.json({ sent, total: users.length, errors: errors.slice(0, 5) })
}
