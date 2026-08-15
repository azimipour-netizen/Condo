import { getMLSAdapter } from '@/lib/mls/adapter'
import type { Property } from '@/types/property'
import type { Metadata } from 'next'
import Link from 'next/link'
import CompareView from '@/components/property/CompareView'

export const metadata: Metadata = { title: 'Compare Properties' }

interface Props {
  searchParams: Promise<{ ids?: string }>
}

export default async function ComparePage({ searchParams }: Props) {
  const { ids: rawIds } = await searchParams
  const ids = (rawIds ?? '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 4)

  let properties: Property[] = []
  if (ids.length > 0) {
    const adapter = getMLSAdapter()
    properties = (
      await Promise.all(ids.map(id => adapter.getListing(id).catch(() => null)))
    ).filter((p): p is Property => p !== null)
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] pb-20">
      <div className="border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
          <span className="text-[color:var(--border)]">|</span>
          <h1 className="text-sm font-semibold text-[color:var(--foreground)]">
            Compare Properties
          </h1>
        </div>
      </div>

      {properties.length < 2 ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-4 text-[color:var(--text-faint)]">
            <path d="M6 12H42M6 24H30M6 36H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-base font-semibold text-[color:var(--foreground)] mb-2">
            {properties.length === 0 ? 'No properties to compare' : 'Add one more property'}
          </p>
          <p className="text-sm text-[color:var(--text-muted)] mb-6">
            {properties.length === 0
              ? 'Browse listings and click "Add to Comparison" on at least 2 properties.'
              : 'You need at least 2 properties to compare. Go back and add another.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <CompareView properties={properties} />
      )}
    </div>
  )
}
