import { db } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'
import OpenHouseCard from './OpenHouseCard'

export const metadata: Metadata = {
  title: 'Open Houses',
  description: 'Upcoming open houses in Toronto. Browse available properties and register to attend.',
}

async function getUpcomingOpenHouses() {
  return (db as any).openHouse.findMany({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: 'asc' },
    take: 50,
    include: {
      property: {
        select: {
          id: true, title: true, address: true, neighbourhood: true, city: true,
          price: true, bedrooms: true, bathroomsTotal: true, propertyType: true,
          transactionType: true,
          images: { orderBy: { order: 'asc' }, take: 1 },
        },
      },
      _count: { select: { registrations: true } },
    },
  })
}

function formatRange(start: Date, end: Date) {
  const day = new Date(start).toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Toronto',
  })
  const s = new Date(start).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto' })
  const e = new Date(end).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto' })
  return `${day} · ${s} – ${e}`
}

export default async function OpenHousesPage() {
  const openHouses = await getUpcomingOpenHouses()

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <nav className="text-sm text-[color:var(--text-muted)] mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Open Houses</span>
        </nav>
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Upcoming Open Houses</h1>
        <p className="text-[color:var(--text-muted)] mt-2">
          {openHouses.length > 0
            ? `${openHouses.length} open house${openHouses.length !== 1 ? 's' : ''} scheduled`
            : 'No open houses scheduled right now.'}
        </p>
      </div>

      {openHouses.length === 0 ? (
        <div className="text-center py-16 border border-[color:var(--border)] rounded-2xl text-[color:var(--text-muted)]">
          <p className="text-lg mb-2">No upcoming open houses</p>
          <p className="text-sm">Check back soon or browse all listings.</p>
          <Link href="/" className="inline-block mt-4 text-[color:var(--accent)] hover:underline text-sm">Browse listings →</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {openHouses.map((oh: {
            id: string
            startsAt: Date
            endsAt: Date
            notes: string | null
            _count: { registrations: number }
            property: {
              id: string
              title: string
              address: string | null
              neighbourhood: string | null
              city: string
              price: number
              bedrooms: number
              bathroomsTotal: number
              propertyType: string
              transactionType: string
              images: { url: string }[]
            }
          }) => (
            <OpenHouseCard
              key={oh.id}
              openHouseId={oh.id}
              dateRange={formatRange(oh.startsAt, oh.endsAt)}
              notes={oh.notes}
              registrationCount={oh._count.registrations}
              property={oh.property}
            />
          ))}
        </div>
      )}
    </div>
  )
}
