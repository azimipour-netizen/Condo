import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const CreateSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  propertyType: z.enum(['detached', 'semi_detached', 'townhouse', 'condo', 'multiplex', 'vacant_land', 'commercial']),
  transactionType: z.enum(['sale', 'lease']).default('sale'),
  bedrooms: z.number().int().min(0).max(20),
  bathroomsTotal: z.number().min(0).max(20),
  parkingSpaces: z.number().int().min(0).default(0),
  sqft: z.number().int().positive().nullable().optional(),
  yearBuilt: z.number().int().min(1800).max(2030).nullable().optional(),
  maintenanceFee: z.number().nonnegative().nullable().optional(),
  taxes: z.number().nonnegative().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().default('Toronto'),
  province: z.string().default('ON'),
  postalCode: z.string().nullable().optional(),
  neighbourhood: z.string().nullable().optional(),
  virtualTourUrl: z.string().url().nullable().optional(),
  features: z.array(z.string()).default([]),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = CreateSchema.parse(body)

    const listingId = `CH-${Date.now()}`

    const property = await (db as any).property.create({
      data: {
        ...data,
        listingId,
        providerId: 'manual',
        status: 'active',
        displayMode: data.address ? 'exact' : 'approximate',
        sqft: data.sqft ?? null,
        yearBuilt: data.yearBuilt ?? null,
        maintenanceFee: data.maintenanceFee ?? null,
        taxes: data.taxes ?? null,
        address: data.address ?? null,
        neighbourhood: data.neighbourhood ?? null,
        postalCode: data.postalCode ?? null,
        virtualTourUrl: data.virtualTourUrl ?? null,
      },
      select: { id: true, listingId: true },
    })

    // Seed price history
    await (db as any).priceHistory.create({
      data: { propertyId: property.id, price: data.price },
    }).catch(() => {})

    return NextResponse.json({ property }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[CREATE PROPERTY]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
