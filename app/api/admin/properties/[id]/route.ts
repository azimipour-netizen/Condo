import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const PatchSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  propertyType: z.enum(['detached', 'semi_detached', 'townhouse', 'condo', 'multiplex', 'vacant_land', 'commercial']).optional(),
  transactionType: z.enum(['sale', 'lease']).optional(),
  status: z.enum(['active', 'sold', 'terminated', 'expired', 'suspended']).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathroomsTotal: z.number().min(0).max(20).optional(),
  parkingSpaces: z.number().int().min(0).optional(),
  sqft: z.number().int().positive().nullable().optional(),
  yearBuilt: z.number().int().min(1800).max(2030).nullable().optional(),
  maintenanceFee: z.number().nonnegative().nullable().optional(),
  taxes: z.number().nonnegative().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().nullable().optional(),
  neighbourhood: z.string().nullable().optional(),
  virtualTourUrl: z.string().url().nullable().optional(),
  features: z.array(z.string()).optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
})

async function guard(req: NextRequest) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) return null
  return session
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await guard(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params

  try {
    const body = await req.json()
    const data = PatchSchema.parse(body)

    const property = await (db as any).property.update({
      where: { id },
      data: {
        ...data,
        ...(data.address !== undefined && { displayMode: data.address ? 'exact' : 'approximate' }),
      },
      select: { id: true, listingId: true, status: true },
    })
    return NextResponse.json({ property })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[PATCH PROPERTY]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await guard(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params

  try {
    await (db as any).property.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE PROPERTY]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await (db as any).property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  })
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ property })
}
