'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

const NAV_LINKS = [
  { href: '/homes-for-sale', label: 'Homes for Sale' },
  { href: '/neighbourhoods', label: 'Neighbourhoods' },
  { href: '/open-houses', label: 'Open Houses' },
  { href: '/blog', label: 'Market Updates' },
  { href: '/about', label: 'About' },
]

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const role = session?.user?.role
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

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [])

  return (
    <>
      <header className="flex items-center justify-between px-5 h-14 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)] shrink-0 z-40 relative">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-mark.png" alt="" width={32} height={32} priority className="w-8 h-8" />
          <span className="text-sm font-semibold text-[color:var(--foreground)]">Condohill</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Desktop nav links */}
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors hidden sm:block">
              {l.label}
            </Link>
          ))}

          {/* Map Search button */}
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-[color:var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1C4.29 1 2.5 2.79 2.5 5C2.5 7.5 6.5 12 6.5 12C6.5 12 10.5 7.5 10.5 5C10.5 2.79 8.71 1 6.5 1ZM6.5 6.5C5.67 6.5 5 5.83 5 5C5 4.17 5.67 3.5 6.5 3.5C7.33 3.5 8 4.17 8 5C8 5.83 7.33 6.5 6.5 6.5Z" fill="currentColor"/>
            </svg>
            Map Search
          </Link>

          {/* New Search button */}
          <a
            href="/"
            onClick={() => { try { sessionStorage.removeItem('chat_session') } catch {} }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-[color:var(--border)] text-[color:var(--foreground)] rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M9 9L11.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            New Search
          </a>

          {/* Desktop user menu */}
          {status === 'authenticated' ? (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[color:var(--accent)] text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </span>
                <span className="text-sm text-[color:var(--foreground)] max-w-[120px] truncate">
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
                    Saved Properties
                  </Link>
                  <Link href="/account/saved-searches" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    Saved Searches
                  </Link>
                  <Link href="/account/documents" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    My Documents
                  </Link>
                  <Link href="/account/settings" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    Settings
                  </Link>
                  {(role === 'agent' || role === 'admin') && (
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                      Dashboard
                    </Link>
                  )}
                  <div className="border-t border-[color:var(--border)] mt-1 pt-1">
                    <button onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : status === 'unauthenticated' ? (
            <Link href="/login"
              className="px-3.5 py-1.5 text-sm font-medium bg-[color:var(--accent)] text-white rounded-lg hover:opacity-90 transition-colors hidden sm:block">
              Sign in
            </Link>
          ) : null}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-30 flex flex-col" onClick={() => setMobileOpen(false)}>
          {/* Backdrop */}
          <div className="flex-1 bg-black/40" />
        </div>
      )}
      {mobileOpen && (
        <div className="sm:hidden fixed top-[53px] left-0 right-0 z-40 bg-[color:var(--bg-surface)] border-b border-[color:var(--border)] shadow-lg">
          <nav className="flex flex-col divide-y divide-[color:var(--border)]">
            <Link href="/search" onClick={() => setMobileOpen(false)}
              className="px-5 py-3.5 text-sm font-medium text-[color:var(--accent)] hover:bg-[color:var(--bg-surface-2)] transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C4.79 1 3 2.79 3 5C3 7.83 7 13 7 13C7 13 11 7.83 11 5C11 2.79 9.21 1 7 1ZM7 6.5C6.17 6.5 5.5 5.83 5.5 5C5.5 4.17 6.17 3.5 7 3.5C7.83 3.5 8.5 4.17 8.5 5C8.5 5.83 7.83 6.5 7 6.5Z" fill="currentColor"/>
              </svg>
              Map Search
            </Link>
            <a href="/"
              onClick={() => { try { sessionStorage.removeItem('chat_session') } catch {} }}
              className="px-5 py-3.5 text-sm font-medium text-[color:var(--text-muted)] hover:bg-[color:var(--bg-surface-2)] transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              New Search
            </a>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="px-5 py-3.5 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                {l.label}
              </Link>
            ))}
            {status === 'authenticated' ? (
              <>
                <div className="px-5 py-3 bg-[color:var(--bg-surface-2)]">
                  <p className="text-xs font-medium text-[color:var(--foreground)]">{session.user?.name}</p>
                  <p className="text-xs text-[color:var(--muted)]">{session.user?.email}</p>
                </div>
                <Link href="/account/favorites" onClick={() => setMobileOpen(false)}
                  className="px-5 py-3.5 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                  Saved Properties
                </Link>
                <Link href="/account/saved-searches" onClick={() => setMobileOpen(false)}
                  className="px-5 py-3.5 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                  Saved Searches
                </Link>
                <Link href="/account/settings" onClick={() => setMobileOpen(false)}
                  className="px-5 py-3.5 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                  Settings
                </Link>
                {(role === 'agent' || role === 'admin') && (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="px-5 py-3.5 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    Dashboard
                  </Link>
                )}
                <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }) }}
                  className="text-left px-5 py-3.5 text-sm text-red-500 hover:bg-[color:var(--bg-surface-2)] transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="px-5 py-3.5 text-sm font-medium text-[color:var(--accent)] hover:bg-[color:var(--bg-surface-2)] transition-colors">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
