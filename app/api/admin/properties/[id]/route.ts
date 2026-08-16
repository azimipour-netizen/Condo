import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const PatchSchema = z.object({
  status: z.enum(['active', 'sold', 'terminated', 'expired', 'suspended']).optional(),
  price: z.number().positive().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const data = PatchSchema.parse(body)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const property = await (db as any).property.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
  })

  return NextResponse.json({ property })
}
