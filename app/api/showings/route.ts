import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { notify } from '@/lib/notify'

const ShowingSchema = z.object({
  propertyId: z.string().min(1),
  listingId: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  preferredDate: z.string().min(1),
  preferredTime: z.string().optional(),
  message: z.string().max(2000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = ShowingSchema.parse(body)

    // Parse preferred date+time into a DateTime
    const preferredAt = new Date(`${data.preferredDate}${data.preferredTime ? 'T' + data.preferredTime : 'T10:00:00'}`)

    // Persist to DB
    let saved = false
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db as any).showingRequest.create({
        data: {
          propertyId: data.propertyId,
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          preferredAt,
          message: data.message ?? null,
          status: 'requested',
        },
      })
      saved = true
    } catch (dbErr) {
      // DB not yet set up — log and continue so the API still responds OK
      console.error('[SHOWING] DB insert failed:', dbErr)
    }

    // Telegram notification
    if (saved) {
      const appUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
      notify(
        `🏠 <b>New Showing Request</b>\n` +
        `👤 ${data.name} &lt;${data.email}&gt;${data.phone ? ` · ${data.phone}` : ''}\n` +
        `📋 Listing: ${data.listingId}\n` +
        `📅 ${data.preferredDate}${data.preferredTime ? ' at ' + data.preferredTime : ''}\n` +
        `${data.message ? `💬 ${data.message}\n` : ''}` +
        `👉 ${appUrl}/dashboard/showings`
      )
    }

    // Send email notification via Resend if configured
    const resendKey = process.env.RESEND_API_KEY
    const agentEmail = process.env.AGENT_EMAIL
    if (resendKey && agentEmail && saved) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: 'Toronto Realty <noreply@torontorealty.ca>',
          to: agentEmail,
          subject: `New showing request — ${data.name}`,
          text: [
            `New showing request received.`,
            ``,
            `Buyer: ${data.name} <${data.email}>${data.phone ? ` · ${data.phone}` : ''}`,
            `Property: ${data.listingId}`,
            `Preferred date: ${data.preferredDate}${data.preferredTime ? ' at ' + data.preferredTime : ''}`,
            data.message ? `Message: ${data.message}` : '',
            ``,
            `Review at: ${process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/showings`,
          ].filter(Boolean).join('\n'),
        })
      } catch (emailErr) {
        console.error('[SHOWING] Email send failed:', emailErr)
      }
    }

    if (!saved) {
      console.log('[SHOWING REQUEST]', { ...data, ts: new Date().toISOString() })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
