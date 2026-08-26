import Link from 'next/link'
import { db } from '@/lib/db'
import { GTA_CITIES } from '@/lib/seo/gta-cities'
import { PROP_TYPE_CFGS, type PropTypeCfg } from '@/lib/seo/property-type-pages'

async function getTotalCount(config: PropTypeCfg): Promise<number> {
  try {
    const where: Record<string, unknown> = {
      status: 'active',
      transactionType: config.transactionType,
    }
    if (config.dbType) where.propertyType = config.dbType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (db as any).property.count({ where })
    return result ?? 0
  } catch {
    return 0
  }
}

export async function PropTypeHubPage({ config }: { config: PropTypeCfg }) {
  const total = await getTotalCount(config)
  const otherTypes = PROP_TYPE_CFGS.filter(
    c => c.typeSlug !== config.typeSlug && c.transactionType === config.transactionType && c.dbType !== null
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[color:var(--accent)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[color:var(--foreground)]">{config.plural} for Sale</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{config.hubTitle}</h1>
        {total > 0 && (
          <p className="mt-2 text-[color:var(--text-muted)] text-base">
            {total.toLocaleString()} active {config.plural.toLowerCase()} listed across the Greater Toronto Area.
          </p>
        )}
      </div>

      {/* City grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {GTA_CITIES.map(city => (
          <Link
            key={city.slug}
            href={`/${config.typeSlug}/${city.slug}`}
            className="group block bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-5 hover:border-[color:var(--accent)] transition-colors"
          >
            <h2 className="font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">
              {config.plural} in {city.name}
            </h2>
            <p className="text-sm text-[color:var(--text-muted)] mt-1 leading-relaxed line-clamp-2">{city.blurb}</p>
            <span className="text-xs text-[color:var(--accent)] mt-3 inline-block">View listings →</span>
          </Link>
        ))}
      </div>

      {/* SEO footer */}
      <div className="mt-14 pt-8 border-t border-[color:var(--border)] space-y-8">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Buyer guides</h3>
            <ul className="space-y-2 text-sm">
              {config.buyerGuides.map(g => (
                <li key={g.href}>
                  <Link href={g.href} className="text-[color:var(--accent)] hover:underline">{g.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Other property types</h3>
            <ul className="space-y-2 text-sm">
              {config.dbType !== null && (
                <li>
                  <Link
                    href={`/${config.transactionType === 'lease' ? 'homes-for-rent' : 'homes-for-sale'}`}
                    className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors"
                  >
                    All {config.transactionType === 'lease' ? 'rentals' : 'homes'} in the GTA
                  </Link>
                </li>
              )}
              {otherTypes.map(t => (
                <li key={t.typeSlug}>
                  <Link href={`/${t.typeSlug}`} className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                    {t.plural} for sale in the GTA
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
