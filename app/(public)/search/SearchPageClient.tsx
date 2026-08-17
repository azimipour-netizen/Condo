'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { SearchResult, SearchFilters, BoundingBox } from '@/types/search'
import type { PropertyType } from '@/types/property'
import PropertyCard from '@/components/property/PropertyCard'

const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), { ssr: false })

interface Props {
  initialResult: SearchResult
  initialFilters: SearchFilters
  initialQuery: string
}

const PRICE_PRESETS = [
  { label: 'Any', min: null, max: null },
  { label: '< $600K', min: null, max: 600_000 },
  { label: '$600K–$1M', min: 600_000, max: 1_000_000 },
  { label: '$1M–$1.5M', min: 1_000_000, max: 1_500_000 },
  { label: '$1.5M+', min: 1_500_000, max: null },
]

const PROP_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'detached', label: 'Detached' },
  { value: 'semi-detached', label: 'Semi' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
]

const BED_OPTS = [1, 2, 3, 4]
const BATH_OPTS = [1, 2, 3]

export default function SearchPageClient({ initialResult, initialFilters, initialQuery }: Props) {
  const [result, setResult] = useState(initialResult)
  const [filters, setFilters] = useState(initialFilters)
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceMin, setPriceMin] = useState(initialFilters.priceMin?.toString() ?? '')
  const [priceMax, setPriceMax] = useState(initialFilters.priceMax?.toString() ?? '')
  const [bedsMin, setBedsMin] = useState(initialFilters.bedroomsMin?.toString() ?? '')
  const [bathsMin, setBathsMin] = useState(initialFilters.bathroomsMin?.toString() ?? '')
  const [propTypes, setPropTypes] = useState<PropertyType[]>(initialFilters.propertyTypes ?? [])
  const [hasParking, setHasParking] = useState(false)

  // Results panel
  const [resultsOpen, setResultsOpen] = useState(true)
  const [showMobileList, setShowMobileList] = useState(false)

  const suppressMapSearch = useRef(false)
  const filterRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (nextFilters: SearchFilters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (nextFilters.location?.value) params.set('neighbourhood', nextFilters.location.value)
      if (nextFilters.priceMin) params.set('priceMin', String(nextFilters.priceMin))
      if (nextFilters.priceMax) params.set('priceMax', String(nextFilters.priceMax))
      if (nextFilters.bedroomsMin) params.set('bedroomsMin', String(nextFilters.bedroomsMin))
      if (nextFilters.bathroomsMin) params.set('bathroomsMin', String(nextFilters.bathroomsMin))
      if (nextFilters.hasParking) params.set('hasParking', 'true')
      if (nextFilters.propertyTypes?.[0]) params.set('propertyType', nextFilters.propertyTypes[0] as string)
      if (nextFilters.bbox) {
        params.set('north', String(nextFilters.bbox.north))
        params.set('south', String(nextFilters.bbox.south))
        params.set('east', String(nextFilters.bbox.east))
        params.set('west', String(nextFilters.bbox.west))
      }
      params.set('limit', '50')
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
    setFilterOpen(false)
    const next: SearchFilters = {}
    if (query) next.location = { type: 'neighbourhood', value: query }
    if (priceMin) next.priceMin = parseInt(priceMin)
    if (priceMax) next.priceMax = parseInt(priceMax)
    if (bedsMin) next.bedroomsMin = parseInt(bedsMin)
    if (bathsMin) next.bathroomsMin = parseInt(bathsMin)
    if (propTypes.length) next.propertyTypes = propTypes
    if (hasParking) next.hasParking = true
    search(next)
  }

  function clearFilters() {
    setPriceMin(''); setPriceMax('')
    setBedsMin(''); setBathsMin('')
    setPropTypes([]); setHasParking(false)
  }

  function toggleType(t: PropertyType) {
    setPropTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const handleBoundsChange = useCallback((bbox: BoundingBox) => {
    if (suppressMapSearch.current) return
    search({ ...filters, location: { type: 'bbox', bbox }, bbox })
  }, [filters, search])

  const handleMarkerClick = useCallback((id: string) => {
    setActiveId(id)
    setResultsOpen(true)
    document.getElementById(`fcard-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (priceMin || priceMax) n++
    if (bedsMin) n++
    if (bathsMin) n++
    if (propTypes.length) n++
    if (hasParking) n++
    return n
  }, [priceMin, priceMax, bedsMin, bathsMin, propTypes, hasParking])

  const pricePresetActive = (p: typeof PRICE_PRESETS[0]) =>
    priceMin === (p.min?.toString() ?? '') && priceMax === (p.max?.toString() ?? '')

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      {/* ── Full-screen map ──────────────────────────────────── */}
      <div className={`absolute inset-0 ${showMobileList ? 'hidden md:block' : 'block'}`}>
        <PropertyMap
          properties={result.properties}
          activeId={activeId}
          onMarkerClick={handleMarkerClick}
          onBoundsChange={handleBoundsChange}
          className="w-full h-full"
        />
      </div>

      {/* ── Floating top bar ─────────────────────────────────── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 w-[min(680px,calc(100vw-2rem))]">
        {/* Back home */}
        <Link
          href="/"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-[color:var(--bg-surface)] border border-[color:var(--border)] shadow-lg text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors backdrop-blur-md"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Search input */}
        <div className="flex-1 flex items-center gap-2 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl shadow-lg px-3 py-2 backdrop-blur-md">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[color:var(--text-faint)] shrink-0">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="City, neighbourhood…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            className="flex-1 bg-transparent text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none min-w-0"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[color:var(--text-faint)] hover:text-[color:var(--foreground)] transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setFilterOpen(o => !o)}
          className={[
            'shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-xl border shadow-lg backdrop-blur-md text-sm font-medium transition-all',
            filterOpen || activeFilterCount > 0
              ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)]'
              : 'bg-[color:var(--bg-surface)] text-[color:var(--text-muted)] border-[color:var(--border)] hover:text-[color:var(--foreground)]',
          ].join(' ')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-0.5 text-xs font-bold bg-white/25 text-white w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Search button */}
        <button
          onClick={applyFilters}
          disabled={loading}
          className="shrink-0 h-9 px-4 bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white text-sm font-semibold rounded-xl shadow-lg transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
                <path d="M11 6A5 5 0 0 0 6 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
          ) : 'Search'}
        </button>
      </div>

      {/* ── Floating filter drawer ────────────────────────────── */}
      {filterOpen && (
        <div ref={filterRef} className="absolute top-[72px] left-1/2 -translate-x-1/2 z-20 w-[min(680px,calc(100vw-2rem))]">
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl shadow-2xl p-5 flex flex-col gap-5 backdrop-blur-xl">

            {/* Property type */}
            <section>
              <p className="text-[10px] font-semibold text-[color:var(--text-faint)] uppercase tracking-widest mb-2.5">Property type</p>
              <div className="flex flex-wrap gap-2">
                {PROP_TYPES.map(t => (
                  <FilterChip key={t.value} active={propTypes.includes(t.value)} onClick={() => toggleType(t.value)}>
                    {t.label}
                  </FilterChip>
                ))}
              </div>
            </section>

            {/* Beds + Baths */}
            <div className="flex gap-6 flex-wrap">
              <section className="flex-1 min-w-40">
                <p className="text-[10px] font-semibold text-[color:var(--text-faint)] uppercase tracking-widest mb-2.5">Bedrooms</p>
                <div className="flex gap-1.5">
                  <FilterChip active={!bedsMin} onClick={() => setBedsMin('')}>Any</FilterChip>
                  {BED_OPTS.map(n => (
                    <FilterChip key={n} active={bedsMin === String(n)} onClick={() => setBedsMin(prev => prev === String(n) ? '' : String(n))}>
                      {n}+
                    </FilterChip>
                  ))}
                </div>
              </section>
              <section className="flex-1 min-w-40">
                <p className="text-[10px] font-semibold text-[color:var(--text-faint)] uppercase tracking-widest mb-2.5">Bathrooms</p>
                <div className="flex gap-1.5">
                  <FilterChip active={!bathsMin} onClick={() => setBathsMin('')}>Any</FilterChip>
                  {BATH_OPTS.map(n => (
                    <FilterChip key={n} active={bathsMin === String(n)} onClick={() => setBathsMin(prev => prev === String(n) ? '' : String(n))}>
                      {n}+
                    </FilterChip>
                  ))}
                </div>
              </section>
            </div>

            {/* Price */}
            <section>
              <p className="text-[10px] font-semibold text-[color:var(--text-faint)] uppercase tracking-widest mb-2.5">Price range</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {PRICE_PRESETS.map(p => (
                  <FilterChip
                    key={p.label}
                    active={pricePresetActive(p)}
                    onClick={() => { setPriceMin(p.min?.toString() ?? ''); setPriceMax(p.max?.toString() ?? '') }}
                  >
                    {p.label}
                  </FilterChip>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  className="flex-1 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none focus:border-[color:var(--accent)] transition-colors"
                />
                <span className="text-[color:var(--text-faint)] text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  className="flex-1 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none focus:border-[color:var(--accent)] transition-colors"
                />
              </div>
            </section>

            {/* Extras */}
            <section>
              <p className="text-[10px] font-semibold text-[color:var(--text-faint)] uppercase tracking-widest mb-2.5">Extras</p>
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
                <div
                  onClick={() => setHasParking(p => !p)}
                  className={[
                    'w-10 h-5.5 rounded-full transition-colors relative shrink-0',
                    hasParking ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--border)]'
                  ].join(' ')}
                  style={{ height: '22px' }}
                >
                  <div className={[
                    'absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200',
                    hasParking ? 'translate-x-[20px]' : 'translate-x-0.5'
                  ].join(' ')} />
                </div>
                <span className="text-sm text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">Parking included</span>
              </label>
            </section>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-1 border-t border-[color:var(--border)]">
              <button
                onClick={clearFilters}
                className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
              <button
                onClick={applyFilters}
                className="bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white text-sm font-semibold px-6 py-2 rounded-xl transition-colors"
              >
                {loading ? 'Searching…' : 'Show results'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating results panel (right) ───────────────────── */}
      <div
        className={[
          'absolute right-4 top-4 bottom-4 z-10 transition-all duration-300 ease-in-out',
          showMobileList ? 'inset-x-0 right-0 left-0 bottom-0 top-0 rounded-none' : '',
          resultsOpen ? 'w-[360px] xl:w-[400px]' : 'w-10',
        ].join(' ')}
      >
        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setResultsOpen(o => !o)}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-6 h-12 items-center justify-center bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full shadow-lg text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors"
          title={resultsOpen ? 'Hide listings' : 'Show listings'}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d={resultsOpen ? 'M3.5 2L7 5L3.5 8' : 'M6.5 2L3 5L6.5 8'}
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>

        {resultsOpen && (
          <div className="h-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">

            {/* Header */}
            <div className="px-4 py-3 border-b border-[color:var(--border)] shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    {result.total.toLocaleString()} {result.total === 1 ? 'listing' : 'listings'}
                  </p>
                  {filters.location?.value && (
                    <p className="text-xs text-[color:var(--text-muted)] mt-0.5">near {filters.location.value}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {loading && (
                    <svg className="animate-spin w-4 h-4 text-[color:var(--accent)]" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
                      <path d="M14 8A6 6 0 0 0 8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                  {/* Mobile close */}
                  <button
                    onClick={() => setShowMobileList(false)}
                    className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg text-[color:var(--text-muted)] hover:bg-[color:var(--bg-surface-2)] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card list */}
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
              {result.properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="18" cy="18" r="11" stroke="currentColor" strokeWidth="1.5" className="text-[color:var(--border)]"/>
                    <path d="M27 27L34 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[color:var(--border)]"/>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-[color:var(--foreground)]">No listings found</p>
                    <p className="text-xs text-[color:var(--text-muted)] mt-1">Try adjusting filters or moving the map</p>
                  </div>
                </div>
              ) : result.properties.map(p => (
                <div
                  key={p.id}
                  id={`fcard-${p.id}`}
                  onMouseEnter={() => setActiveId(p.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className={activeId === p.id ? 'ring-2 ring-[color:var(--accent)] rounded-xl' : ''}
                >
                  <PropertyCard
                    property={p}
                    compact
                    isActive={activeId === p.id}
                    isSelected={false}
                    canCompare={false}
                    onToggleCompare={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile bottom bar ─────────────────────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 md:hidden">
        <button
          onClick={() => setShowMobileList(m => !m)}
          className="flex items-center gap-2 bg-[color:var(--accent)] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl"
        >
          {showMobileList ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 1L1 3V13L5 11L9 13L13 11V1L9 3L5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 1V11M9 3V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Show map
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {result.total.toLocaleString()} listings
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
        active
          ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)]'
          : 'bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)] border-[color:var(--border)] hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
