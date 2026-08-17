import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, blogPosts] = await Promise.all([
    (db as any).property.findMany({
      where: { status: 'active' },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    }),
    (db as any).blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    }),
  ])

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/open-houses`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/mortgage-calculator`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/neighbourhoods`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const propertyUrls: MetadataRoute.Sitemap = properties.map((p: { id: string; updatedAt: Date }) => ({
    url: `${BASE}/property/${p.id}`,
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
