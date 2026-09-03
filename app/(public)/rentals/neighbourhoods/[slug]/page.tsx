import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import PropertyCard from '@/components/property/PropertyCard'
import type { PropertySummary } from '@/types/property'
import { TORONTO_NEIGHBOURHOODS, findNeighbourhood, neighbourhoodWhereClause, type TorontoNeighbourhood } from '@/lib/seo/toronto-neighbourhoods'

const PER_PAGE = 24

function fmtPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  return `$${Math.round(n / 1000)}K`
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export function generateStaticParams() {
  return TORONTO_NEIGHBOURHOODS.map(n => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const hood = findNeighbourhood(slug)
  if (!hood) return { title: 'Not Found' }
  return {
    title: `${hood.name} Rentals — Apartments & Houses for Rent in ${hood.name}, Toronto`,
    description: `Browse active MLS® rental listings in ${hood.name}, Toronto. ${hood.description} Real-time rental prices, photos, and property details.`,
    alternates: { canonical: `/rentals/neighbourhoods/${slug}` },
  }
}

async function getNeighbourhoodRentals(hood: TorontoNeighbourhood, page: number) {
  const where = {
    status: 'active',
    transactionType: 'lease',
    ...neighbourhoodWhereClause(hood),
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [listingsRaw, stats] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (db as any).property.findMany({
        where,
        orderBy: { listedAt: 'desc' },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
        select: {
          id: true, listingId: true, title: true, status: true, price: true,
          propertyType: true, transactionType: true, bedrooms: true,
          bathroomsTotal: true, parkingSpaces: true, sqft: true,
          latitude: true, longitude: true, displayMode: true, address: true,
          neighbourhood: true, city: true, province: true, postalCode: true,
          listedAt: true,
          images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (db as any).property.aggregate({
        where,
        _count: { id: true },
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
      }),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listings = listingsRaw.map((p: any) => ({
      id: p.id, listingId: p.listingId, title: p.title, status: p.status,
      price: Number(p.price), propertyType: p.propertyType,
      transactionType: p.transactionType, bedrooms: p.bedrooms,
      bathroomsTotal: Number(p.bathroomsTotal), parkingSpaces: p.parkingSpaces,
      sqft: p.sqft, thumbnail: p.images[0]?.url ?? null,
      listedAt: p.listedAt?.toISOString() ?? null,
      location: {
        latitude: p.latitude ? Number(p.latitude) : null,
        longitude: p.longitude ? Number(p.longitude) : null,
        displayMode: p.displayMode, address: p.address,
        neighbourhood: p.neighbourhood, city: p.city,
        province: p.province, postalCode: p.postalCode,
      },
    }))

    return {
      listings,
      count: stats._count.id ?? 0,
      avgPrice: stats._avg.price ? Number(stats._avg.price) : null,
      minPrice: stats._min.price ? Number(stats._min.price) : null,
      maxPrice: stats._max.price ? Number(stats._max.price) : null,
    }
  } catch {
    return { listings: [], count: 0, avgPrice: null, minPrice: null, maxPrice: null }
  }
}

export default async function NeighbourhoodRentalsPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const hood = findNeighbourhood(slug)
  if (!hood) notFound()

  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const searchTerm = hood.searchTerm ?? hood.name
  const { listings, count, avgPrice, minPrice, maxPrice } = await getNeighbourhoodRentals(hood, page)
  const totalPages = Math.ceil(count / PER_PAGE)
  const otherHoods = TORONTO_NEIGHBOURHOODS.filter(n => n.slug !== slug).slice(0, 8)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[color:var(--accent)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/homes-for-rent" className="hover:text-[color:var(--accent)] transition-colors">Homes for Rent</Link>
        <span>/</span>
        <Link href="/rentals/neighbourhoods" className="hover:text-[color:var(--accent)] transition-colors">By Neighbourhood</Link>
        <span>/</span>
        <span className="text-[color:var(--foreground)]">{hood.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{hood.name} Rentals</h1>
        <p className="mt-2 text-base text-[color:var(--text-muted)] max-w-2xl">{hood.description}</p>
      </div>

      {/* Stats */}
      {count > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-4">
            <p className="text-2xl font-bold text-[color:var(--foreground)] tabular-nums">{count.toLocaleString()}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Active rentals</p>
          </div>
          {avgPrice && (
            <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-4">
              <p className="text-2xl font-bold text-[color:var(--foreground)] tabular-nums">{fmtPrice(avgPrice)}</p>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Average rent</p>
            </div>
          )}
          {minPrice && (
            <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-4">
              <p className="text-2xl font-bold text-[color:var(--foreground)] tabular-nums">{fmtPrice(minPrice)}</p>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Starting from</p>
            </div>
          )}
          {maxPrice && (
            <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-4">
              <p className="text-2xl font-bold text-[color:var(--foreground)] tabular-nums">{fmtPrice(maxPrice)}</p>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Highest listed</p>
            </div>
          )}
        </div>
      )}

      {/* Neighbourhood quick links */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href={`/neighbourhoods/${slug}`}
          className="px-4 py-2 text-sm bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
        >
          All Listings in {hood.name}
        </Link>
        <Link
          href={`/homes-for-rent/toronto`}
          className="px-4 py-2 text-sm bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
        >
          All Toronto Rentals
        </Link>
      </div>

      {/* About */}
      <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-6 mb-10">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-2">About {hood.name}</h2>
        <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{hood.about}</p>
      </div>

      {/* Listings heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[color:var(--foreground)]">
          {count > 0
            ? `${count.toLocaleString()} Rental${count !== 1 ? 's' : ''} in ${hood.name}${totalPages > 1 ? ` — page ${page} of ${totalPages}` : ''}`
            : `No active rentals in ${hood.name}`}
        </h2>
      </div>

      {listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(listings as PropertySummary[]).map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={`/rentals/neighbourhoods/${slug}?page=${page - 1}`}
                  className="px-4 py-2 text-sm border border-[color:var(--border)] rounded-xl text-[color:var(--foreground)] hover:border-[color:var(--accent)] transition-colors">
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-[color:var(--text-muted)] px-3">{page} / {totalPages}</span>
              {page < totalPages && (
                <Link href={`/rentals/neighbourhoods/${slug}?page=${page + 1}`}
                  className="px-4 py-2 text-sm border border-[color:var(--border)] rounded-xl text-[color:var(--foreground)] hover:border-[color:var(--accent)] transition-colors">
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">No active rentals in {hood.name} right now.</p>
          <Link href="/homes-for-rent/toronto" className="mt-3 inline-block text-sm text-[color:var(--accent)] hover:underline">
            Browse all Toronto rentals →
          </Link>
        </div>
      )}

      {/* SEO footer */}
      <div className="mt-14 pt-8 border-t border-[color:var(--border)] space-y-10">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Thinking of buying instead?</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog/steps-to-buying-a-home-in-the-gta" className="text-[color:var(--accent)] hover:underline">Steps to buying a home in the GTA</Link></li>
              <li><Link href="/blog/how-much-house-can-i-afford" className="text-[color:var(--accent)] hover:underline">How much home can I afford?</Link></li>
              <li><Link href="/blog/how-much-down-payment-to-buy-a-home" className="text-[color:var(--accent)] hover:underline">How much down payment do you need?</Link></li>
              <li><Link href="/blog/first-time-home-buyer-benefits-ontario" className="text-[color:var(--accent)] hover:underline">First-time home buyer benefits in Ontario</Link></li>
              <li><Link href="/blog/what-is-the-home-buyers-plan" className="text-[color:var(--accent)] hover:underline">Home Buyers&apos; Plan — use your RRSP</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mortgage-calculator" className="text-[color:var(--accent)] hover:underline">Mortgage calculator</Link></li>
              <li><Link href={`/neighbourhoods/${slug}`} className="text-[color:var(--accent)] hover:underline">All listings in {hood.name}</Link></li>
              <li><Link href="/rentals/neighbourhoods" className="text-[color:var(--accent)] hover:underline">All Toronto neighbourhood rentals</Link></li>
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Other neighbourhoods</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {otherHoods.map(n => (
                <Link
                  key={n.slug}
                  href={`/rentals/neighbourhoods/${n.slug}`}
                  className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors"
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">External resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.trreb.ca/index.php/market-news/market-stats" target="_blank" rel="noopener noreferrer" className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  TRREB monthly market statistics ↗
                </a>
              </li>
              <li>
                <a href="https://www.ontario.ca/page/renting-ontario-your-rights" target="_blank" rel="noopener noreferrer" className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  Ontario tenant rights ↗
                </a>
              </li>
              <li>
                <a href="https://tribunalsontario.ca/ltb/" target="_blank" rel="noopener noreferrer" className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  Landlord and Tenant Board ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
