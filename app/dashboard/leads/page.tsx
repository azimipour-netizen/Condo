import { db } from '@/lib/db'
import LeadsPipeline from './LeadsPipeline'
import LeadScores from './LeadScores'

export const metadata = { title: 'Leads' }

async function getData() {
  try {
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const [showings, questions, pageViews, users] = await Promise.all([
      (db as any).showingRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { property: { select: { id: true, title: true, listingId: true } } },
        take: 200,
      }),
      (db as any).propertyQuestion.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          answers: { select: { id: true } },
          property: { select: { id: true, title: true, listingId: true } },
        },
        take: 200,
      }),
      (db as any).pageView.groupBy({
        by: ['propertyId'],
        where: { propertyId: { not: null }, createdAt: { gte: since30d } },
        _count: { id: true },
      }),
      (db as any).user.findMany({
        where: { role: 'consumer' },
        select: {
          id: true, name: true, email: true, createdAt: true,
          showingRequests: { select: { id: true, status: true, createdAt: true } },
          questions: { select: { id: true, createdAt: true } },
        },
        take: 100,
      }),
    ])
    return { showings, questions, pageViews, users }
  } catch {
    return { showings: [], questions: [], pageViews: [], users: [] }
  }
}

function computeScore(user: {
  showingRequests: { status: string; createdAt: string }[]
  questions: { createdAt: string }[]
}): number {
  const since30d = Date.now() - 30 * 24 * 60 * 60 * 1000
  let score = 0
  for (const s of user.showingRequests) {
    score += 10
    if (s.status === 'confirmed' || s.status === 'scheduled') score += 15
    if (new Date(s.createdAt).getTime() > since30d) score += 5
  }
  for (const q of user.questions) {
    score += 5
    if (new Date(q.createdAt).getTime() > since30d) score += 3
  }
  return score
}

export default async function LeadsPage() {
  const { showings, questions, pageViews, users } = await getData()

  const scoredUsers = users
    .map((u: { id: string; name: string | null; email: string; createdAt: string; showingRequests: { status: string; createdAt: string }[]; questions: { id: string; createdAt: string }[] }) => ({
      ...u,
      score: computeScore(u),
      showingCount: u.showingRequests.length,
      questionCount: u.questions.length,
    }))
    .filter((u: { score: number }) => u.score > 0)
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .slice(0, 20)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Leads</h1>
        <a href="/api/admin/leads/export"
          className="px-4 py-2 border border-[color:var(--border)] text-sm rounded-xl hover:bg-[color:var(--bg-surface-2)] transition-colors text-[color:var(--foreground)]">
          Export CSV ↓
        </a>
      </div>
      <p className="text-sm text-[color:var(--text-muted)] mb-8">Showing requests, buyer questions, and lead scores.</p>

      {scoredUsers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Hot Leads (scored by activity)</h2>
          <LeadScores users={scoredUsers} />
        </div>
      )}

      <LeadsPipeline showings={showings} questions={questions} />
    </div>
  )
}
