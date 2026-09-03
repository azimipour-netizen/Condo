import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import PropertyCard from '@/components/property/PropertyCard'
import type { PropertySummary, PropertyType } from '@/types/property'
import { TORONTO_NEIGHBOURHOODS, findNeighbourhood, neighbourhoodWhereClause, type TorontoNeighbourhood } from '@/lib/seo/toronto-neighbourhoods'

const PER_PAGE = 24

const TYPE_LABELS: { value: PropertyType; label: string }[] = [
  { value: 'detached', label: 'Detached Homes' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'townhouse', label: 'Townhouses' },
  { value: 'condo', label: 'Condos' },
]

function fmtPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  return `$${Math.round(n / 1000)}K`
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const hood = findNeighbourhood(slug)
  if (!hood) return { title: 'Not Found' }
  return {
    title: `${hood.name} Real Estate — Homes for Sale in ${hood.name}, Toronto`,
    description: `Browse active MLS® listings in ${hood.name}, Toronto. ${hood.description} Real-time prices, photos, and property details.`,
    alternates: { canonical: `/neighbourhoods/${slug}` },
  }
}

async function getNeighbourhoodData(hood: TorontoNeighbourhood, page: number) {
  const where = {
    status: 'active',
    ...neighbourhoodWhereClause(hood),
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [listingsRaw, stats, typeCounts] = await Promise.all([
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (db as any).property.groupBy({
        by: ['propertyType'], where, _count: { _all: true },
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

    const typeCountMap: Record<string, number> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const t of typeCounts) typeCountMap[t.propertyType] = t._count._all

    return {
      listings,
      count: stats._count.id ?? 0,
      avgPrice: stats._avg.price ? Number(stats._avg.price) : null,
      minPrice: stats._min.price ? Number(stats._min.price) : null,
      maxPrice: stats._max.price ? Number(stats._max.price) : null,
      typeCountMap,
    }
  } catch {
    return { listings: [], count: 0, avgPrice: null, minPrice: null, maxPrice: null, typeCountMap: {} }
  }
}

export default async function NeighbourhoodPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const hood = findNeighbourhood(slug)
  if (!hood) notFound()

  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const searchTerm = hood.searchTerm ?? hood.name
  const { listings, count, avgPrice, minPrice, maxPrice, typeCountMap } = await getNeighbourhoodData(hood, page)
  const totalPages = Math.ceil(count / PER_PAGE)
  const otherHoods = TORONTO_NEIGHBOURHOODS.filter(n => n.slug !== slug).slice(0, 8)

  const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Neighbourhoods', item: `${BASE}/neighbourhoods` },
      { '@type': 'ListItem', position: 3, name: hood.name },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[color:var(--accent)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/neighbourhoods" className="hover:text-[color:var(--accent)] transition-colors">Neighbourhoods</Link>
        <span>/</span>
        <span className="text-[color:var(--foreground)]">{hood.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{hood.name} Real Estate</h1>
        <p className="mt-2 text-base text-[color:var(--text-muted)] max-w-2xl">{hood.description}</p>
      </div>

      {/* Stats */}
      {count > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-4">
            <p className="text-2xl font-bold text-[color:var(--foreground)] tabular-nums">{count.toLocaleString()}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Active listings</p>
          </div>
          {avgPrice && (
            <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-4">
              <p className="text-2xl font-bold text-[color:var(--foreground)] tabular-nums">{fmtPrice(avgPrice)}</p>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Average price</p>
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

      {/* Property type quick links */}
      {Object.keys(typeCountMap).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {TYPE_LABELS.filter(t => typeCountMap[t.value] > 0).map(t => (
            <Link
              key={t.value}
              href={`/search?neighbourhood=${encodeURIComponent(searchTerm)}&type=${t.value}`}
              className="px-4 py-2 text-sm bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
            >
              {t.label} <span className="text-[color:var(--text-muted)]">({typeCountMap[t.value]})</span>
            </Link>
          ))}
        </div>
      )}

      {/* About */}
      <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-6 mb-10">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-2">About {hood.name}</h2>
        <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{hood.about}</p>
      </div>

      {/* Listings heading */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[color:var(--foreground)]">
          {count > 0
            ? `${count.toLocaleString()} Active Listing${count !== 1 ? 's' : ''}${totalPages > 1 ? ` — page ${page} of ${totalPages}` : ''}`
            : 'No active listings'}
        </h2>
      </div>

      {/* Listings */}
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
                <Link
                  href={`/neighbourhoods/${slug}?page=${page - 1}`}
                  className="px-4 py-2 text-sm border border-[color:var(--border)] rounded-xl text-[color:var(--foreground)] hover:border-[color:var(--accent)] transition-colors"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-[color:var(--text-muted)] px-3">{page} / {totalPages}</span>
              {page < totalPages && (
                <Link
                  href={`/neighbourhoods/${slug}?page=${page + 1}`}
                  className="px-4 py-2 text-sm border border-[color:var(--border)] rounded-xl text-[color:var(--foreground)] hover:border-[color:var(--accent)] transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">No active listings in {hood.name} right now.</p>
          <Link href="/search" className="mt-3 inline-block text-sm text-[color:var(--accent)] hover:underline">
            Browse all listings →
          </Link>
        </div>
      )}

      {/* SEO footer */}
      <div className="mt-14 pt-8 border-t border-[color:var(--border)] space-y-10">

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Buyer guides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog/what-closing-costs-do-home-buyers-pay" className="text-[color:var(--accent)] hover:underline">What closing costs do home buyers pay?</Link></li>
              <li><Link href="/blog/how-much-is-land-transfer-tax-in-ontario" className="text-[color:var(--accent)] hover:underline">How much is land transfer tax in Ontario?</Link></li>
              <li><Link href="/blog/how-to-get-mortgage-pre-approval" className="text-[color:var(--accent)] hover:underline">How to get mortgage pre-approval</Link></li>
              <li><Link href="/blog/steps-to-buying-a-home-in-the-gta" className="text-[color:var(--accent)] hover:underline">Steps to buying a home in the GTA</Link></li>
              <li><Link href="/blog/first-time-home-buyer-benefits-ontario" className="text-[color:var(--accent)] hover:underline">First-time home buyer benefits in Ontario</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mortgage-calculator" className="text-[color:var(--accent)] hover:underline">Mortgage calculator</Link></li>
              <li><Link href="/open-houses" className="text-[color:var(--accent)] hover:underline">Upcoming open houses in {hood.name}</Link></li>
              <li><Link href="/neighbourhoods" className="text-[color:var(--accent)] hover:underline">Browse all Toronto neighbourhoods</Link></li>
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
                  href={`/neighbourhoods/${n.slug}`}
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
                <a href="https://www.canada.ca/en/financial-consumer-agency/services/buying-home.html" target="_blank" rel="noopener noreferrer" className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  Government of Canada: Buying a home ↗
                </a>
              </li>
              <li>
                <a href="https://www.cmhc-schl.gc.ca/consumers/home-buying" target="_blank" rel="noopener noreferrer" className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  CMHC homebuyer resources ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
