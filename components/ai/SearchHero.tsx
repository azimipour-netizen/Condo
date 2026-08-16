'use client'

import { useState, useRef, useEffect } from 'react'
import ChatInterface from './ChatInterface'
import RecentlyViewed from '@/components/property/RecentlyViewed'

const SUGGESTED_PROMPTS = [
  '3-bedroom home under $1.5M near transit',
  'Modern condo near Union Station',
  'Family home in North York with a garage',
  'Investment property under $800K',
  'Renovated semi-detached in Leslieville',
]

export default function SearchHero() {
  const [query, setQuery] = useState('')
  const [started, setStarted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Restore chat session on back navigation
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('chat_session')
      if (raw) {
        const data = JSON.parse(raw)
        if ((data.messages?.length ?? 0) > 0) setStarted(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [query])

  function handleSubmit(e: React.FormEvent | React.KeyboardEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    try { sessionStorage.removeItem('chat_session') } catch {}
    setStarted(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  function handlePrompt(p: string) {
    setQuery(p)
    try { sessionStorage.removeItem('chat_session') } catch {}
    setStarted(true)
  }

  if (started) {
    return <ChatInterface initialMessage={query.trim()} />
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[color:var(--foreground)] leading-tight max-w-2xl mx-auto" style={{ textWrap: 'balance' }}>
            Find Your Next Home,<br />
            <span className="text-[color:var(--accent)]">Just Tell Us What You're Looking For</span>
          </h1>

          <p className="mt-4 text-lg text-[color:var(--text-muted)] max-w-lg mx-auto" style={{ textWrap: 'balance' }}>
            Describe the home, location, budget, or lifestyle you have in mind. Our AI will search available GTA listings and show you what matches.
          </p>
        </div>

        {/* Search box */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="relative bg-[color:var(--bg-surface)] border border-[color:var(--border-strong)] rounded-2xl shadow-lg hover:border-[color:var(--accent)] focus-within:border-[color:var(--accent)] focus-within:ring-2 focus-within:ring-[color:var(--accent)]/20 transition-all">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I'm looking for a 3-bedroom house near North York, close to the subway, under $1.4M…"
              rows={2}
              className="w-full resize-none bg-transparent px-5 pt-4 pb-14 text-base text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none leading-relaxed"
              aria-label="Describe the property you're looking for"
            />
            <div className="absolute bottom-3 right-3">
              <button
                type="submit"
                disabled={!query.trim()}
                className="flex items-center gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <span>Search</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7H13M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-[color:var(--text-faint)] text-center">
            Press Enter to search · Shift+Enter for new line
          </p>
        </form>

        {/* Suggested prompts */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-2xl">
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => handlePrompt(p)}
              className="px-3.5 py-2 text-sm bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:border-[color:var(--accent)] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Recently viewed */}
        <div className="mt-10 w-full max-w-2xl">
          <RecentlyViewed />
        </div>

        {/* Trust line */}
        <p className="mt-8 text-xs text-[color:var(--text-faint)] text-center">
          Authorized MLS data · GTA &amp; surrounding regions · All listings from verified sources
        </p>
      </div>
    </div>
  )
}
