'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getRecent, type RecentEntry } from '@/lib/recently-viewed'

const TYPE_LABELS: Record<string, string> = {
  detached: 'Detached', 'semi-detached': 'Semi', townhouse: 'Townhouse',
  condo: 'Condo', multiplex: 'Multiplex', vacant_land: 'Land', commercial: 'Commercial',
}

export default function RecentlyViewed() {
  const [entries, setEntries] = useState<RecentEntry[]>([])

  useEffect(() => {
    setEntries(getRecent())
  }, [])

  if (entries.length === 0) return null

  return (
    <div className="px-6 py-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
        Recently viewed
      </p>
      <div className="flex flex-col gap-2">
        {entries.map(e => (
          <Link
            key={e.id}
            href={`/property/${e.id}`}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[color:var(--bg-surface-2)] transition-colors group"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[color:var(--bg-surface-2)]">
              {e.thumbnail ? (
                <Image src={e.thumbnail} alt={e.title} fill className="object-cover" sizes="48px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 9L9 2L16 9V17H12V12H6V17H2V9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[color:var(--foreground)] truncate group-hover:text-[color:var(--accent)] transition-colors">
                {e.title}
              </p>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
                ${e.price.toLocaleString()} · {TYPE_LABELS[e.propertyType] ?? e.propertyType} · {e.city}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
