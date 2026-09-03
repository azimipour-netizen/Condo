import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getMLSAdapter } from '@/lib/mls/adapter'
import PropertyDetailView from '@/components/property/PropertyDetailView'
import RecentlyViewed from '@/components/RecentlyViewed'
import FloatingContact from '@/components/FloatingContact'
import { auth } from '@/auth'
import { db } from '@/lib/db'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const adapter = getMLSAdapter()
  const property = await adapter.getListing(id)
  if (!property) return { title: 'Property Not Found' }

  const title = `${property.title} — $${property.price.toLocaleString()}`
  const description = property.description.slice(0, 155)
  const image = property.images[0]?.url

  return {
    title,
    description,
    alternates: { canonical: `/property/${id}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630, alt: property.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const adapter = getMLSAdapter()
  const property = await adapter.getListing(id)
  if (!property) notFound()

  let initialSaved = false
  try {
    const session = await auth()
    if (session?.user?.id) {
      const row = await (db as any).savedProperty.findUnique({
        where: { userId_propertyId: { userId: session.user.id, propertyId: property.id } },
      })
      initialSaved = !!row
    }
  } catch {}

  // Compute AVM from comparables — prefer sold, fallback to active
  let avm: { low: number; high: number; estimate: number; comparableCount: number } | null = null
  if (property.sqft && property.sqft > 0) {
    try {
      const sqft = property.sqft
      const sqftMin = sqft * 0.75
      const sqftMax = sqft * 1.25
      const city = property.location.city
      const since12m = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

      // First try: sold comparables in same city/type within 12 months
      let comps = await (db as any).property.findMany({
        where: {
          id: { not: property.id },
          propertyType: property.propertyType,
          city,
          status: 'sold',
          sqft: { gte: sqftMin, lte: sqftMax },
          updatedAt: { gte: since12m },
        },
        select: { price: true, sqft: true },
        take: 20,
      })

      // Fallback: active listings same area/type
      if (comps.length < 3) {
        const active = await (db as any).property.findMany({
          where: {
            id: { not: property.id },
            propertyType: property.propertyType,
            city,
            status: 'active',
            sqft: { gte: sqftMin, lte: sqftMax },
          },
          select: { price: true, sqft: true },
          take: 20,
        })
        comps = [...comps, ...active]
      }

      if (comps.length >= 2) {
        const ppsf = comps.map((c: { price: number | bigint | { toNumber: () => number }; sqft: number }) => {
          const p = typeof c.price === 'object' && 'toNumber' in c.price ? c.price.toNumber() : Number(c.price)
          return p / c.sqft!
        })
        const avgPpsf = ppsf.reduce((a: number, b: number) => a + b, 0) / ppsf.length
        // Simple year-built adjustment: older = -0.5% per year below 1990
        const builtAdj = property.yearBuilt && property.yearBuilt < 1990
          ? 1 - (1990 - property.yearBuilt) * 0.003
          : 1
        const estimate = Math.round((avgPpsf * sqft * builtAdj) / 5000) * 5000
        avm = {
          estimate,
          low: Math.round(estimate * 0.91 / 5000) * 5000,
          high: Math.round(estimate * 1.09 / 5000) * 5000,
          comparableCount: comps.length,
        }
      }
    } catch {}
  }

  // Market demand: classic months-of-supply heuristic (active inventory ÷
  // monthly sale rate). <2mo = seller's market, 2-4mo = balanced, >4mo =
  // buyer's market. Needs a minimum sample of recent sales to mean anything —
  // a handful of sold comps in 90 days is too noisy to classify confidently.
  let marketDemand: { activeCount: number; soldCount90d: number; monthsOfSupply: number; label: 'seller' | 'balanced' | 'buyer' } | null = null
  try {
    const since90d = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    const [activeCount, soldCount90d] = await Promise.all([
      (db as any).property.count({
        where: { propertyType: property.propertyType, city: property.location.city, status: 'active', transactionType: 'sale' },
      }),
      (db as any).property.count({
        where: { propertyType: property.propertyType, city: property.location.city, status: 'sold', soldDate: { gte: since90d } },
      }),
    ])
    if (soldCount90d >= 5) {
      const monthlySaleRate = soldCount90d / 3
      const monthsOfSupply = Math.round((activeCount / monthlySaleRate) * 10) / 10
      marketDemand = {
        activeCount,
        soldCount90d,
        monthsOfSupply,
        label: monthsOfSupply < 2 ? 'seller' : monthsOfSupply <= 4 ? 'balanced' : 'buyer',
      }
    }
  } catch {}

  const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'

  // schema.org models the physical unit separately from the listing (the
  // CreativeWork) via `about` — an Accommodation subtype carries address,
  // geo, and room counts. Falls back to the generic Residence for property
  // types with no closer subtype (townhouse/multiplex/commercial/land).
  const ACCOMMODATION_TYPE: Record<string, string> = {
    condo: 'Apartment',
    detached: 'SingleFamilyResidence',
    'semi-detached': 'SingleFamilyResidence',
  }

  const additionalProperty: Array<{ '@type': string; name: string; value: number; unitText: string }> = []
  if (property.taxes) {
    additionalProperty.push({ '@type': 'PropertyValue', name: 'AnnualPropertyTax', value: property.taxes, unitText: 'CAD' })
  }
  if (property.maintenanceFee) {
    additionalProperty.push({ '@type': 'PropertyValue', name: 'MonthlyMaintenanceFee', value: property.maintenanceFee, unitText: 'CAD' })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${BASE}/property/${property.id}#listing`,
    name: property.title,
    description: property.description.slice(0, 500),
    url: `${BASE}/property/${property.id}`,
    image: property.images.map(img => img.url),
    datePosted: property.listedAt ?? undefined,
    about: {
      '@type': ACCOMMODATION_TYPE[property.propertyType] ?? 'Residence',
      name: property.title,
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.location.address ?? undefined,
        addressLocality: property.location.city,
        addressRegion: property.location.province,
        postalCode: property.location.postalCode ?? undefined,
        addressCountry: 'CA',
      },
      geo: property.location.latitude != null && property.location.longitude != null ? {
        '@type': 'GeoCoordinates',
        latitude: property.location.latitude,
        longitude: property.location.longitude,
      } : undefined,
      numberOfBedroomsTotal: property.bedrooms,
      numberOfBathroomsTotal: property.bathroomsTotal,
      floorSize: property.sqft ? { '@type': 'QuantitativeValue', value: property.sqft, unitCode: 'FTK' } : undefined,
      ...(additionalProperty.length ? { additionalProperty } : {}),
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'CAD',
      availability: property.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      // References the same Organization entity declared on the homepage
      // (app/page.tsx, @id `${BASE}/#organization`) rather than repeating
      // the full object on every one of ~5000 listing pages.
      seller: { '@id': `${BASE}/#organization` },
    },
  }

  // Mirrors the visible breadcrumb rendered in PropertyDetailView's top bar
  // (Home > city > address) — structured data should describe what a
  // visitor actually sees, not a hierarchy invented only for markup.
  const breadcrumbItems = [
    { name: 'Home', url: BASE },
    { name: property.location.city, url: `${BASE}/search?city=${encodeURIComponent(property.location.city)}` },
    { name: property.location.address ?? property.title },
  ]
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PropertyDetailView property={property} initialSaved={initialSaved} avm={avm} marketDemand={marketDemand} />
      <RecentlyViewed />
      <FloatingContact />
    </>
  )
}
