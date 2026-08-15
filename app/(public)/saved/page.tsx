import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getMLSAdapter } from '@/lib/mls/adapter'
import type { Property, PropertySummary } from '@/types/property'
import PropertyCard from '@/components/property/PropertyCard'

export const metadata: Metadata = { title: 'Saved Properties' }

function toSummary(p: Property): PropertySummary {
  return {
    id: p.id,
    status: p.status,
    price: p.price,
    propertyType: p.propertyType,
    bedrooms: p.bedrooms,
    bathroomsTotal: p.bathroomsTotal,
    parkingSpaces: p.parkingSpaces,
    sqft: p.sqft,
    title: p.title,
    location: p.location,
    thumbnail: p.images[0]?.url ?? null,
  }
}

export default async function SavedPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/saved')

  const adapter = getMLSAdapter()

  let savedIds: string[] = []
  try {
    const rows = await (db as any).savedProperty.findMany({
      where: { userId: session.user.id },
      orderBy: { savedAt: 'desc' },
      select: { propertyId: true },
    })
    savedIds = rows.map((r: any) => r.propertyId)
  } catch {}

  const properties: PropertySummary[] = (
    await Promise.all(savedIds.map(id => adapter.getListing(id).catch(() => null)))
  )
    .filter((p): p is Property => p !== null)
    .map(toSummary)

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <div className="border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
          <span className="text-[color:var(--border)]">|</span>
          <h1 className="text-sm font-semibold text-[color:var(--foreground)]">Saved Properties</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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
    </div>
  )
}
