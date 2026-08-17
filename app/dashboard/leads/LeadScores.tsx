'use client'

interface ScoredUser {
  id: string
  name: string | null
  email: string
  score: number
  showingCount: number
  questionCount: number
}

function ScoreBar({ score }: { score: number }) {
  const max = 100
  const pct = Math.min(score / max * 100, 100)
  const color = score >= 60 ? 'bg-red-500' : score >= 30 ? 'bg-amber-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[color:var(--border)] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-[color:var(--foreground)] w-6 text-right">{score}</span>
    </div>
  )
}

export default function LeadScores({ users }: { users: ScoredUser[] }) {
  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[color:var(--border)]">
            <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Lead</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)] w-40">Score</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Showings</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Questions</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-surface-2)] transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-[color:var(--foreground)]">{u.name ?? 'Anonymous'}</p>
                <p className="text-xs text-[color:var(--text-muted)]">{u.email}</p>
              </td>
              <td className="px-4 py-3 w-40">
                <ScoreBar score={u.score} />
              </td>
              <td className="px-4 py-3 text-sm tabular-nums text-[color:var(--text-muted)]">{u.showingCount}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-[color:var(--text-muted)]">{u.questionCount}</td>
              <td className="px-4 py-3">
                <a href={`mailto:${u.email}`}
                  className="text-xs text-[color:var(--accent)] hover:underline">Email</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
