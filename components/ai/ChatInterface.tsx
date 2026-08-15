'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import type { AIMessage } from '@/types/ai'
import type { SearchResult, SearchFilters } from '@/types/search'
import MessageBubble from './MessageBubble'
import PropertyResultsPanel from '@/components/property/PropertyResultsPanel'

interface Props {
  initialMessage?: string
}

const SESSION_KEY = 'chat_session'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as { messages: AIMessage[]; searchResult: SearchResult | null; currentFilters: SearchFilters }
  } catch { return null }
}

function saveSession(messages: AIMessage[], searchResult: SearchResult | null, currentFilters: SearchFilters) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ messages, searchResult, currentFilters }))
  } catch {}
}

export default function ChatInterface({ initialMessage }: Props) {
  const saved = typeof window !== 'undefined' ? loadSession() : null
  const [messages, setMessages] = useState<AIMessage[]>(saved?.messages ?? [])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(saved?.searchResult ?? null)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(saved?.currentFilters ?? {})
  const [menuOpen, setMenuOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const hasSentInitial = useRef(false)
  const { data: session, status } = useSession()
  const role = (session?.user as any)?.role
  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() ?? '?'

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (initialMessage && !hasSentInitial.current) {
      hasSentInitial.current = true
      sendMessage(initialMessage)
    }
  }, [initialMessage]) // eslint-disable-line

  useEffect(() => {
    saveSession(messages, searchResult, currentFilters)
  }, [messages, searchResult, currentFilters])

  async function sendMessage(text: string) {
    const userMsg: AIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setIsStreaming(true)

    const assistantId = crypto.randomUUID()
    let assistantContent = ''

    setMessages(prev => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date().toISOString() },
    ])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok || !res.body) throw new Error('AI request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      function processEvent(line: string) {
        if (!line.startsWith('data: ')) return
        try {
          const data = JSON.parse(line.slice(6))
          if (data.type === 'text') {
            assistantContent += data.content
            setMessages(prev =>
              prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
            )
          }
          if (data.type === 'tool_result' && data.name === 'search_properties') {
            const result = data.data as SearchResult
            setSearchResult(result)
            setCurrentFilters(result.appliedFilters ?? {})
          }
        } catch {
          // malformed event, skip
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Split on double-newline (SSE event boundary) and process complete events
        const events = buffer.split('\n\n')
        // Last element may be incomplete — keep it in the buffer
        buffer = events.pop() ?? ''
        for (const event of events) {
          for (const line of event.split('\n')) {
            processEvent(line)
          }
        }
      }

      // Process any remaining buffered data
      for (const line of buffer.split('\n')) {
        processEvent(line)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, content: `Error: ${msg}` } : m)
      )
    } finally {
      setIsStreaming(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isStreaming) return
    sendMessage(text)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const text = input.trim()
      if (!text || isStreaming) return
      sendMessage(text)
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const hasResults = searchResult && searchResult.properties.length > 0

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: conversation */}
      <div className="flex flex-col w-full lg:w-[420px] xl:w-[480px] border-r border-[color:var(--border)] bg-[color:var(--bg-surface)] shrink-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[color:var(--border)]">
          <div className="w-7 h-7 rounded-lg bg-[color:var(--accent)] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5H13L10 8L11 12L7 10L3 12L4 8L1 5H5L7 1Z" fill="white" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[color:var(--foreground)] flex-1">Toronto Realty AI</p>

          {status === 'authenticated' ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[color:var(--accent)] text-white text-[10px] font-bold flex items-center justify-center">
                  {initials}
                </span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={`text-[color:var(--text-muted)] transition-transform ${menuOpen ? 'rotate-180' : ''}`}>
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-[color:var(--border)]">
                    <p className="text-xs font-medium text-[color:var(--foreground)] truncate">{session.user?.name}</p>
                    <p className="text-xs text-[color:var(--text-muted)] truncate">{session.user?.email}</p>
                  </div>
                  <Link href="/account/favorites" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12.5C7 12.5 1 8.5 1 4.5C1 2.567 2.567 1 4.5 1C5.553 1 6.5 1.5 7 2.3C7.5 1.5 8.447 1 9.5 1C11.433 1 13 2.567 13 4.5C13 8.5 7 12.5 7 12.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Saved Properties
                  </Link>
                  <Link href="/account/documents" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 1H9L12 4V13H3V1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M9 1V4H12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5 7H9M5 9.5H7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    My Documents
                  </Link>
                  {(role === 'agent' || role === 'admin') && (
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>
                      My Real Estate Dashboard
                    </Link>
                  )}
                  <div className="border-t border-[color:var(--border)] mt-1 pt-1">
                    <button onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2H2C1.45 2 1 2.45 1 3V11C1 11.55 1.45 12 2 12H5M9 10L13 7L9 4M13 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="px-3 py-1.5 text-xs font-medium bg-[color:var(--accent)] text-white rounded-lg hover:bg-[color:var(--accent-hover)] transition-colors">
              Sign in
            </Link>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-[color:var(--text-muted)] text-sm">
              Tell me what you're looking for…
            </div>
          )}
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isStreaming={isStreaming && msg.id === messages[messages.length - 1]?.id && msg.role === 'assistant'} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[color:var(--border)] px-4 py-3">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Refine your search or ask a question…"
              rows={1}
              disabled={isStreaming}
              className="w-full resize-none bg-[color:var(--bg-surface-2)] rounded-xl px-4 py-3 pr-12 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none border border-[color:var(--border)] focus:border-[color:var(--accent)] disabled:opacity-50 transition-colors leading-relaxed"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="absolute right-3 bottom-3 w-7 h-7 flex items-center justify-center bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isStreaming ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6H11M6 1L11 6L6 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </form>
          <p className="text-xs text-[color:var(--text-faint)] mt-1.5 text-center">
            AI search assistant — all listings from authorized data sources
          </p>
        </div>
      </div>

      {/* Right: results */}
      <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-[color:var(--background)]">
        {hasResults ? (
          <PropertyResultsPanel result={searchResult} filters={currentFilters} />
        ) : (
          <EmptyResultsState hasStarted={messages.length > 0} />
        )}
      </div>
    </div>
  )
}

function EmptyResultsState({ hasStarted }: { hasStarted: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center text-center p-8">
      <div>
        <div className="w-14 h-14 rounded-2xl bg-[color:var(--accent-dim)] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="var(--accent)" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[color:var(--foreground)] mb-1">
          {hasStarted ? 'Searching…' : 'Properties will appear here'}
        </p>
        <p className="text-sm text-[color:var(--text-muted)] max-w-xs">
          {hasStarted
            ? 'Finding matching listings for you'
            : 'Describe what you\'re looking for in the chat and matching GTA properties will appear here'}
        </p>
      </div>
    </div>
  )
}
