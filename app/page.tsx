import type { Metadata } from 'next'
import HomeExperience from '@/components/ai/HomeExperience'
import type { PropertySummary } from '@/types/property'
import { getMLSAdapter } from '@/lib/mls/adapter'

export const metadata: Metadata = {
  title: 'Condohill — Toronto Real Estate',
  description: 'Find homes, condos, and investment properties across the GTA. AI-powered search with real listings.',
}

async function getHomeData() {
  try {
    const adapter = getMLSAdapter()
    const result = await adapter.searchListings({}, 1, 6)
    const featured = result.properties as PropertySummary[]
    const activeCount = result.total
    return { featured, activeCount, avgPrice: null }
  } catch {
    return { featured: [], activeCount: 0, avgPrice: null }
  }
}

export default async function HomePage() {
  const { featured, activeCount, avgPrice } = await getHomeData()

  return <HomeExperience featured={featured} activeCount={activeCount} avgPrice={avgPrice} />
}
