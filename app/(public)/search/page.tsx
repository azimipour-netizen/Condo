import type { Metadata } from 'next'
import { getMLSAdapter } from '@/lib/mls/adapter'
import type { SearchFilters } from '@/types/search'
import SearchPageClient from './SearchPageClient'

export const metadata: Metadata = { title: 'Search Properties' }

interface Props {
  searchParams: Promise<{
    q?: string
    priceMin?: string
    priceMax?: string
    bedsMin?: string
    type?: string
    neighbourhood?: string
  }>
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const filters: SearchFilters = {}

  if (sp.neighbourhood) filters.location = { type: 'neighbourhood', value: sp.neighbourhood }
  if (sp.priceMin) filters.priceMin = parseInt(sp.priceMin)
  if (sp.priceMax) filters.priceMax = parseInt(sp.priceMax)
  if (sp.bedsMin) filters.bedroomsMin = parseInt(sp.bedsMin)
  if (sp.type) filters.propertyTypes = [sp.type as import('@/types/property').PropertyType]

  const adapter = getMLSAdapter()
  const result = await adapter.searchListings(filters, 1, 24)

  return <SearchPageClient initialResult={result} initialFilters={filters} initialQuery={sp.q ?? ''} />
}
