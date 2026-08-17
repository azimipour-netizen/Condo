import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getMLSAdapter } from '@/lib/mls/adapter'
import type { Property, PropertySummary } from '@/types/property'
import PropertyCard from '@/components/property/PropertyCard'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'My Favorite Listings' }

function toSummary(p: Property): PropertySummary {
  return {
    id: p.id, status: p.status, transactionType: p.transactionType, price: p.price,
    propertyType: p.propertyType, bedrooms: p.bedrooms, bathroomsTotal: p.bathroomsTotal,
    parkingSpaces: p.parkingSpaces, sqft: p.sqft, lotSize: p.lotSize, yearBuilt: p.yearBuilt,
    maintenanceFee: p.maintenanceFee, taxes: p.taxes, title: p.title,
    description: p.description, features: p.features,
    location: p.location, thumbnail: p.images[0]?.url ?? null,
    listedAt: p.listedAt, updatedAt: p.updatedAt,
  }
}

export default async function FavoritesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/account/favorites')

  const adapter = getMLSAdapter()

  let savedIds: string[] = []
  try {
    const rows = await (db as any).savedProperty.findMany({
      where: { userId: session.user.id },
      orderBy: { savedAt: 'desc' },
      select: { propertyId: true },
    })
    savedIds = rows.map((r: any) => r.propertyId)
  } catch (err) {
    console.error('[/account/favorites] DB query failed:', err)
  }

  const adapterResults = await Promise.all(
    savedIds.map(id => adapter.getListing(id).catch(() => null))
  )

  // For nulls (sold/delisted from feed), fall back to DB so they stay visible with SOLD badge
  const nullIds = savedIds.filter((_, i) => adapterResults[i] === null)
  let dbFallbacks: PropertySummary[] = []
  if (nullIds.length > 0) {
    try {
      const rows = await (db as any).property.findMany({
        where: { id: { in: nullIds } },
        select: {
          id: true, status: true, price: true, propertyType: true, transactionType: true,
          bedrooms: true, bathroomsTotal: true, parkingSpaces: true, sqft: true, title: true,
          neighbourhood: true, city: true, province: true, postalCode: true,
          address: true, displayMode: true, latitude: true, longitude: true,
          images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
        },
      })
      dbFallbacks = rows.map((r: any) => ({
        id: r.id, status: r.status, transactionType: r.transactionType ?? 'sale',
        price: Number(r.price), propertyType: r.propertyType,
        bedrooms: r.bedrooms, bathroomsTotal: Number(r.bathroomsTotal),
        parkingSpaces: r.parkingSpaces, sqft: r.sqft,
        lotSize: null, yearBuilt: null, maintenanceFee: null, taxes: null,
        title: r.title, description: '', features: [],
        thumbnail: r.images[0]?.url ?? null,
        location: {
          latitude: r.latitude ? Number(r.latitude) : null,
          longitude: r.longitude ? Number(r.longitude) : null,
          displayMode: r.displayMode, address: r.address,
          neighbourhood: r.neighbourhood, city: r.city,
          province: r.province, postalCode: r.postalCode,
        },
      }))
    } catch {}
  }

  const properties: PropertySummary[] = [
    // Active/adapter results first, sold/fallback at the bottom
    ...adapterResults.filter((p): p is Property => p !== null && p.status !== 'sold').map(toSummary),
    ...adapterResults.filter((p): p is Property => p !== null && p.status === 'sold').map(toSummary),
    ...dbFallbacks,
  ]

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[color:var(--foreground)]">My Favorite Listings</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-0.5">
          Properties you&apos;ve saved from your search
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[color:var(--bg-surface)] border border-[color:var(--border)] flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 3 15 3 9C3 6.239 5.239 4 8 4C9.532 4 10.891 4.713 11.795 5.826C12 6.085 12 6.085 12.205 5.826C13.109 4.713 14.468 4 16 4C18.761 4 21 6.239 21 9C21 15 12 21 12 21Z" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-base font-semibold text-[color:var(--foreground)] mb-2">No saved properties yet</p>
          <p className="text-sm text-[color:var(--text-muted)] mb-6">Tap the heart icon on any listing to save it here.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-[color:var(--text-muted)] mb-6">
            {properties.length} saved {properties.length === 1 ? 'property' : 'properties'}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
