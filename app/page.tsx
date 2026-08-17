import type { Metadata } from 'next'
import Link from 'next/link'
import SearchHero from '@/components/ai/SearchHero'
import PropertyCard from '@/components/property/PropertyCard'
import type { PropertySummary } from '@/types/property'
import { db } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Condohill — Toronto Real Estate',
  description: 'Find homes, condos, and investment properties across the GTA. AI-powered search with real listings.',
}

async function getHomeData() {
  try {
    const [featuredRaw, stats] = await Promise.all([
      (db as any).property.findMany({
        where: { status: 'active' },
        orderBy: { listedAt: 'desc' },
        take: 6,
        select: {
          id: true,
          listingId: true,
          title: true,
          status: true,
          price: true,
          propertyType: true,
          transactionType: true,
          bedrooms: true,
          bathroomsTotal: true,
          parkingSpaces: true,
          sqft: true,
          latitude: true,
          longitude: true,
          displayMode: true,
          address: true,
          neighbourhood: true,
          city: true,
          province: true,
          postalCode: true,
          listedAt: true,
          images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
        },
      }),
      (db as any).property.aggregate({
        where: { status: 'active' },
        _count: { id: true },
        _avg: { price: true },
      }),
    ])

    const featured = featuredRaw.map((p: any) => ({
      id: p.id,
      listingId: p.listingId,
      title: p.title,
      status: p.status,
      price: Number(p.price),
      propertyType: p.propertyType,
      transactionType: p.transactionType,
      bedrooms: p.bedrooms,
      bathroomsTotal: Number(p.bathroomsTotal),
      parkingSpaces: p.parkingSpaces,
      sqft: p.sqft,
      thumbnail: p.images[0]?.url ?? null,
      listedAt: p.listedAt?.toISOString() ?? null,
      location: {
        latitude: p.latitude ? Number(p.latitude) : null,
        longitude: p.longitude ? Number(p.longitude) : null,
        displayMode: p.displayMode,
        address: p.address,
        neighbourhood: p.neighbourhood,
        city: p.city,
        province: p.province,
        postalCode: p.postalCode,
      },
    }))

    return {
      featured,
      activeCount: stats._count.id ?? 0,
      avgPrice: stats._avg.price ? Math.round(Number(stats._avg.price) / 1000) * 1000 : null,
    }
  } catch {
    return { featured: [], activeCount: 0, avgPrice: null }
  }
}

const CITY_LINKS = [
  { city: 'Toronto', href: '/?city=Toronto' },
  { city: 'Mississauga', href: '/?city=Mississauga' },
  { city: 'Vaughan', href: '/?city=Vaughan' },
  { city: 'Markham', href: '/?city=Markham' },
  { city: 'Brampton', href: '/?city=Brampton' },
  { city: 'Richmond Hill', href: '/?city=Richmond+Hill' },
]

export default async function HomePage() {
  const { featured, activeCount, avgPrice } = await getHomeData()

  return (
    <main className="min-h-screen flex flex-col bg-[color:var(--background)]">
      <SearchHero />

      {/* Stats strip */}
      <div className="border-t border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap gap-6 items-center justify-center sm:justify-start">
          {activeCount > 0 && (
            <div className="text-center sm:text-left">
              <p className="text-xl font-bold text-[color:var(--foreground)] tabular-nums">{activeCount.toLocaleString()}</p>
              <p className="text-xs text-[color:var(--text-muted)]">Active listings</p>
            </div>
          )}
          {avgPrice && (
            <div className="text-center sm:text-left">
              <p className="text-xl font-bold text-[color:var(--foreground)] tabular-nums">
                ${(avgPrice / 1_000_000).toFixed(avgPrice % 1_000_000 === 0 ? 0 : 1)}M
              </p>
              <p className="text-xs text-[color:var(--text-muted)]">Average price</p>
            </div>
          )}
          <div className="text-center sm:text-left">
            <p className="text-xl font-bold text-[color:var(--foreground)]">GTA</p>
            <p className="text-xs text-[color:var(--text-muted)]">Coverage area</p>
          </div>
          <div className="sm:ml-auto flex items-center gap-3 flex-wrap justify-center">
            {CITY_LINKS.map(({ city, href }) => (
              <Link key={city} href={href}
                className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[color:var(--foreground)]">Recently Listed</h2>
            <Link href="/search"
              className="text-sm text-[color:var(--accent)] hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(featured as PropertySummary[]).map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="border-t border-[color:var(--border)] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
          <div>
            <p className="text-lg font-semibold text-[color:var(--foreground)] mb-1">Find Your Home</p>
            <p className="text-sm text-[color:var(--text-muted)] mb-3">AI-powered search across the GTA.</p>
            <Link href="/search" className="text-sm text-[color:var(--accent)] hover:underline">Browse all listings →</Link>
          </div>
          <div>
            <p className="text-lg font-semibold text-[color:var(--foreground)] mb-1">Mortgage Calculator</p>
            <p className="text-sm text-[color:var(--text-muted)] mb-3">Estimate your monthly payments instantly.</p>
            <Link href="/mortgage-calculator" className="text-sm text-[color:var(--accent)] hover:underline">Try the calculator →</Link>
          </div>
          <div>
            <p className="text-lg font-semibold text-[color:var(--foreground)] mb-1">Open Houses</p>
            <p className="text-sm text-[color:var(--text-muted)] mb-3">See upcoming showings and RSVP online.</p>
            <Link href="/open-houses" className="text-sm text-[color:var(--accent)] hover:underline">View open houses →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
