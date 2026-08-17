import { db } from '@/lib/db'

async function getAnalytics() {
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalViews7d,
    uniqueSessions7d,
    totalViews30d,
    topProperties,
    recentViews,
    showings7d,
    questions7d,
  ] = await Promise.all([
    (db as any).pageView.count({ where: { createdAt: { gte: since7d } } }),
    (db as any).pageView.findMany({
      where: { createdAt: { gte: since7d }, sessionId: { not: null } },
      select: { sessionId: true },
      distinct: ['sessionId'],
    }).then((r: any[]) => r.length),
    (db as any).pageView.count({ where: { createdAt: { gte: since30d } } }),
    (db as any).pageView.groupBy({
      by: ['propertyId'],
      where: { propertyId: { not: null }, createdAt: { gte: since30d } },
      _count: { propertyId: true },
      orderBy: { _count: { propertyId: 'desc' } },
      take: 5,
    }),
    (db as any).pageView.findMany({
      where: { createdAt: { gte: since7d } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    (db as any).showingRequest.count({ where: { createdAt: { gte: since7d } } }),
    (db as any).propertyQuestion.count({ where: { createdAt: { gte: since7d } } }),
  ])

  // Resolve property titles for top properties
  const topPropertyIds = topProperties.map((r: any) => r.propertyId).filter(Boolean)
  const properties = topPropertyIds.length > 0
    ? await (db as any).property.findMany({
        where: { id: { in: topPropertyIds } },
        select: { id: true, title: true, listingId: true },
      })
    : []
  const propMap = Object.fromEntries(properties.map((p: any) => [p.id, p]))

  // Build views-per-day for last 7 days
  const dayMap: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    dayMap[d.toISOString().slice(0, 10)] = 0
  }
  for (const v of recentViews) {
    const key = new Date(v.createdAt).toISOString().slice(0, 10)
    if (key in dayMap) dayMap[key]++
  }

  return {
    totalViews7d,
    uniqueSessions7d,
    totalViews30d,
    showings7d,
    questions7d,
    topProperties: topProperties.map((r: any) => ({
      id: r.propertyId,
      count: r._count.propertyId,
      title: propMap[r.propertyId]?.title ?? 'Unknown',
      listingId: propMap[r.propertyId]?.listingId ?? '',
    })),
    viewsPerDay: Object.entries(dayMap).map(([date, count]) => ({ date, count })),
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalytics()
  const maxDay = Math.max(...data.viewsPerDay.map(d => d.count), 1)

  const statCards = [
    { label: 'Page views (7d)', value: data.totalViews7d },
    { label: 'Unique visitors (7d)', value: data.uniqueSessions7d },
    { label: 'Page views (30d)', value: data.totalViews30d },
    { label: 'Showings (7d)', value: data.showings7d },
    { label: 'Questions (7d)', value: data.questions7d },
    { label: 'Leads (7d)', value: data.showings7d + data.questions7d },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Analytics</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5">
            <p className="text-sm text-[color:var(--muted)]">{s.label}</p>
            <p className="text-3xl font-bold text-[color:var(--foreground)] mt-1">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Views per day bar chart */}
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-4">Page views — last 7 days</h2>
        <div className="flex items-end gap-2 h-36">
          {data.viewsPerDay.map(d => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-[color:var(--muted)]">{d.count}</span>
              <div
                className="w-full bg-[color:var(--accent)] rounded-t-md transition-all"
                style={{ height: `${Math.round((d.count / maxDay) * 112)}px`, minHeight: d.count > 0 ? '4px' : '1px', opacity: d.count > 0 ? 1 : 0.2 }}
              />
              <span className="text-[10px] text-[color:var(--muted)]">
                {new Date(d.date).toLocaleDateString('en-CA', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top properties */}
      {data.topProperties.length > 0 && (
        <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-6">
          <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-4">Top properties (30d)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[color:var(--muted)] border-b border-[color:var(--border)]">
                <th className="pb-2 font-medium">Property</th>
                <th className="pb-2 font-medium text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {data.topProperties.map((p: { id: string; title: string; listingId: string; count: number }) => (
                <tr key={p.id} className="border-b border-[color:var(--border)] last:border-0">
                  <td className="py-2">
                    <a href={`/property/${p.id}`} className="text-[color:var(--accent)] hover:underline line-clamp-1">
                      {p.title}
                    </a>
                    <span className="text-[color:var(--muted)] ml-1 text-xs">#{p.listingId}</span>
                  </td>
                  <td className="py-2 text-right font-medium text-[color:var(--foreground)]">{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
