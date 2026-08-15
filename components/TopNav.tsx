'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const role = (session?.user as any)?.role
  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() ?? '?'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)] shrink-0 z-40">
      <Link href="/" className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-md bg-[color:var(--accent)] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L9 5H13L10 8L11 12L7 10L3 12L4 8L1 5H5L7 1Z" fill="white" />
          </svg>
        </span>
        <span className="text-sm font-semibold text-[color:var(--foreground)]">Toronto Realty AI</span>
      </Link>

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
        ) : status === 'unauthenticated' ? (
          <Link href="/login"
            className="px-3.5 py-1.5 text-sm font-medium bg-[color:var(--accent)] text-white rounded-lg hover:bg-[color:var(--accent-hover)] transition-colors">
            Sign in
          </Link>
        ) : null}
      </div>
    </header>
  )
}
