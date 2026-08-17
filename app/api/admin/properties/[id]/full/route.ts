import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const FullUpdateSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  propertyType: z.enum(['detached', 'semi_detached', 'townhouse', 'condo', 'multiplex', 'vacant_land', 'commercial']),
  transactionType: z.enum(['sale', 'lease']),
  status: z.enum(['active', 'sold', 'terminated', 'expired', 'suspended']),
  bedrooms: z.number().int().min(0),
  bathroomsTotal: z.number().min(0),
  parkingSpaces: z.number().int().min(0),
  sqft: z.number().int().positive().nullable().optional(),
  yearBuilt: z.number().int().nullable().optional(),
  maintenanceFee: z.number().nonnegative().nullable().optional(),
  taxes: z.number().nonnegative().nullable().optional(),
  address: z.string().nullable().optional(),
  neighbourhood: z.string().nullable().optional(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string().nullable().optional(),
  virtualTourUrl: z.string().url().nullable().optional(),
  features: z.array(z.string()),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  try {
    const body = await req.json()
    const data = FullUpdateSchema.parse(body)

    const existing = await (db as any).property.findUnique({ where: { id }, select: { price: true } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const property = await (db as any).property.update({
      where: { id },
      data: {
        ...data,
        displayMode: data.address ? 'exact' : 'approximate',
        updatedAt: new Date(),
      },
    })

    // Record price history if price changed
    if (Number(existing.price) !== data.price) {
      await (db as any).priceHistory.create({ data: { propertyId: id, price: data.price } }).catch(() => {})
    }

    return NextResponse.json({ property })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
