import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toronto Neighbourhoods',
  description: 'Explore real estate listings in Toronto\'s most popular neighbourhoods — from the Annex to Yorkville, Leslieville to King West.',
}

const NEIGHBOURHOODS = [
  { slug: 'annex', name: 'The Annex', description: 'Victorian homes, U of T, bookshops, and Bloor Street.' },
  { slug: 'yorkville', name: 'Yorkville', description: 'Luxury condos, designer boutiques, and fine dining.' },
  { slug: 'leslieville', name: 'Leslieville', description: 'Hip cafés, art galleries, and Queen Street East.' },
  { slug: 'king-west', name: 'King West', description: 'Trendy condos, rooftop patios, and tech startups.' },
  { slug: 'distillery', name: 'Distillery District', description: 'Victorian industrial lofts and cobblestone charm.' },
  { slug: 'rosedale', name: 'Rosedale', description: 'Prestigious detached homes and ravine trails.' },
  { slug: 'forest-hill', name: 'Forest Hill', description: 'Stately homes, top schools, and quiet streets.' },
  { slug: 'beaches', name: 'The Beaches', description: 'Lakefront living, boardwalk, and family streets.' },
  { slug: 'liberty-village', name: 'Liberty Village', description: 'Industrial-chic condos and weekend markets.' },
  { slug: 'midtown', name: 'Midtown', description: 'Yonge & Eglinton — transit-rich and family-friendly.' },
  { slug: 'downtown-core', name: 'Downtown Core', description: 'Financial district, condos, and urban convenience.' },
  { slug: 'north-york', name: 'North York', description: 'Diverse communities, parks, and great value.' },
]

export default function NeighbourhoodsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Toronto Neighbourhoods</h1>
        <p className="mt-2 text-[color:var(--muted)] text-base">Browse real estate by neighbourhood.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {NEIGHBOURHOODS.map(n => (
          <Link
            key={n.slug}
            href={`/neighbourhoods/${n.slug}`}
            className="group block bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 hover:border-[color:var(--accent)] transition-colors"
          >
            <h2 className="font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">{n.name}</h2>
            <p className="text-sm text-[color:var(--muted)] mt-1 leading-relaxed">{n.description}</p>
            <span className="text-xs text-[color:var(--accent)] mt-3 inline-block">View listings →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
