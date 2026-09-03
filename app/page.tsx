import type { Metadata } from 'next'
import HomeExperience from '@/components/ai/HomeExperience'
import type { PropertySummary } from '@/types/property'
import { searchListingsDb } from '@/lib/search/db-search'

export const metadata: Metadata = {
  title: 'Condohill — Toronto Real Estate',
  description: 'Find homes, condos, and investment properties across the GTA. AI-powered search with real listings.',
  alternates: { canonical: '/' },
}

async function getHomeData() {
  try {
    const result = await searchListingsDb({}, 1, 6)
    const featured = result.properties as PropertySummary[]
    const activeCount = result.total
    return { featured, activeCount, avgPrice: null }
  } catch {
    return { featured: [], activeCount: 0, avgPrice: null }
  }
}

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'

// Organization + WebSite/SearchAction JSON-LD — previously absent from the
// homepage entirely (confirmed by three independent audit passes). Every
// fact here is real and already published elsewhere on the site (footer
// address/phone, social links) — no license/registration number is
// included, since that's a real RECO business fact this schema must not
// guess at.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE}/#organization`,
  name: 'Condohill',
  url: BASE,
  logo: `${BASE}/Toplogo.png`,
  email: 'condohill.inc@gmail.com',
  telephone: '+1-905-909-6600',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '45 Harbour Square #4',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  sameAs: [
    'https://instagram.com/condohill',
    'https://facebook.com/condohill',
    'https://linkedin.com/company/condohill',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE}/#website`,
  url: BASE,
  name: 'Condohill',
  publisher: { '@id': `${BASE}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default async function HomePage() {
  const { featured, activeCount, avgPrice } = await getHomeData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <HomeExperience featured={featured} activeCount={activeCount} avgPrice={avgPrice} />
    </>
  )
}
