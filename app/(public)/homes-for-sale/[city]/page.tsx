import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import PropertyCard from '@/components/property/PropertyCard'
import type { PropertySummary, PropertyType } from '@/types/property'
import { GTA_CITIES, findGtaCity, cityWhereClause, type GtaCity } from '@/lib/seo/gta-cities'

interface Props {
  params: Promise<{ city: string }>
}

export function generateStaticParams() {
  return GTA_CITIES.map(c => ({ city: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const city = findGtaCity(slug)
  if (!city) return { title: 'Not Found' }
  const isNorthYork = city.slug === 'north-york'
  return {
    title: isNorthYork
      ? `North York Real Estate | Homes for Sale in North York | Condohill`
      : `Homes for Sale in ${city.name} | Condohill`,
    description: isNorthYork
      ? `Browse active MLS® listings in North York, Toronto — houses, condos, and townhouses in Willowdale, Bayview Village, Bathurst Manor, and surrounding neighbourhoods.`
      : `Browse active MLS® listings for sale in ${city.name}, Ontario. Real-time prices, photos, and property details for houses, condos, and townhouses.`,
  }
}

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

async function getCityData(city: GtaCity) {
  const where = { status: 'active', transactionType: 'sale', ...cityWhereClause(city) }
  try {
    const [listingsRaw, stats, typeCounts] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (db as any).property.findMany({
        where,
        orderBy: { listedAt: 'desc' },
        take: 9,
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
        where, _count: { id: true }, _avg: { price: true }, _min: { price: true }, _max: { price: true },
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

export default async function CityLandingPage({ params }: Props) {
  const { city: slug } = await params
  const city = findGtaCity(slug)
  if (!city) notFound()

  const { listings, count, avgPrice, minPrice, maxPrice, typeCountMap } = await getCityData(city)
  const otherCities = GTA_CITIES.filter(c => c.slug !== city.slug).slice(0, 8)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[color:var(--accent)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/homes-for-sale" className="hover:text-[color:var(--accent)] transition-colors">Homes for Sale</Link>
        <span>/</span>
        <span className="text-[color:var(--foreground)]">{city.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
          {city.slug === 'north-york' ? 'North York Real Estate' : `Homes for Sale in ${city.name}`}
        </h1>
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

      {/* Property type quick links */}
      {Object.keys(typeCountMap).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {TYPE_LABELS.filter(t => typeCountMap[t.value] > 0).map(t => (
            <Link
              key={t.value}
              href={`/search?city=${encodeURIComponent(city.dbValue ?? city.name)}&type=${t.value}`}
              className="px-4 py-2 text-sm bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
            >
              {t.label} <span className="text-[color:var(--text-faint)]">({typeCountMap[t.value]})</span>
            </Link>
          ))}
        </div>
      )}

      {/* Listings */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[color:var(--foreground)]">
          {count > 0 ? `${count.toLocaleString()} Active Listing${count !== 1 ? 's' : ''}` : 'No active listings'}
        </h2>
        <Link
          href={`/search?city=${encodeURIComponent(city.dbValue ?? city.name)}`}
          className="text-sm text-[color:var(--accent)] hover:underline font-medium"
        >
          View all →
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(listings as PropertySummary[]).map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">No active listings in {city.name} right now.</p>
          <Link href="/search" className="mt-3 inline-block text-sm text-[color:var(--accent)] hover:underline">
            Browse all listings →
          </Link>
        </div>
      )}

      {/* Related tools & other cities — internal linking per SEO strategy */}
      <div className="mt-14 grid sm:grid-cols-2 gap-8 pt-8 border-t border-[color:var(--border)]">
        <div>
          <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Tools</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/mortgage-calculator" className="text-[color:var(--accent)] hover:underline">Mortgage calculator</Link></li>
            <li><Link href="/open-houses" className="text-[color:var(--accent)] hover:underline">Upcoming open houses</Link></li>
            <li><Link href="/neighbourhoods" className="text-[color:var(--accent)] hover:underline">Browse by neighbourhood</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Nearby cities</h3>
          <div className="flex flex-wrap gap-2">
            {otherCities.map(c => (
              <Link
                key={c.slug}
                href={`/homes-for-sale/${c.slug}`}
                className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
