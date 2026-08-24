import Link from 'next/link'
import type { Metadata } from 'next'
import { GTA_CITIES } from '@/lib/seo/gta-cities'

export const metadata: Metadata = {
  title: 'Homes for Sale in the GTA',
  description: 'Browse active MLS® listings across every major Greater Toronto Area municipality — Toronto, Mississauga, Brampton, Vaughan, Markham, and more.',
}

export default function HomesForSalePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Homes for Sale in the GTA</h1>
        <p className="mt-2 text-[color:var(--text-muted)] text-base">Browse active listings by city across the Greater Toronto Area.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {GTA_CITIES.map(c => (
          <Link
            key={c.slug}
            href={`/homes-for-sale/${c.slug}`}
            className="group block bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-5 hover:border-[color:var(--accent)] transition-colors"
          >
            <h2 className="font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">{c.name}</h2>
            <p className="text-sm text-[color:var(--text-muted)] mt-1 leading-relaxed line-clamp-2">{c.blurb}</p>
            <span className="text-xs text-[color:var(--accent)] mt-3 inline-block">View listings →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
