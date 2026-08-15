'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import ChatInterface from './ChatInterface'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session, status } = useSession()
  const role = (session?.user as any)?.role

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
    setStarted(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  function handlePrompt(p: string) {
    setQuery(p)
    setStarted(true)
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

  if (started) {
    return <ChatInterface initialMessage={query.trim()} />
  }

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top nav */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-[color:var(--accent)] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5H13L10 8L11 12L7 10L3 12L4 8L1 5H5L7 1Z" fill="white" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-[color:var(--foreground)]">Toronto Realty AI</span>
        </div>

        <div className="flex items-center gap-3">
          {status === 'authenticated' ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[color:var(--accent)] text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </span>
                <span className="text-sm text-[color:var(--foreground)] hidden sm:block max-w-[120px] truncate">
                  {session.user?.name ?? session.user?.email}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-[color:var(--text-muted)] transition-transform ${menuOpen ? 'rotate-180' : ''}`}>
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-[color:var(--border)]">
                    <p className="text-xs font-medium text-[color:var(--foreground)] truncate">{session.user?.name}</p>
                    <p className="text-xs text-[color:var(--text-muted)] truncate">{session.user?.email}</p>
                  </div>
                  <Link href="/saved" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12.5C7 12.5 1 8.5 1 4.5C1 2.567 2.567 1 4.5 1C5.553 1 6.5 1.5 7 2.3C7.5 1.5 8.447 1 9.5 1C11.433 1 13 2.567 13 4.5C13 8.5 7 12.5 7 12.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Saved Properties
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
              className="px-3.5 py-1.5 text-sm font-medium bg-[color:var(--accent)] text-white rounded-lg hover:bg-[color:var(--accent-hover)] transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </header>

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

      {/* Trust line */}
      <p className="mt-16 text-xs text-[color:var(--text-faint)] text-center">
        Authorized MLS data · GTA &amp; surrounding regions · All listings from verified sources
      </p>
      </div>
    </div>
  )
}
