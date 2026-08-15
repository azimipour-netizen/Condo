'use client'

import { useState } from 'react'
import type { SearchResult, SearchFilters } from '@/types/search'
import PropertyCard from './PropertyCard'
import type { PropertySummary } from '@/types/property'

interface Props {
  result: SearchResult
  filters: SearchFilters
  activeId?: string | null
  onActiveChange?: (id: string | null) => void
}

type ViewMode = 'list' | 'grid'

export default function PropertyResultsPanel({ result, filters, activeId, onActiveChange }: Props) {
  const [view, setView] = useState<ViewMode>('grid')
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set())

  function toggleCompare(id: string) {
    setCompareIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 4) next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Results header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--border)]">
        <div>
          <p className="text-sm font-semibold text-[color:var(--foreground)]">
            {result.total.toLocaleString()} {result.total === 1 ? 'property' : 'properties'} found
          </p>
          {filters.location?.value && (
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              Near {filters.location.value}
            </p>
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
          <div className="flex rounded-lg border border-[color:var(--border)] overflow-hidden">
            <ViewBtn active={view === 'grid'} onClick={() => setView('grid')} label="Grid">
              <GridIcon />
            </ViewBtn>
            <ViewBtn active={view === 'list'} onClick={() => setView('list')} label="List">
              <ListIcon />
            </ViewBtn>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {result.properties.length === 0 ? (
          <div className="text-center py-12 text-[color:var(--text-muted)] text-sm">
            No properties match the current filters. Try broadening your search.
          </div>
        ) : (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 xl:grid-cols-2 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {result.properties.map((p: PropertySummary) => (
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
    </div>
  )
}

function ViewBtn({ active, onClick, label, children }: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
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
