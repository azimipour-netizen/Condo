'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/account/favorites',
    label: 'My Favorite Listings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
        <path d="M7 12.5C7 12.5 1 8.5 1 4.5C1 2.567 2.567 1 4.5 1C5.553 1 6.5 1.5 7 2.3C7.5 1.5 8.447 1 9.5 1C11.433 1 13 2.567 13 4.5C13 8.5 7 12.5 7 12.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/account/documents',
    label: 'My Documents',
    icon: (
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
        <path d="M3 1H9L12 4V13H3V1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M9 1V4H12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M5 7H9M5 9.5H7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/account/saved-searches',
    label: 'Saved Searches',
    icon: (
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/account/settings',
    label: 'Settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.636 2.636l1.06 1.06M10.304 10.304l1.06 1.06M2.636 11.364l1.06-1.06M10.304 3.696l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function AccountNavClient() {
  const pathname = usePathname()

  return (
    <>
      {NAV.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              active
                ? 'bg-[color:var(--accent-dim)] text-[color:var(--accent)] font-medium'
                : 'text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)]',
            ].join(' ')}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
