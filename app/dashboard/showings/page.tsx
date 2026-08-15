import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const metadata = { title: 'Showings' }

const STATUS_LABELS: Record<string, string> = {
  requested: 'Requested',
  pending_review: 'Pending review',
  confirmed: 'Confirmed',
  scheduled: 'Scheduled',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

const STATUS_COLORS: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  pending_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  scheduled: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

async function getShowings() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (db as any).showingRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { title: true, listingId: true } } },
      take: 100,
    })
  } catch {
    return []
  }
}

async function updateStatus(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (db as any).showingRequest.update({ where: { id }, data: { status } })
  revalidatePath('/dashboard/showings')
}

export default async function ShowingsPage() {
  const showings = await getShowings()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-8">Showing Requests</h1>

      {showings.length === 0 ? (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-[color:var(--text-muted)] text-sm">No showing requests yet.</p>
          <p className="text-[color:var(--text-faint)] text-xs mt-1">They&apos;ll appear here when buyers submit requests.</p>
        </div>
      ) : (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--border)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Buyer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Property</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {showings.map((s: any) => (
                  <tr key={s.id} className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[color:var(--foreground)]">{s.name}</p>
                      <p className="text-xs text-[color:var(--text-muted)]">{s.email}</p>
                      {s.phone && <p className="text-xs text-[color:var(--text-muted)]">{s.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[color:var(--foreground)] max-w-[180px] truncate">{s.property?.title ?? s.propertyId}</p>
                      {s.property?.listingId && (
                        <p className="text-xs text-[color:var(--text-muted)]">#{s.property.listingId}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[color:var(--text-muted)] whitespace-nowrap">
                      {s.preferredAt ? new Date(s.preferredAt).toLocaleDateString('en-CA') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status] ?? ''}`}>
                        {STATUS_LABELS[s.status] ?? s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <form action={updateStatus} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={s.id} />
                        <select
                          name="status"
                          defaultValue={s.status}
                          className="text-xs border border-[color:var(--border)] rounded-lg px-2 py-1 bg-[color:var(--background)] text-[color:var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
                        >
                          {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                            <option key={val} value={val}>{lbl}</option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="text-xs px-2 py-1 bg-[color:var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Save
                        </button>
                      </form>
                      {s.message && (
                        <p className="text-xs text-[color:var(--text-muted)] mt-1 max-w-[200px] truncate" title={s.message}>
                          {s.message}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
