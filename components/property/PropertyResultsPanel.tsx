'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { SearchResult, SearchFilters } from '@/types/search'
import PropertyCard from './PropertyCard'
import type { PropertySummary } from '@/types/property'

const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), { ssr: false })

interface Props {
  result: SearchResult
  filters: SearchFilters
  activeId?: string | null
  onActiveChange?: (id: string | null) => void
}

type ViewMode = 'list' | 'grid' | 'map'

const PROPERTY_TYPES = [
  { key: 'detached', label: 'Detached' },
  { key: 'semi-detached', label: 'Semi' },
  { key: 'townhouse', label: 'Townhouse' },
  { key: 'condo', label: 'Condo' },
]

const SORT_OPTIONS = [
  { key: 'default', label: 'Best match' },
  { key: 'price_asc', label: 'Price: low to high' },
  { key: 'price_desc', label: 'Price: high to low' },
  { key: 'bedrooms_desc', label: 'Most bedrooms' },
  { key: 'listed_desc', label: 'Newest first' },
] as const

const PRICE_OPTIONS = [
  { label: 'Any price', max: null },
  { label: 'Under $600K', max: 600_000 },
  { label: 'Under $800K', max: 800_000 },
  { label: 'Under $1.2M', max: 1_200_000 },
  { label: 'Under $1.8M', max: 1_800_000 },
]

interface LocalFilters {
  bedsMin: number | null
  types: string[]
  priceMax: number | null
}

