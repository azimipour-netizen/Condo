'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { SearchResult, SearchFilters, BoundingBox } from '@/types/search'
import type { PropertyType } from '@/types/property'
import PropertyResultsPanel from '@/components/property/PropertyResultsPanel'

// Load map client-side only (uses browser APIs)
const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), { ssr: false })

interface Props {
  initialResult: SearchResult
  initialFilters: SearchFilters
  initialQuery: string
}

const PROPERTY_TYPES = [
  { value: '', label: 'All types' },
  { value: 'detached', label: 'Detached' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
]

const BED_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

export default function SearchPageClient({ initialResult, initialFilters, initialQuery }: Props) {
  const [result, setResult] = useState(initialResult)
  const [filters, setFilters] = useState(initialFilters)
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [priceMin, setPriceMin] = useState(initialFilters.priceMin?.toString() ?? '')
  const [priceMax, setPriceMax] = useState(initialFilters.priceMax?.toString() ?? '')
  const [bedsMin, setBedsMin] = useState(initialFilters.bedroomsMin?.toString() ?? '')
  const [propType, setPropType] = useState(initialFilters.propertyTypes?.[0] ?? '')
  // Suppress map-driven search immediately after a manual search fires
  const suppressMapSearch = useRef(false)

  const search = useCallback(async (nextFilters: SearchFilters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (nextFilters.location?.value) params.set('neighbourhood', nextFilters.location.value)
      if (nextFilters.priceMin) params.set('priceMin', String(nextFilters.priceMin))
      if (nextFilters.priceMax) params.set('priceMax', String(nextFilters.priceMax))
      if (nextFilters.bedroomsMin) params.set('bedroomsMin', String(nextFilters.bedroomsMin))
      if (nextFilters.propertyTypes?.[0]) params.set('propertyType', nextFilters.propertyTypes[0] as string)
      if (nextFilters.bbox) {
        params.set('north', String(nextFilters.bbox.north))
        params.set('south', String(nextFilters.bbox.south))
        params.set('east', String(nextFilters.bbox.east))
        params.set('west', String(nextFilters.bbox.west))
      }

      const res = await fetch(`/api/properties?${params}`)
      if (res.ok) {
        const data = await res.json()
        setResult(data)
        setFilters(nextFilters)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  function applyFilters() {
    suppressMapSearch.current = true
    setTimeout(() => { suppressMapSearch.current = false }, 1500)
    const next: SearchFilters = {}
    if (query) next.location = { type: 'neighbourhood', value: query }
    if (priceMin) next.priceMin = parseInt(priceMin)
    if (priceMax) next.priceMax = parseInt(priceMax)
    if (bedsMin) next.bedroomsMin = parseInt(bedsMin)
    if (propType) next.propertyTypes = [propType as PropertyType]
    search(next)
  }

  const handleBoundsChange = useCallback((bbox: BoundingBox) => {
    if (suppressMapSearch.current) return
    // Viewport-based search: keep existing filters, add bbox
    search({ ...filters, location: { type: 'bbox', bbox }, bbox })
  }, [filters, search])

  const handleMarkerClick = useCallback((id: string) => {
    setActiveId(id)
    // Scroll the card into view in the results panel
    document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[color:var(--background)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[color:var(--bg-surface)] border-b border-[color:var(--border)] flex-wrap">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8.5 2L3.5 7L8.5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>
        <div className="h-4 w-px bg-[color:var(--border)] shrink-0" />

        <div className="flex items-center gap-2 flex-1 min-w-48">
          <input
            type="text"
            placeholder="Neighbourhood, city…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            className="flex-1 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-3 py-1.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--text-faint)]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={propType}
            onChange={e => setPropType(e.target.value)}
            className="bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-2.5 py-1.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
          >
            {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          <select
            value={bedsMin}
            onChange={e => setBedsMin(e.target.value)}
            className="bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-2.5 py-1.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
          >
            {BED_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.value ? `${b.label} bed` : 'Beds'}</option>)}
          </select>

          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="Min $"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-24 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-2.5 py-1.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--text-faint)]"
            />
            <span className="text-[color:var(--text-faint)] text-xs">–</span>
            <input
              type="number"
              placeholder="Max $"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-24 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-2.5 py-1.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--text-faint)]"
            />
          </div>

          <button
            onClick={applyFilters}
            disabled={loading}
            className="bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>

          {/* Mobile map/list toggle */}
          <button
            onClick={() => setShowMap(m => !m)}
            className="lg:hidden flex items-center gap-1.5 border border-[color:var(--border)] text-sm px-3 py-1.5 rounded-lg text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors"
          >
            {showMap ? (
              <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg> List</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4.5C2 3.4 2.9 2.5 4 2.5L5.5 2.5L5.5 11.5L4 11.5C2.9 11.5 2 10.6 2 9.5L2 4.5Z" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 2.5L10 2.5C11.1 2.5 12 3.4 12 4.5L12 9.5C12 10.6 11.1 11.5 10 11.5L7.5 11.5L7.5 2.5Z" stroke="currentColor" strokeWidth="1.2"/></svg> Map</>
            )}
          </button>
        </div>
      </div>

      {/* Split: map + results */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map — desktop always visible, mobile toggled */}
        <div className={`${showMap ? 'flex' : 'hidden'} lg:flex flex-1 relative`}>
          <PropertyMap
            properties={result.properties}
            activeId={activeId}
            onMarkerClick={handleMarkerClick}
            onBoundsChange={handleBoundsChange}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Results panel — desktop fixed width, mobile full width unless map shown */}
        <div className={`${showMap ? 'hidden lg:flex' : 'flex'} w-full lg:w-[480px] xl:w-[540px] shrink-0 overflow-hidden flex-col border-l border-[color:var(--border)]`}>
          <PropertyResultsPanel
            result={result}
            filters={filters}
            activeId={activeId}
            onActiveChange={setActiveId}
          />
        </div>
      </div>
    </div>
  )
}
