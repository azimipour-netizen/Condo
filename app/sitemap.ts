import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { GTA_CITIES, cityWhereClause } from '@/lib/seo/gta-cities'
import { PROP_TYPE_CFGS } from '@/lib/seo/property-type-pages'
import { TORONTO_NEIGHBOURHOODS } from '@/lib/seo/toronto-neighbourhoods'
import { getPropTypeCityCount } from '@/components/property-type/PropTypeCityPage'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, blogPosts, mostRecentActivity, homesForSaleCounts, propTypeCityCounts] = await Promise.all([
    (db as any).property.findMany({
      where: { status: 'active' },
      // /property/[id] resolves against AMPRE's ListingKey, not our own row
      // id — every property URL in the sitemap was a 404 waiting to happen.
      select: { listingId: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    }),
    (db as any).blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    }),
    // A cheap floor for every listing-backed category page's lastmod (city,
    // city x property-type, neighbourhood). Previously these ~316 URLs had
    // no lastModified at all. This isn't per-page precise — that would need
    // a query per combination — but "most recent sync activity site-wide"
    // is a real, truthful signal, a meaningful improvement over nothing,
    // and one extra aggregate query regardless of how many category pages
    // exist.
    (db as any).property.aggregate({
      where: { status: 'active' },
      _max: { updatedAt: true },
    }),
    // Per-city sale-listing counts for /homes-for-sale/[city] — a genuine
    // zero-inventory city×type combo (e.g. "Multiplexes for Sale in
    // Vaughan") is a real, indexed, contentless page today. Counted here
    // (not just noindexed on the page itself) so it drops out of the
    // sitemap too, matching the audit's "noindex AND remove from sitemap"
    // recommendation.
    Promise.all(GTA_CITIES.map(async c => [c.slug, await (db as any).property.count({
      where: { status: 'active', transactionType: 'sale', ...cityWhereClause(c) },
    }).catch(() => null)] as const)),
    // Same idea for every city x property-type combination (~230 pages).
    Promise.all(
      PROP_TYPE_CFGS.flatMap(cfg => GTA_CITIES.map(async c =>
        [`${cfg.typeSlug}/${c.slug}`, await getPropTypeCityCount(cfg, c)] as const
      ))
    ),
  ])

  const categoryLastmod = mostRecentActivity._max.updatedAt ?? undefined
  // null (a failed count) fails open — treated as "has inventory" so a
  // transient DB error never drops a real page out of the sitemap.
  const homesForSaleCountByCity = new Map(homesForSaleCounts)
  const propTypeCityCountByKey = new Map(propTypeCityCounts)
  const hasInventory = (count: number | null | undefined) => count === undefined || count === null || count > 0

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'daily', priority: 1, lastModified: categoryLastmod },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/open-houses`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/mortgage-calculator`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/neighbourhoods`, changeFrequency: 'weekly', priority: 0.7, lastModified: categoryLastmod },
    { url: `${BASE}/homes-for-sale`, changeFrequency: 'weekly', priority: 0.8, lastModified: categoryLastmod },
    ...GTA_CITIES.filter(c => hasInventory(homesForSaleCountByCity.get(c.slug))).map(c => ({
      url: `${BASE}/homes-for-sale/${c.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
      lastModified: categoryLastmod,
    })),
    ...PROP_TYPE_CFGS.flatMap(cfg => [
      { url: `${BASE}/${cfg.typeSlug}`, changeFrequency: 'weekly' as const, priority: 0.8, lastModified: categoryLastmod },
      ...GTA_CITIES
        .filter(c => hasInventory(propTypeCityCountByKey.get(`${cfg.typeSlug}/${c.slug}`)))
        .map(c => ({
          url: `${BASE}/${cfg.typeSlug}/${c.slug}`,
          changeFrequency: 'daily' as const,
          priority: 0.7,
          lastModified: categoryLastmod,
        })),
    ]),
    ...TORONTO_NEIGHBOURHOODS.map(n => ({
      url: `${BASE}/neighbourhoods/${n.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      lastModified: categoryLastmod,
    })),
    { url: `${BASE}/rentals/neighbourhoods`, changeFrequency: 'weekly' as const, priority: 0.7, lastModified: categoryLastmod },
    ...TORONTO_NEIGHBOURHOODS.map(n => ({
      url: `${BASE}/rentals/neighbourhoods/${n.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      lastModified: categoryLastmod,
    })),
    // /privacy is a duplicate of /privacy-policy (see that route's canonical
    // tag) — kept out of the sitemap in favour of the URL that's actually
    // linked from the footer and now canonical.
    { url: `${BASE}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const propertyUrls: MetadataRoute.Sitemap = properties.map((p: { listingId: string; updatedAt: Date }) => ({
    url: `${BASE}/property/${p.listingId}`,
    lastModified: p.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((p: { slug: string; updatedAt: Date }) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticUrls, ...propertyUrls, ...blogUrls]
}
