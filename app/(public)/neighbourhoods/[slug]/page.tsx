import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import PropertyCard from '@/components/property/PropertyCard'
import type { PropertySummary } from '@/types/property'

const NEIGHBOURHOODS: Record<string, { name: string; description: string; about: string }> = {
  annex: {
    name: 'The Annex',
    description: 'Victorian homes, U of T, bookshops, and Bloor Street.',
    about: 'The Annex is one of Toronto\'s most storied neighbourhoods, stretching along Bloor Street West. Known for its Victorian and Edwardian homes, proximity to the University of Toronto, and a vibrant mix of students, professors, and long-time residents. You\'ll find independent bookstores, cafés, and some of the city\'s best restaurants.',
  },
  yorkville: {
    name: 'Yorkville',
    description: 'Luxury condos, designer boutiques, and fine dining.',
    about: 'Yorkville is Toronto\'s most prestigious address. Once a bohemian enclave in the 1960s, it\'s now home to flagship designer stores, Michelin-starred restaurants, and some of the city\'s most sought-after luxury condominiums. A short walk to Rosedale and the ravine system.',
  },
  leslieville: {
    name: 'Leslieville',
    description: 'Hip cafés, art galleries, and Queen Street East.',
    about: 'Leslieville is East Toronto\'s creative hub, anchored by Queen Street East. Former industrial buildings have been transformed into loft condos, art studios, and boutique restaurants. Family-friendly streets with excellent schools and a walkable commercial strip.',
  },
  'king-west': {
    name: 'King West',
    description: 'Trendy condos, rooftop patios, and tech startups.',
    about: 'King West (King Street West) is the heart of Toronto\'s condo boom. Once a garment district, it\'s now packed with glass towers, converted lofts, trendy restaurants, and some of the city\'s busiest nightlife. A hub for Toronto\'s tech and creative sector.',
  },
  distillery: {
    name: 'Distillery District',
    description: 'Victorian industrial lofts and cobblestone charm.',
    about: 'The Distillery District is a pedestrian-only historic district built on the site of the Gooderham and Worts Distillery. Beautifully preserved Victorian industrial architecture now houses galleries, restaurants, boutiques, and loft-style condominiums. Hosts the famous Toronto Christmas Market.',
  },
  rosedale: {
    name: 'Rosedale',
    description: 'Prestigious detached homes and ravine trails.',
    about: 'Rosedale is among Toronto\'s most exclusive addresses. Winding ravine-bordered streets are lined with grand detached homes, many dating from the late 19th century. Exceptional proximity to downtown, top private schools, and the Don Valley ravine trail system.',
  },
  'forest-hill': {
    name: 'Forest Hill',
    description: 'Stately homes, top schools, and quiet streets.',
    about: 'Forest Hill is a quiet, prestigious neighbourhood known for its grand single-family homes, manicured streets, and proximity to the city\'s top private schools. The area retains an almost village-like feel, with local shops along Spadina Road and easy TTC access.',
  },
  beaches: {
    name: 'The Beaches',
    description: 'Lakefront living, boardwalk, and family streets.',
    about: 'The Beaches (or "The Beach") is a lakefront neighbourhood in East Toronto with a distinct small-town feel. A 5 km boardwalk runs along Lake Ontario, and Queen Street East is lined with local shops and restaurants. Popular with young families and retirees alike.',
  },
  'liberty-village': {
    name: 'Liberty Village',
    description: 'Industrial-chic condos and weekend markets.',
    about: 'Liberty Village transformed from a Victorian industrial district into one of Toronto\'s densest condo neighbourhoods. The neighbourhood is popular with young professionals for its walkability, transit access, and proximity to the lakeshore. Farmers\' markets and community events make it feel more than just a condo cluster.',
  },
  midtown: {
    name: 'Midtown',
    description: 'Yonge & Eglinton — transit-rich and family-friendly.',
    about: 'Midtown Toronto, centred on Yonge Street and Eglinton Avenue, is one of the city\'s fastest-growing nodes. Excellent transit (subway + future Eglinton Crosstown LRT), excellent schools, and a mix of high-rise condos and established low-rise neighbourhoods make it a top choice for families and professionals.',
  },
  'downtown-core': {
    name: 'Downtown Core',
    description: 'Financial district, condos, and urban convenience.',
    about: 'The Downtown Core is Toronto\'s urban centre — home to Bay Street\'s financial towers, Union Station, the Entertainment District, and thousands of condominiums. Everything is walkable: PATH underground network, waterfront access, and the city\'s best transit connections.',
  },
  'north-york': {
    name: 'North York',
    description: 'Diverse communities, parks, and great value.',
    about: 'North York offers some of the GTA\'s best value relative to its transit access and amenities. A diverse, multicultural community with excellent subway access (Yonge line), large parks, and a growing restaurant scene along Yonge Street and Sheppard Avenue.',
  },
}

