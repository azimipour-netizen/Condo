import { db } from '@/lib/db'
import Link from 'next/link'

export const metadata = { title: 'Dashboard' }

async function getStats() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = db as any
    const [totalShowings, pendingShowings, confirmedShowings] = await Promise.all([
      d.showingRequest.count(),
      d.showingRequest.count({ where: { status: 'requested' } }),
      d.showingRequest.count({ where: { status: { in: ['confirmed', 'scheduled'] } } }),
    ])
    return { totalShowings, pendingShowings, confirmedShowings }
  } catch {
    return { totalShowings: 0, pendingShowings: 0, confirmedShowings: 0 }
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-8">Overview</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Showing requests" value={stats.totalShowings} />
        <StatCard label="Pending review" value={stats.pendingShowings} accent />
        <StatCard label="Confirmed" value={stats.confirmedShowings} />
      </div>

      <div className="flex gap-3">
        <Link
          href="/dashboard/showings"
          className="px-4 py-2 bg-[color:var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Manage showings
        </Link>
        <Link
          href="/"
          className="px-4 py-2 border border-[color:var(--border)] text-[color:var(--foreground)] text-sm font-medium rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
        >
          Browse listings
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-6">
      <p className="text-xs text-[color:var(--text-muted)] font-medium mb-2">{label}</p>
      <p className={`text-4xl font-bold tabular-nums ${accent ? 'text-[color:var(--accent)]' : 'text-[color:var(--foreground)]'}`}>
        {value}
      </p>
    </div>
  )
}
