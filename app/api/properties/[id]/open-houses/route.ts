import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: propertyId } = await params
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openHouses = await (db as any).openHouse.findMany({
      where: { propertyId, startsAt: { gte: new Date() } },
      orderBy: { startsAt: 'asc' },
    })
    return NextResponse.json({ openHouses })
  } catch {
    return NextResponse.json({ openHouses: [] })
  }
}
