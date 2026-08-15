import type { Metadata } from 'next'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getMLSAdapter } from '@/lib/mls/adapter'
import AnswerForm from './AnswerForm'

export const metadata: Metadata = { title: 'Questions — Dashboard' }

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

async function getQuestions() {
  try {
    return await (db as any).propertyQuestion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        answers: {
          orderBy: { createdAt: 'asc' },
          include: { agent: { select: { name: true } } },
        },
      },
    })
  } catch {
    return []
  }
}

export default async function QuestionsPage() {
  const [session, questions] = await Promise.all([auth(), getQuestions()])

  const adapter = getMLSAdapter()
  const propertyTitles: Record<string, string> = {}
  await Promise.all(
    [...new Set(questions.map((q: any) => q.propertyId))].map(async (id) => {
      try {
        const prop = await adapter.getListing(id as string)
        if (prop) propertyTitles[id as string] = prop.title
      } catch {}
    })
  )

  const unanswered = questions.filter((q: any) => q.answers.length === 0)
  const answered = questions.filter((q: any) => q.answers.length > 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Questions</h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-1">Questions from buyers across all listings</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-[color:var(--text-muted)]">Unanswered</p>
            <p className="text-2xl font-bold text-[color:var(--accent)] tabular-nums">{unanswered.length}</p>
          </div>
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-[color:var(--text-muted)]">Total</p>
            <p className="text-2xl font-bold text-[color:var(--foreground)] tabular-nums">{questions.length}</p>
          </div>
        </div>
      </div>

      {questions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--bg-surface)] border border-[color:var(--border)] flex items-center justify-center mb-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="var(--text-faint)" strokeWidth="1.4"/>
              <path d="M10 9V13M10 6V7" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-[color:var(--foreground)]">No questions yet</p>
          <p className="text-xs text-[color:var(--text-muted)] mt-1">Buyer questions from property pages appear here.</p>
        </div>
      )}

      {unanswered.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-[color:var(--accent)] uppercase tracking-widest mb-3">
            Needs your response ({unanswered.length})
          </h2>
          <div className="space-y-3">
            {unanswered.map((q: any) => (
              <QuestionCard
                key={q.id}
                question={q}
                propertyTitle={propertyTitles[q.propertyId]}
                agentId={session?.user?.id ?? ''}
                unanswered
              />
            ))}
          </div>
        </div>
      )}

      {answered.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-widest mb-3">
            Answered ({answered.length})
          </h2>
          <div className="space-y-3">
            {answered.map((q: any) => (
              <QuestionCard
                key={q.id}
                question={q}
                propertyTitle={propertyTitles[q.propertyId]}
                agentId={session?.user?.id ?? ''}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function QuestionCard({
  question: q,
  propertyTitle,
  agentId,
  unanswered,
}: {
  question: any
  propertyTitle?: string
  agentId: string
  unanswered?: boolean
}) {
  return (
    <div className={`bg-[color:var(--bg-surface)] border rounded-xl p-5 ${unanswered ? 'border-[color:var(--accent)]/30' : 'border-[color:var(--border)]'}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-medium text-[color:var(--foreground)] truncate">
              {q.user.name ?? q.user.email.split('@')[0]}
            </span>
            <span className="text-[10px] text-[color:var(--text-faint)]">{timeAgo(new Date(q.createdAt))}</span>
            {propertyTitle && (
              <span className="text-[10px] px-2 py-0.5 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-full text-[color:var(--text-muted)] truncate max-w-[200px]">
                {propertyTitle}
              </span>
            )}
          </div>
          <p className="text-sm text-[color:var(--foreground)] leading-relaxed mb-3">{q.text}</p>

          {q.answers.map((a: any) => (
            <div key={a.id} className="flex gap-2 mb-2 pl-3 border-l-2 border-[color:var(--accent)]/30">
              <div>
                <span className="text-xs font-semibold text-[color:var(--accent)]">{a.agent.name ?? 'You'}</span>
                <span className="text-[10px] text-[color:var(--text-faint)] ml-2">{timeAgo(new Date(a.createdAt))}</span>
                <p className="text-sm text-[color:var(--foreground)] leading-relaxed mt-0.5">{a.text}</p>
              </div>
            </div>
          ))}

          {unanswered && (
            <AnswerForm questionId={q.id} propertyId={q.propertyId} />
          )}
        </div>
      </div>
    </div>
  )
}
