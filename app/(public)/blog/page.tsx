import Link from 'next/link'
import { db } from '@/lib/db'
import type { Metadata } from 'next'
import { findGtaCity } from '@/lib/seo/gta-cities'

export const metadata: Metadata = {
  title: 'Guides & Market Updates',
  description: 'Toronto real estate insights, market reports, and neighbourhood guides from Condohill.',
  alternates: { canonical: '/blog' },
}

interface PostCard {
  id: string
  slug: string
  title: string
  summary: string
  coverImageUrl: string | null
  citySlug: string | null
  publishedAt: string | null
  author: { name: string | null }
}

async function getPosts(): Promise<PostCard[]> {
  return (db as any).blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, slug: true, title: true, summary: true, coverImageUrl: true, citySlug: true,
      publishedAt: true, author: { select: { name: true } },
    },
  })
}

function formatDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <nav className="text-sm text-[color:var(--text-muted)] mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Guides</span>
        </nav>
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Guides &amp; Market Updates</h1>
        <p className="text-[color:var(--text-muted)] mt-2 max-w-2xl">
          Toronto real estate insights, city guides, and neighbourhood stories.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-[color:var(--text-muted)]">
          <p className="text-lg">No posts yet.</p>
          <p className="text-sm mt-2">Check back soon for market updates.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => {
            const city = post.citySlug ? findGtaCity(post.citySlug) : undefined
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[color:var(--accent-dim)] to-[color:var(--bg-surface-2)] mb-4">
                  {post.coverImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  )}
                </div>
                {city && (
                  <span className="inline-block w-fit mb-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-[color:var(--accent-dim)] text-[color:var(--accent-hover)]">
                    {city.name}
                  </span>
                )}
                <h2 className="text-base font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-[color:var(--text-muted)] mt-1.5 line-clamp-2">{post.summary}</p>
                <p className="text-xs text-[color:var(--text-faint)] mt-3">{formatDate(post.publishedAt)}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
