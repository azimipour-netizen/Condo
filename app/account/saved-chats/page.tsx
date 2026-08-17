'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ConversationPreview {
  id: string
  sessionId: string
  filtersState: Record<string, unknown>
  createdAt: string
  updatedAt: string
  messages: Array<{ role: string; content: string }>
}

export default function SavedChatsPage() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/ai/conversations')
      .then(r => r.json())
      .then(data => setConversations(data.conversations ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (deleting) return
    setDeleting(id)
    try {
      await fetch(`/api/ai/conversations/${id}`, { method: 'DELETE' })
      setConversations(prev => prev.filter(c => c.id !== id))
    } catch {}
    setDeleting(null)
  }

  function firstUserMessage(c: ConversationPreview) {
    return c.messages.find(m => m.role === 'user')?.content ?? 'Search conversation'
  }

  function resumeChat(c: ConversationPreview) {
    try {
      // Rebuild a minimal session so ChatInterface can restore it
      const allMessages = [] as Array<{ id: string; role: string; content: string; timestamp: string }>
      // We don't have full messages here (only first one from preview), so navigate to / and
      // let the user search again; full resume would need the [id] GET endpoint.
      // For now: copy the filters state to sessionStorage and go home
      sessionStorage.removeItem('chat_session')
    } catch {}
    window.location.href = '/'
  }

  return (
    <div className="px-6 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[color:var(--foreground)]">Saved Chats</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-0.5">
          AI search conversations you&apos;ve saved to your profile
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-[color:var(--border)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[color:var(--border)] rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[color:var(--bg-surface)] border border-[color:var(--border)] flex items-center justify-center mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" stroke="var(--text-faint)" strokeWidth="1.4" />
              <path d="M7 11h4M11 7v4" stroke="var(--text-faint)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-base font-semibold text-[color:var(--foreground)] mb-2">No saved chats yet</p>
          <p className="text-sm text-[color:var(--text-muted)] mb-6 max-w-xs">
            After a search conversation, click &ldquo;Save this chat&rdquo; to keep it here for future reference.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Start searching
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map(c => (
            <div
              key={c.id}
              className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-4 flex items-start gap-4 hover:border-[color:var(--border-strong)] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[color:var(--accent-dim)] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="var(--accent)" strokeWidth="1.4" />
                  <path d="M9.5 9.5L12.5 12.5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[color:var(--foreground)] truncate">
                  {firstUserMessage(c).slice(0, 120)}
                </p>
                <p className="text-xs text-[color:var(--text-muted)] mt-1">
                  {new Date(c.updatedAt).toLocaleDateString('en-CA', {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/"
                  onClick={() => {
                    try { sessionStorage.removeItem('chat_session') } catch {}
                  }}
                  className="text-xs px-3 py-1.5 bg-[color:var(--accent)] text-white rounded-lg hover:bg-[color:var(--accent-hover)] transition-colors font-medium"
                >
                  New search
                </a>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deleting === c.id}
                  title="Delete"
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--text-faint)] hover:text-[color:var(--error)] hover:border-[color:var(--error)] transition-colors disabled:opacity-40"
                >
                  {deleting === c.id ? (
                    <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 3h8M4.5 3V1.5h2V3M9 3l-.5 7h-6L2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
