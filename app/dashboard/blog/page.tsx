import { db } from '@/lib/db'
import Link from 'next/link'
import BlogActions from './BlogActions'

async function getPosts() {
  return (db as any).blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, title: true, published: true, publishedAt: true, createdAt: true },
  })
}

function formatDate(d: Date | string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-CA')
}

export default async function DashboardBlogPage() {
  const posts = await getPosts()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Market Updates</h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/blog/new"
          className="px-4 py-2 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition">
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">No posts yet.</p>
          <Link href="/dashboard/blog/new"
            className="inline-block mt-4 text-sm text-[color:var(--accent)] hover:underline">
            Write your first post →
          </Link>
        </div>
      ) : (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--border)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Published</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post: { id: string; slug: string; title: string; published: boolean; publishedAt: string | null; createdAt: string }) => (
                <tr key={post.id} className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-surface-2)] transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-sm font-medium text-[color:var(--foreground)] truncate">{post.title}</p>
                    <p className="text-xs text-[color:var(--text-muted)]">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.published
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[color:var(--text-muted)]">{formatDate(post.publishedAt)}</td>
                  <td className="px-4 py-3 text-sm text-[color:var(--text-muted)]">{formatDate(post.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/blog/${post.slug}/edit`}
                        className="text-xs text-[color:var(--accent)] hover:underline">Edit</Link>
                      {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank"
                          className="text-xs text-[color:var(--text-muted)] hover:underline">View ↗</Link>
                      )}
                      <BlogActions slug={post.slug} published={post.published} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