const PER_PAGE = 24

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const hood = NEIGHBOURHOODS[slug]
  if (!hood) return { title: 'Not Found' }
  return {
    title: `${hood.name} Real Estate — Toronto`,
    description: `Browse active MLS® listings in ${hood.name}, Toronto. ${hood.description} Real-time prices, photos, and property details.`,
  }
}

async function getNeighbourhoodData(name: string, page: number) {
  const where = { status: 'active', neighbourhood: { contains: name, mode: 'insensitive' as const } }
  try {
    const [listingsRaw, stats] = await Promise.all([
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
      (db as any).property.aggregate({
        where,
        _count: { id: true },
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
      }),
    ])

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

function fmtPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  return `$${Math.round(n / 1000)}K`
}

export default async function NeighbourhoodPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const hood = NEIGHBOURHOODS[slug]
  if (!hood) notFound()

  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const { listings, count, avgPrice, minPrice, maxPrice } = await getNeighbourhoodData(hood.name, page)
  const totalPages = Math.ceil(count / PER_PAGE)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
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
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{hood.name}</h1>
        <p className="mt-1 text-base text-[color:var(--text-muted)]">{hood.description}</p>
      </div>

      {/* Stats */}
      {count > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-4">
            <p className="text-2xl font-bold text-[color:var(--foreground)] tabular-nums">{count}</p>
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

      {/* About */}
      <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-6 mb-10">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-2">About {hood.name}</h2>
        <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{hood.about}</p>
      </div>

      {/* Listings */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[color:var(--foreground)]">
          {count > 0
            ? `${count.toLocaleString()} Active Listing${count !== 1 ? 's' : ''}${totalPages > 1 ? ` — page ${page} of ${totalPages}` : ''}`
            : 'No active listings'}
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
                  href={`/neighbourhoods/${slug}?page=${page - 1}`}
                  className="px-4 py-2 text-sm border border-[color:var(--border)] rounded-xl text-[color:var(--foreground)] hover:border-[color:var(--accent)] transition-colors"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-[color:var(--text-muted)] px-3">
                {page} / {totalPages}
              </span>
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

      {/* Internal + external linking — SEO template */}
      <div className="mt-14 pt-8 border-t border-[color:var(--border)] space-y-10">

        {/* Row 1: Buyer guides + tools */}
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Buyer guides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog/how-much-house-can-i-afford" className="text-[color:var(--accent)] hover:underline">How much house can I afford?</Link></li>
              <li><Link href="/blog/how-much-income-to-buy-a-home" className="text-[color:var(--accent)] hover:underline">How much income do I need to buy a home?</Link></li>
              <li><Link href="/blog/steps-to-buying-a-home-in-the-gta" className="text-[color:var(--accent)] hover:underline">Steps to buying a home in the GTA</Link></li>
              <li><Link href="/blog/how-much-down-payment-to-buy-a-home" className="text-[color:var(--accent)] hover:underline">How much down payment do I need?</Link></li>
              <li><Link href="/blog/is-now-a-good-time-to-buy-a-home" className="text-[color:var(--accent)] hover:underline">Is now a good time to buy in the GTA?</Link></li>
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

        {/* Row 2: Nearby city pages + external resources */}
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Search by city</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                { slug: 'toronto', name: 'Toronto' },
                { slug: 'north-york', name: 'North York' },
                { slug: 'mississauga', name: 'Mississauga' },
                { slug: 'vaughan', name: 'Vaughan' },
                { slug: 'markham', name: 'Markham' },
                { slug: 'richmond-hill', name: 'Richmond Hill' },
                { slug: 'oakville', name: 'Oakville' },
                { slug: 'brampton', name: 'Brampton' },
              ].map(c => (
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
