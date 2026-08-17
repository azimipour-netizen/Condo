import Link from 'next/link'
import { db } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Market Updates',
  description: 'Toronto real estate insights, market reports, and neighbourhood updates from Condohill.',
}

async function getPosts() {
  return (db as any).blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, title: true, summary: true, publishedAt: true, author: { select: { name: true } } },
  })
}

function formatDate(d: Date | string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <nav className="text-sm text-[color:var(--text-muted)] mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Market Updates</span>
        </nav>
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Market Updates</h1>
        <p className="text-[color:var(--text-muted)] mt-2">Toronto real estate insights and neighbourhood stories.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-[color:var(--text-muted)]">
          <p className="text-lg">No posts yet.</p>
          <p className="text-sm mt-2">Check back soon for market updates.</p>
        </div>
      ) : (
        <div className="divide-y divide-[color:var(--border)]">
          {posts.map((post: {
            id: string
            slug: string
            title: string
            summary: string
            publishedAt: string | null
            author: { name: string | null }
          }) => (
            <article key={post.id} className="py-8 group">
              <div className="flex items-center gap-3 text-xs text-[color:var(--text-muted)] mb-3">
                <time>{formatDate(post.publishedAt)}</time>
                {post.author.name && (
                  <>
                    <span>·</span>
                    <span>{post.author.name}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors mb-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-[color:var(--text-muted)] leading-relaxed line-clamp-3">{post.summary}</p>
              <Link href={`/blog/${post.slug}`}
                className="inline-block mt-3 text-sm text-[color:var(--accent)] font-medium hover:underline">
                Read more
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