export default function PropertyResultsPanel({ result, filters, activeId, onActiveChange }: Props) {
  const [view, setView] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'listed_desc' | 'bedrooms_desc'>('default')
  const [sortOpen, setSortOpen] = useState(false)
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set())
  const [local, setLocal] = useState<LocalFilters>({ bedsMin: null, types: [], priceMax: null })
  const [priceOpen, setPriceOpen] = useState(false)

  function toggleCompare(id: string) {
    setCompareIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 4) next.add(id)
      return next
    })
  }

  function toggleType(key: string) {
    setLocal(prev => ({
      ...prev,
      types: prev.types.includes(key) ? prev.types.filter(t => t !== key) : [...prev.types, key],
    }))
  }

  function setBeds(n: number | null) {
    setLocal(prev => ({ ...prev, bedsMin: prev.bedsMin === n ? null : n }))
  }

  function setPriceMax(max: number | null) {
    setLocal(prev => ({ ...prev, priceMax: max }))
    setPriceOpen(false)
  }

  const filtered = useMemo(() => {
    let props = result.properties
    if (local.bedsMin !== null) props = props.filter(p => (p.bedrooms ?? 0) >= local.bedsMin!)
    if (local.types.length > 0) props = props.filter(p => local.types.includes(p.propertyType))
    if (local.priceMax !== null) props = props.filter(p => p.price <= local.priceMax!)
    const arr = [...props]
    if (sortBy === 'price_asc') arr.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price_desc') arr.sort((a, b) => b.price - a.price)
    else if (sortBy === 'bedrooms_desc') arr.sort((a, b) => (b.bedrooms ?? 0) - (a.bedrooms ?? 0))
    else if (sortBy === 'listed_desc') arr.sort((a, b) => (b.listedAt ?? '').localeCompare(a.listedAt ?? ''))
    return arr
  }, [result.properties, local, sortBy])

  const hasLocalFilters = local.bedsMin !== null || local.types.length > 0 || local.priceMax !== null
  const activePrice = PRICE_OPTIONS.find(o => o.max === local.priceMax) ?? PRICE_OPTIONS[0]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-3 border-b border-[color:var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-[color:var(--foreground)]">
              {filtered.length !== result.total
                ? `${filtered.length} of ${result.total.toLocaleString()} ${result.total === 1 ? 'property' : 'properties'}`
                : `${result.total.toLocaleString()} ${result.total === 1 ? 'property' : 'properties'} found`}
            </p>
            {filters.location?.value && (
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Near {filters.location.value}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {compareIds.size > 0 && (
              <a
                href={`/compare?ids=${[...compareIds].join(',')}`}
                className="text-xs font-semibold text-[color:var(--accent)] border border-[color:var(--accent)] rounded-lg px-3 py-1.5 hover:bg-[color:var(--accent-dim)] transition-colors"
              >
                Compare {compareIds.size}
              </a>
            )}
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-1 text-xs text-[color:var(--text-muted)] border border-[color:var(--border)] rounded-lg px-2.5 py-1.5 hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <span>{SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? 'Sort'}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {sortOpen && (
                <div className="absolute top-full right-0 mt-1 z-20 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl shadow-lg overflow-hidden min-w-[160px]">
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.key}
                      onClick={() => { setSortBy(o.key); setSortOpen(false) }}
                      className={[
                        'w-full text-left px-3 py-2 text-xs transition-colors',
                        o.key === sortBy
                          ? 'bg-[color:var(--accent-dim)] text-[color:var(--accent)] font-semibold'
                          : 'text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)]',
                      ].join(' ')}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex rounded-lg border border-[color:var(--border)] overflow-hidden">
              <ViewBtn active={view === 'grid'} onClick={() => setView('grid')} label="Grid"><GridIcon /></ViewBtn>
              <ViewBtn active={view === 'list'} onClick={() => setView('list')} label="List"><ListIcon /></ViewBtn>
              <ViewBtn active={view === 'map'} onClick={() => setView('map')} label="Map"><MapIcon /></ViewBtn>
            </div>
          </div>
        </div>

        {/* Filter chips row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Beds */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-[color:var(--text-faint)] mr-0.5">Beds</span>
            {[2, 3, 4].map(n => (
              <Chip
                key={n}
                active={local.bedsMin === n}
                onClick={() => setBeds(n)}
              >
                {n}+
              </Chip>
            ))}
          </div>

          <div className="w-px h-5 bg-[color:var(--border)]" />

          {/* Property type */}
          <div className="flex items-center gap-1">
            {PROPERTY_TYPES.map(t => (
              <Chip
                key={t.key}
                active={local.types.includes(t.key)}
                onClick={() => toggleType(t.key)}
              >
                {t.label}
              </Chip>
            ))}
          </div>

          <div className="w-px h-5 bg-[color:var(--border)]" />

          {/* Price */}
          <div className="relative">
            <Chip active={local.priceMax !== null} onClick={() => setPriceOpen(p => !p)}>
              {activePrice.label}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="ml-1">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Chip>
            {priceOpen && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                {PRICE_OPTIONS.map(o => (
                  <button
                    key={o.label}
                    onClick={() => setPriceMax(o.max)}
                    className={[
                      'w-full text-left px-3 py-2 text-xs transition-colors',
                      o.max === local.priceMax
                        ? 'bg-[color:var(--accent-dim)] text-[color:var(--accent)] font-semibold'
                        : 'text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)]',
                    ].join(' ')}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear local filters */}
          {hasLocalFilters && (
            <button
              onClick={() => setLocal({ bedsMin: null, types: [], priceMax: null })}
              className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors underline underline-offset-2 ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Map view */}
      {view === 'map' ? (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <PropertyMap
            properties={filtered}
            activeId={activeId}
            onMarkerClick={id => {
              onActiveChange?.(id)
              const el = document.getElementById(`map-card-${id}`)
              el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }}
            className="flex-1 h-full"
          />
          {/* Thin card strip on the right */}
          <div className="w-72 shrink-0 overflow-y-auto border-l border-[color:var(--border)] bg-[color:var(--bg-surface)] px-3 py-3 flex flex-col gap-2">
            {filtered.length === 0 ? (
              <p className="text-xs text-[color:var(--text-muted)] text-center pt-8">No properties match.</p>
            ) : filtered.map((p: PropertySummary) => (
              <div
                key={p.id}
                id={`map-card-${p.id}`}
                onMouseEnter={() => onActiveChange?.(p.id)}
                onMouseLeave={() => onActiveChange?.(null)}
              >
                <PropertyCard
                  property={p}
                  compact
                  isSelected={compareIds.has(p.id)}
                  isActive={activeId === p.id}
                  onToggleCompare={() => toggleCompare(p.id)}
                  canCompare={compareIds.size < 4 || compareIds.has(p.id)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List / Grid view */
        <div className="flex-1 overflow-y-auto px-6 py-5" onClick={() => { setPriceOpen(false); setSortOpen(false) }}>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[color:var(--text-muted)] text-sm">
              No properties match these filters.{hasLocalFilters && (
                <button
                  onClick={() => setLocal({ bedsMin: null, types: [], priceMax: null })}
                  className="ml-1 text-[color:var(--accent)] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 xl:grid-cols-2 gap-4'
                  : 'flex flex-col gap-3'
              }
            >
              {filtered.map((p: PropertySummary) => (
                <div
                  key={p.id}
                  id={`card-${p.id}`}
                  onMouseEnter={() => onActiveChange?.(p.id)}
                  onMouseLeave={() => onActiveChange?.(null)}
                >
                  <PropertyCard
                    property={p}
                    compact={view === 'list'}
                    isSelected={compareIds.has(p.id)}
                    isActive={activeId === p.id}
                    onToggleCompare={() => toggleCompare(p.id)}
                    canCompare={compareIds.size < 4 || compareIds.has(p.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors border',
        active
          ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)]'
          : 'bg-transparent text-[color:var(--text-muted)] border-[color:var(--border)] hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function ViewBtn({ active, onClick, label, children }: {
  active: boolean; onClick: () => void; label: string; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={[
        'px-2.5 py-1.5 text-xs transition-colors',
        active
          ? 'bg-[color:var(--accent)] text-white'
          : 'text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 3.5H13M1 7H13M1 10.5H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 1L1 3V13L5 11L9 13L13 11V1L9 3L5 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 1V11M9 3V13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
