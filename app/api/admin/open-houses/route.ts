import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const Schema = z.object({
  propertyId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const data = Schema.parse(body)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openHouse = await (db as any).openHouse.create({
    data: {
      propertyId: data.propertyId,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      notes: data.notes ?? null,
    },
  })

  return NextResponse.json({ openHouse })
}
