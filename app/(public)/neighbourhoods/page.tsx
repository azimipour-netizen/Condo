import Link from 'next/link'
import type { Metadata } from 'next'
import { TORONTO_NEIGHBOURHOODS } from '@/lib/seo/toronto-neighbourhoods'

export const metadata: Metadata = {
  title: 'Toronto Neighbourhoods — Browse Real Estate by Area',
  description: 'Explore homes for sale in Toronto\'s most popular neighbourhoods — from the Annex and Yorkville to Leslieville, High Park, the Danforth, and beyond.',
  alternates: { canonical: '/neighbourhoods' },
}

export default function NeighbourhoodsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Toronto Neighbourhoods</h1>
        <p className="mt-2 text-[color:var(--text-muted)] text-base max-w-2xl">
          Browse active MLS® listings by neighbourhood across the City of Toronto — from downtown condos to lakefront communities and family-friendly bungalow streets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {TORONTO_NEIGHBOURHOODS.map(n => (
          <Link
            key={n.slug}
            href={`/neighbourhoods/${n.slug}`}
            className="group block bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-5 hover:border-[color:var(--accent)] transition-colors"
          >
            <h2 className="font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">{n.name}</h2>
            <p className="text-sm text-[color:var(--text-muted)] mt-1 leading-relaxed line-clamp-2">{n.description}</p>
            <span className="text-xs text-[color:var(--accent)] mt-3 inline-block">View listings →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
