import { db } from '@/lib/db'
import PropertiesTable from './PropertiesTable'

export const metadata = { title: 'Properties' }

async function getProperties() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (db as any).property.findMany({
      orderBy: { listedAt: 'desc' },
      select: {
        id: true,
        listingId: true,
        title: true,
        status: true,
        price: true,
        propertyType: true,
        bedrooms: true,
        city: true,
        listedAt: true,
        _count: { select: { showingRequests: true } },
      },
      take: 200,
    })
  } catch {
    return []
  }
}

export default async function PropertiesPage() {
  const raw = await getProperties()
  // Prisma Decimal → number for client serialization
  const properties = raw.map((p: any) => ({ ...p, price: Number(p.price) }))

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-8">Properties</h1>
      <PropertiesTable properties={properties} />
    </div>
  )
}
