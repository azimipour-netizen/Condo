import type { Metadata } from 'next'
import { searchListingsDb } from '@/lib/search/db-search'
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
    city?: string
  }>
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const filters: SearchFilters = {}

  if (sp.city) filters.location = { type: 'city', value: sp.city }
  if (sp.neighbourhood) filters.location = { type: 'neighbourhood', value: sp.neighbourhood }
  if (sp.priceMin) filters.priceMin = parseInt(sp.priceMin)
  if (sp.priceMax) filters.priceMax = parseInt(sp.priceMax)
  if (sp.bedsMin) filters.bedroomsMin = parseInt(sp.bedsMin)
  if (sp.type) filters.propertyTypes = [sp.type as import('@/types/property').PropertyType]

  let result: Awaited<ReturnType<typeof searchListingsDb>>
  try {
    result = await searchListingsDb(filters, 1, 20)
  } catch {
    result = { properties: [], total: 0, page: 1, totalPages: 0, appliedFilters: filters }
  }

  return <SearchPageClient initialResult={result} initialFilters={filters} initialQuery={sp.q ?? ''} />
}
