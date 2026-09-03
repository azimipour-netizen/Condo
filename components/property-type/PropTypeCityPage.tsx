import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import PropertyCard from '@/components/property/PropertyCard'
import type { PropertySummary } from '@/types/property'
import { GTA_CITIES, findGtaCity, cityWhereClause, type GtaCity } from '@/lib/seo/gta-cities'
import { PROP_TYPE_CFGS, type PropTypeCfg } from '@/lib/seo/property-type-pages'

const PER_PAGE = 24

/**
 * Used by every city×property-type page's generateMetadata() to decide
 * whether the page should be indexed. A zero-listing combination (e.g.
 * "Multiplexes for Sale in Vaughan") is a real, indexed, zero-content page
 * today — noindexing it doesn't remove the page (it still serves visitors
 * who land there and shows the cross-links to browse other cities/types),
 * it just stops search engines from ranking a page with nothing on it.
 */
export async function getPropTypeCityCount(config: PropTypeCfg, city: GtaCity): Promise<number | null> {
  const where: Record<string, unknown> = {
    status: 'active',
    transactionType: config.transactionType,
    ...cityWhereClause(city),
  }
  if (config.dbType) where.propertyType = config.dbType
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (db as any).property.count({ where })
  } catch {
    // null, not 0 — a transient DB error must never look like "genuinely
    // zero listings" and noindex a real page. Every caller's `count === 0`
    // check already fails open on null with no further change needed.
    return null
  }
}

function fmtPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  return `$${Math.round(n / 1000)}K`
}

async function getTypeData(config: PropTypeCfg, city: GtaCity, page: number) {
  const where: Record<string, unknown> = {
    status: 'active',
    transactionType: config.transactionType,
    ...cityWhereClause(city),
  }
  if (config.dbType) where.propertyType = config.dbType
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

interface Props {
  config: PropTypeCfg
  citySlug: string
  page: number
}

export async function PropTypeCityPage({ config, citySlug, page }: Props) {
  const city = findGtaCity(citySlug)
  if (!city) notFound()

  const { listings, count, avgPrice, minPrice, maxPrice } = await getTypeData(config, city, page)
  const totalPages = Math.ceil(count / PER_PAGE)
  const otherTypes = PROP_TYPE_CFGS.filter(
    c => c.typeSlug !== config.typeSlug && c.transactionType === config.transactionType && c.dbType !== null
  )
  const otherCities = GTA_CITIES.filter(c => c.slug !== city.slug).slice(0, 8)
  // config.plural is always a bare noun ("Condos", "Townhouses") — this was
  // previously hardcoded to the literal "for Sale" below, which produced
  // "Townhouses for Rent for Sale" on every rent-type page, since some rent
  // configs used to bake "for Rent" into `plural` itself on top of that.
  const transactionLabel = config.transactionType === 'lease' ? 'for Rent' : 'for Sale'

  const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: `${config.plural} ${transactionLabel}`, item: `${BASE}/${config.typeSlug}` },
      { '@type': 'ListItem', position: 3, name: city.name },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[color:var(--accent)] transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${config.typeSlug}`} className="hover:text-[color:var(--accent)] transition-colors">
          {config.plural} {transactionLabel}
        </Link>
        <span>/</span>
        <span className="text-[color:var(--foreground)]">{city.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{config.cityTitle(city.name)}</h1>
        <p className="mt-2 text-base text-[color:var(--text-muted)] max-w-2xl">{city.blurb}</p>
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

      {/* Cross-type quick links */}
      <div className="flex flex-wrap gap-2 mb-10">
        {config.dbType !== null && (
          <Link
            href={`/${config.transactionType === 'lease' ? 'homes-for-rent' : 'homes-for-sale'}/${city.slug}`}
            className="px-4 py-2 text-sm bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
          >
            All {config.transactionType === 'lease' ? 'Rentals' : 'Homes'}
          </Link>
        )}
        {otherTypes.map(t => (
          <Link
            key={t.typeSlug}
            href={`/${t.typeSlug}/${city.slug}`}
            className="px-4 py-2 text-sm bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
          >
            {t.plural}
          </Link>
        ))}
      </div>

      {/* Listings heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[color:var(--foreground)]">
          {count > 0
            ? `${count.toLocaleString()} ${config.plural} ${transactionLabel}${totalPages > 1 ? ` — page ${page} of ${totalPages}` : ''}`
            : `No ${config.plural} listed in ${city.name}`}
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
                <Link
                  href={`/${config.typeSlug}/${city.slug}?page=${page - 1}`}
                  className="px-4 py-2 text-sm border border-[color:var(--border)] rounded-xl text-[color:var(--foreground)] hover:border-[color:var(--accent)] transition-colors"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-[color:var(--text-muted)] px-3">{page} / {totalPages}</span>
              {page < totalPages && (
                <Link
                  href={`/${config.typeSlug}/${city.slug}?page=${page + 1}`}
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
          <p className="text-sm text-[color:var(--text-muted)]">
            No active {config.plural.toLowerCase()} in {city.name} right now.
          </p>
          <Link href={`/${config.typeSlug}`} className="mt-3 inline-block text-sm text-[color:var(--accent)] hover:underline">
            Browse {config.plural.toLowerCase()} in other GTA cities →
          </Link>
        </div>
      )}

      {/* SEO footer */}
      <div className="mt-14 pt-8 border-t border-[color:var(--border)] space-y-10">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Buyer guides</h3>
            <ul className="space-y-2 text-sm">
              {config.buyerGuides.map(g => (
                <li key={g.href}>
                  <Link href={g.href} className="text-[color:var(--accent)] hover:underline">{g.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mortgage-calculator" className="text-[color:var(--accent)] hover:underline">Mortgage calculator</Link>
              </li>
              <li>
                <Link href="/open-houses" className="text-[color:var(--accent)] hover:underline">
                  Open houses in {city.name}
                </Link>
              </li>
              <li>
                <Link href="/neighbourhoods" className="text-[color:var(--accent)] hover:underline">Browse by neighbourhood</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">
              {config.plural} in other cities
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {otherCities.map(c => (
                <Link
                  key={c.slug}
                  href={`/${config.typeSlug}/${c.slug}`}
                  className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">External resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.trreb.ca/index.php/market-news/market-stats"
                  target="_blank" rel="noopener noreferrer"
                  className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors"
                >
                  TRREB monthly market statistics ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.canada.ca/en/financial-consumer-agency/services/buying-home.html"
                  target="_blank" rel="noopener noreferrer"
                  className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors"
                >
                  Government of Canada: Buying a home ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.cmhc-schl.gc.ca/consumers/home-buying"
                  target="_blank" rel="noopener noreferrer"
                  className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors"
                >
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
