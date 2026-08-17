import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  const post = await (db as any).blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })
  if (!post || !post.published) return null
  return post
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <nav className="text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:underline">Market Updates</Link>
        <span className="mx-2">/</span>
        <span className="truncate">{post.title}</span>
      </nav>

      <header className="mb-10">
        <div className="flex items-center gap-3 text-xs text-[color:var(--text-muted)] mb-4">
          <time>{formatDate(post.publishedAt)}</time>
          {post.author?.name && (
            <>
              <span>·</span>
              <span>By {post.author.name}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-[color:var(--foreground)] leading-tight">{post.title}</h1>
        <p className="text-lg text-[color:var(--text-muted)] mt-4 leading-relaxed">{post.summary}</p>
      </header>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none text-[color:var(--foreground)] leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br />') }}
      />

      <div className="mt-12 pt-8 border-t border-[color:var(--border)]">
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
          ← All market updates
        </Link>
      </div>
    </div>
  )
}
