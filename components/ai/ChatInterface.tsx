'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
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
  const { data: session } = useSession()
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({})
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasSentInitial = useRef(false)
  // Skip the very first save effect run (fires before restore is applied)
  const firstSaveRef = useRef(true)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Restore previous chat session when navigating back (only if no fresh initialMessage)
  useEffect(() => {
    if (!initialMessage) {
      const saved = loadSession()
      if (saved?.messages?.length) setMessages(saved.messages)
      if (saved?.searchResult) setSearchResult(saved.searchResult)
      if (saved?.currentFilters) setCurrentFilters(saved.currentFilters)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (initialMessage && !hasSentInitial.current) {
      hasSentInitial.current = true
      sendMessage(initialMessage)
    }
  }, [initialMessage]) // eslint-disable-line

  // Save session on every change, but skip the very first run (before restore is applied)
  useEffect(() => {
    if (firstSaveRef.current) { firstSaveRef.current = false; return }
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  async function saveChat() {
    if (saveState !== 'idle' || messages.length < 2) return
    setSaveState('saving')
    try {
      const res = await fetch('/api/ai/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          filtersState: currentFilters,
        }),
      })
      setSaveState(res.ok ? 'saved' : 'idle')
    } catch {
      setSaveState('idle')
    }
  }

  const hasResults = searchResult && searchResult.properties.length > 0
  const canSave = session?.user && messages.length >= 2 && !isStreaming

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left: conversation */}
      <div className="flex flex-col w-full lg:w-[420px] xl:w-[480px] border-r border-[color:var(--border)] bg-[color:var(--bg-surface)] shrink-0">
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
          {canSave && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={saveChat}
                disabled={saveState !== 'idle'}
                className={[
                  'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors',
                  saveState === 'saved'
                    ? 'border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:var(--accent-dim)]'
                    : 'border-[color:var(--border)] text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:border-[color:var(--border-strong)]',
                ].join(' ')}
              >
                {saveState === 'saving' ? (
                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1 1h7l2 2v7H1V1zM3 1v3h5V1M3 6h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {saveState === 'saved' ? 'Saved to profile' : 'Save this chat'}
              </button>
            </div>
          )}
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
