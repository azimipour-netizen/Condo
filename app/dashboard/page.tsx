import { db } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

const d = db as any

async function getStats() {
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  try {
    const [
      totalShowings, pendingShowings, confirmedShowings,
      totalQuestions, unansweredQuestions,
      pageViews7d, activeListings, totalUsers,
      recentShowings, recentQuestions,
      newUsers7d, publishedPosts,
    ] = await Promise.all([
      d.showingRequest.count(),
      d.showingRequest.count({ where: { status: 'requested' } }),
      d.showingRequest.count({ where: { status: { in: ['confirmed', 'scheduled'] } } }),
      d.propertyQuestion.count(),
      d.propertyQuestion.count({ where: { answers: { none: {} } } }),
      d.pageView.count({ where: { createdAt: { gte: since7d } } }),
      d.property.count({ where: { status: 'active' } }),
      d.user.count(),
      d.showingRequest.findMany({
        where: { createdAt: { gte: since7d } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, status: true, preferredAt: true, createdAt: true,
          property: { select: { title: true, id: true } },
          user: { select: { name: true } },
        },
      }),
      d.propertyQuestion.findMany({
        where: { createdAt: { gte: since7d }, answers: { none: {} } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, text: true, createdAt: true,
          property: { select: { title: true, id: true } },
          user: { select: { name: true } },
        },
      }),
      d.user.count({ where: { createdAt: { gte: since7d } } }),
      d.blogPost.count({ where: { published: true } }),
    ])
    return {
      totalShowings, pendingShowings, confirmedShowings,
      totalQuestions, unansweredQuestions,
      pageViews7d, activeListings, totalUsers,
      recentShowings, recentQuestions,
      newUsers7d, publishedPosts,
    }
  } catch {
    return {
      totalShowings: 0, pendingShowings: 0, confirmedShowings: 0,
      totalQuestions: 0, unansweredQuestions: 0,
      pageViews7d: 0, activeListings: 0, totalUsers: 0,
      recentShowings: [], recentQuestions: [],
      newUsers7d: 0, publishedPosts: 0,
    }
  }
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    requested: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${cls[status] ?? ''}`}>
      {status}
    </span>
  )
}

export default async function DashboardPage() {
  const s = await getStats()

  const QUICK_LINKS = [
    { href: '/dashboard/showings', label: 'Manage showings', accent: true },
    { href: '/dashboard/questions', label: 'Answer questions', accent: false },
    { href: '/dashboard/properties/new', label: '+ New listing', accent: false },
    { href: '/dashboard/blog/new', label: '+ Write post', accent: false },
    { href: '/', label: 'Browse site ↗', accent: false },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-6">Overview</h1>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Stat label="Page views (7d)" value={s.pageViews7d} />
        <Stat label="Active listings" value={s.activeListings} />
        <Stat label="Total users" value={s.totalUsers} sub={`+${s.newUsers7d} this week`} />
        <Stat label="Published posts" value={s.publishedPosts} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Stat label="Pending showings" value={s.pendingShowings} accent={s.pendingShowings > 0} />
        <Stat label="Confirmed showings" value={s.confirmedShowings} />
        <Stat label="Unanswered questions" value={s.unansweredQuestions} accent={s.unansweredQuestions > 0} />
      </div>

      {/* Activity + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent showings */}
        <div className="lg:col-span-2 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
            <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Recent showing requests</h2>
            <Link href="/dashboard/showings" className="text-xs text-[color:var(--accent)] hover:underline">View all</Link>
          </div>
          {s.recentShowings.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)] px-5 py-6">No showing requests in the last 7 days.</p>
          ) : (
            <ul className="divide-y divide-[color:var(--border)]">
              {(s.recentShowings as { id: string; status: string; preferredAt: string | null; createdAt: string; property: { title: string; id: string }; user: { name: string | null } }[]).map(r => (
                <li key={r.id} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[color:var(--foreground)] truncate">{r.property.title}</p>
                    <p className="text-xs text-[color:var(--text-muted)]">
                      {r.user.name ?? 'Unknown'} · {r.preferredAt ? formatDate(r.preferredAt) : 'No date'}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Unanswered questions */}
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden flex-1">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
              <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Unanswered questions</h2>
              <Link href="/dashboard/questions" className="text-xs text-[color:var(--accent)] hover:underline">View all</Link>
            </div>
            {s.recentQuestions.length === 0 ? (
              <p className="text-sm text-[color:var(--text-muted)] px-5 py-6">All caught up!</p>
            ) : (
              <ul className="divide-y divide-[color:var(--border)]">
                {(s.recentQuestions as { id: string; text: string; createdAt: string; property: { title: string; id: string }; user: { name: string | null } }[]).map(q => (
                  <li key={q.id} className="px-5 py-3">
                    <p className="text-xs text-[color:var(--text-muted)] truncate">{q.property.title}</p>
                    <p className="text-sm text-[color:var(--foreground)] line-clamp-2">{q.text}</p>
                    <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{q.user.name ?? 'Anonymous'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider mb-3">Quick actions</p>
            {QUICK_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  l.accent
                    ? 'bg-[color:var(--accent)] text-white hover:opacity-90'
                    : 'border border-[color:var(--border)] text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)]'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent, sub }: { label: string; value: number; accent?: boolean; sub?: string }) {
  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-5">
      <p className="text-xs text-[color:var(--text-muted)] font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold tabular-nums ${accent ? 'text-[color:var(--accent)]' : 'text-[color:var(--foreground)]'}`}>
        {value.toLocaleString()}
      </p>
      {sub && <p className="text-xs text-[color:var(--text-muted)] mt-1">{sub}</p>}
    </div>
  )
}
