'use client'

import StarBurst from '@/components/star-burst'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import ChatInterface from './ChatInterface'
import RecentlyViewed from '@/components/property/RecentlyViewed'
import PropertyCard from '@/components/property/PropertyCard'
import type { PropertySummary } from '@/types/property'

const SUGGESTED_PROMPTS = [
  '3-bedroom home under $1.5M near transit',
  'Modern condo near Union Station',
  'Family home in North York with a garage',
  'Investment property under $800K',
  'Renovated semi-detached in Leslieville',
]

const CITY_LINKS = [
  { city: 'Toronto', href: '/?city=Toronto' },
  { city: 'Mississauga', href: '/?city=Mississauga' },
  { city: 'Vaughan', href: '/?city=Vaughan' },
  { city: 'Markham', href: '/?city=Markham' },
  { city: 'Brampton', href: '/?city=Brampton' },
  { city: 'Richmond Hill', href: '/?city=Richmond+Hill' },
]

interface Props {
  featured: PropertySummary[]
  activeCount: number
  avgPrice: number | null
}

/**
 * Owns whether the homepage shows the marketing hero (stats strip, featured
 * listings, CTA section) or the full-height chat view. This has to live above
 * those marketing sections, not inside the hero component alone — they used
 * to render unconditionally as flex siblings below the hero, which meant that
 * once a chat started, ChatInterface's `flex-1` region had to compete with
 * their real rendered height for space and collapsed to near zero. Hiding
 * them here is what lets the chat actually fill the screen.
 */
export default function HomeExperience({ featured, activeCount, avgPrice }: Props) {
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
    // ChatInterface's own root already declares `flex flex-1 min-h-0` — no
    // extra wrapper needed, and none of the marketing sections below render
    // as siblings here, so it gets the full remaining height.
    return <ChatInterface initialMessage={query.trim()} />
  }

  return (
    <main className="flex-1 min-h-0 overflow-y-auto flex flex-col bg-[color:var(--background)]">
      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Decorative starfield behind the hero. aria-hidden and
            pointer-events-none so it never intercepts the search box or
            reaches assistive tech; .hero-starfield gates it to the dark
            palette and drops it under prefers-reduced-motion. */}
        <div
          className="hero-starfield absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <StarBurst
            color="#14B8A6"
            opacity={0.85}
            brightness={1.4}
            starSize={0.45}
            speed={0.4}
            centerY={0.38}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10 mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[color:var(--foreground)] leading-tight max-w-2xl mx-auto" style={{ textWrap: 'balance' }}>
            Find Your Next Home,<br />
            <span className="text-[color:var(--accent)]">Just Tell Us What You're Looking For</span>
          </h1>

          <p className="mt-4 text-lg text-[color:var(--text-muted)] max-w-lg mx-auto" style={{ textWrap: 'balance' }}>
            Describe the home, location, budget, or lifestyle you have in mind. Our AI will search available GTA listings and show you what matches.
          </p>
        </div>

        {/* Search box */}
        <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-2xl">
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
        <div className="relative z-10 mt-8 flex flex-wrap gap-2 justify-center max-w-2xl">
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
        <div className="relative z-10 mt-10 w-full max-w-2xl">
          <RecentlyViewed />
        </div>

        {/* Trust line */}
        <p className="mt-8 text-xs text-[color:var(--text-faint)] text-center">
          Authorized MLS data · GTA &amp; surrounding regions · All listings from verified sources
        </p>
      </div>

      {/* Stats strip */}
      <div className="border-t border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap gap-6 items-center justify-center sm:justify-start">
          {activeCount > 0 && (
            <div className="text-center sm:text-left">
              <p className="text-xl font-bold text-[color:var(--foreground)] tabular-nums">{activeCount.toLocaleString()}</p>
              <p className="text-xs text-[color:var(--text-muted)]">Active listings</p>
            </div>
          )}
          {avgPrice && (
            <div className="text-center sm:text-left">
              <p className="text-xl font-bold text-[color:var(--foreground)] tabular-nums">
                ${(avgPrice / 1_000_000).toFixed(avgPrice % 1_000_000 === 0 ? 0 : 1)}M
              </p>
              <p className="text-xs text-[color:var(--text-muted)]">Average price</p>
            </div>
          )}
          <div className="text-center sm:text-left">
            <p className="text-xl font-bold text-[color:var(--foreground)]">GTA</p>
            <p className="text-xs text-[color:var(--text-muted)]">Coverage area</p>
          </div>
          <div className="sm:ml-auto flex items-center gap-3 flex-wrap justify-center">
            {CITY_LINKS.map(({ city, href }) => (
              <Link key={city} href={href}
                className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[color:var(--foreground)]">Recently Listed</h2>
            <Link href="/search"
              className="text-sm text-[color:var(--accent)] hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="border-t border-[color:var(--border)] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
          <div>
            <p className="text-lg font-semibold text-[color:var(--foreground)] mb-1">Find Your Home</p>
            <p className="text-sm text-[color:var(--text-muted)] mb-3">AI-powered search across the GTA.</p>
            <Link href="/search" className="text-sm text-[color:var(--accent)] hover:underline">Browse all listings →</Link>
          </div>
          <div>
            <p className="text-lg font-semibold text-[color:var(--foreground)] mb-1">Mortgage Calculator</p>
            <p className="text-sm text-[color:var(--text-muted)] mb-3">Estimate your monthly payments instantly.</p>
            <Link href="/mortgage-calculator" className="text-sm text-[color:var(--accent)] hover:underline">Try the calculator →</Link>
          </div>
          <div>
            <p className="text-lg font-semibold text-[color:var(--foreground)] mb-1">Open Houses</p>
            <p className="text-sm text-[color:var(--text-muted)] mb-3">See upcoming showings and RSVP online.</p>
            <Link href="/open-houses" className="text-sm text-[color:var(--accent)] hover:underline">View open houses →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
