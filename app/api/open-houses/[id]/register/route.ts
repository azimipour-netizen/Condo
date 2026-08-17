import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { notify } from '@/lib/notify'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'
import { sendEmail, emailOpenHouseConfirmation } from '@/lib/email'

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = ratelimit(`openhouse:${getIP(req)}`, 10, 10 * 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)
  const { id } = await params

  const openHouse = await (db as any).openHouse.findUnique({
    where: { id },
    include: { property: { select: { title: true } } },
  })
  if (!openHouse) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (new Date(openHouse.startsAt) < new Date()) {
    return NextResponse.json({ error: 'This open house has passed' }, { status: 400 })
  }

  try {
    const data = Schema.parse(await req.json())

    await (db as any).openHouseRegistration.create({
      data: { openHouseId: id, ...data },
    })

    const dateStr = new Date(openHouse.startsAt).toLocaleString('en-CA', {
      weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto',
    })

    await notify(
      `🏠 <b>Open House RSVP</b>\n<b>Property:</b> ${openHouse.property.title}\n<b>When:</b> ${dateStr}\n<b>Guest:</b> ${data.name} (${data.email})`
    ).catch(() => {})

    const tmpl = emailOpenHouseConfirmation(data.name, openHouse.property.title, dateStr)
    await sendEmail({ to: data.email, ...tmpl }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Already registered with this email' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
