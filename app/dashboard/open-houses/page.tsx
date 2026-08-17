import { db } from '@/lib/db'
import OpenHouseManager from './OpenHouseManager'

export const metadata = { title: 'Open Houses' }

async function getData() {
  try {
    const [openHouses, properties] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (db as any).openHouse.findMany({
        orderBy: { startsAt: 'asc' },
        include: {
          property: { select: { title: true, listingId: true } },
          _count: { select: { registrations: true } },
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (db as any).property.findMany({
        where: { status: 'active' },
        select: { id: true, title: true, listingId: true },
        orderBy: { listedAt: 'desc' },
        take: 200,
      }),
    ])
    return { openHouses, properties }
  } catch {
    return { openHouses: [], properties: [] }
  }
}

export default async function OpenHousesPage() {
  const { openHouses, properties } = await getData()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-8">Open Houses</h1>
      <OpenHouseManager openHouses={openHouses} properties={properties} />
    </div>
  )
}
