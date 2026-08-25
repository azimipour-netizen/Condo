import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import type { Metadata } from 'next'
import { renderBody, readingMinutes } from '@/lib/content/render-body'
import { findGtaCity } from '@/lib/seo/gta-cities'

interface Props { params: Promise<{ slug: string }> }

interface PostRow {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  coverImageUrl: string | null
  citySlug: string | null
  publishedAt: Date | null
  updatedAt: Date
  author: { name: string | null }
}

async function getPost(slug: string): Promise<PostRow | null> {
  const post = await (db as any).blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })
  if (!post || !post.published) return null
  return post
}

async function getRelated(currentId: string, citySlug: string | null): Promise<PostRow[]> {
  const base = { published: true, id: { not: currentId } }
  const select = { id: true, slug: true, title: true, summary: true, publishedAt: true }

  const sameCity = citySlug
    ? await (db as any).blogPost.findMany({
        where: { ...base, citySlug },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select,
      })
    : []

  if (sameCity.length >= 3) return sameCity

  const rest = await (db as any).blogPost.findMany({
    where: { ...base, id: { notIn: [currentId, ...sameCity.map((p: PostRow) => p.id)] } },
    orderBy: { publishedAt: 'desc' },
    take: 3 - sameCity.length,
    select,
  })

  return [...sameCity, ...rest]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
  }
}

function formatDate(d: Date | string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const { html, toc } = renderBody(post.body)
  const minutes = readingMinutes(html)
  const city = post.citySlug ? findGtaCity(post.citySlug) : undefined
  const related = await getRelated(post.id, post.citySlug)
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    image: post.coverImageUrl ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: post.author?.name ?? 'Condohill' },
    publisher: { '@type': 'Organization', name: 'Condohill' },
    mainEntityOfPage: `${base}/blog/${post.slug}`,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[color:var(--accent)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[color:var(--accent)] transition-colors">Guides</Link>
        <span>/</span>
        <span className="text-[color:var(--foreground)] truncate">{post.title}</span>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        {city && (
          <Link
            href={`/homes-for-sale/${city.slug}`}
            className="inline-block mb-3 px-3 py-1 text-xs font-medium rounded-full bg-[color:var(--accent-dim)] text-[color:var(--accent-hover)] hover:opacity-80 transition-opacity"
          >
            {city.name}
          </Link>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--foreground)] leading-tight text-balance">
          {post.title}
        </h1>
        <p className="text-lg text-[color:var(--text-muted)] mt-4 leading-relaxed max-w-3xl">{post.summary}</p>
        <div className="flex items-center gap-3 text-sm text-[color:var(--text-muted)] mt-5">
          <time>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <span>{minutes} min read</span>
          {post.author?.name && (
            <>
              <span>·</span>
              <span>By {post.author.name}</span>
            </>
          )}
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden aspect-[21/9] bg-gradient-to-br from-[color:var(--accent-dim)] to-[color:var(--bg-surface-2)]">
          {post.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
          )}
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_300px] gap-10">
        {/* Main content */}
        <div className="min-w-0 article-body" dangerouslySetInnerHTML={{ __html: html }} />

        {/* Sidebar */}
        <aside className="space-y-6">
          {toc.length >= 2 && (
            <nav className="lg:sticky lg:top-6 bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[color:var(--text-faint)] uppercase tracking-wide mb-3">
                On this page
              </p>
              <ul className="space-y-2 text-sm">
                {toc.map(t => (
                  <li key={t.id} className={t.level === 3 ? 'pl-3' : ''}>
                    <a href={`#${t.id}`} className="text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5">
            <p className="text-sm font-semibold text-[color:var(--foreground)] mb-1">
              {city ? `Homes for sale in ${city.name}` : 'Looking for a home in the GTA?'}
            </p>
            <p className="text-sm text-[color:var(--text-muted)] mb-4">
              {city ? city.blurb : 'Browse active MLS® listings across the Greater Toronto Area.'}
            </p>
            <Link
              href={city ? `/homes-for-sale/${city.slug}` : '/search'}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              View listings →
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[color:var(--border)]">
          <h2 className="text-lg font-bold text-[color:var(--foreground)] mb-5">More guides</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                <p className="text-xs text-[color:var(--text-muted)] mb-1">{formatDate(p.publishedAt)}</p>
                <h3 className="text-sm font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] mt-1.5 line-clamp-2">{p.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-[color:var(--border)]">
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
          ← All guides
        </Link>
      </div>
    </div>
  )
}
