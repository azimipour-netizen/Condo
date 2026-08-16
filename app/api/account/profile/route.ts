import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const Schema = z.object({
  name: z.string().min(2).max(80),
})

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name } = Schema.parse(body)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (db as any).user.update({ where: { id: session.user.id }, data: { name } })
  return NextResponse.json({ ok: true })
}
