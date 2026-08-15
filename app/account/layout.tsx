import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth, signOut } from '@/auth'
import AccountNavClient from './AccountNavClient'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/account/favorites')

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[color:var(--border)] bg-[color:var(--bg-surface)] flex flex-col">
        <div className="px-5 py-5 border-b border-[color:var(--border)]">
          <Link href="/" className="text-sm font-bold text-[color:var(--foreground)]">Toronto Realty</Link>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5">My Account</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <AccountNavClient />
        </nav>

        <div className="px-3 py-4 border-t border-[color:var(--border)]">
          <div className="px-2 mb-3">
            <p className="text-xs font-medium text-[color:var(--foreground)] truncate">{session.user.name ?? session.user.email}</p>
            <p className="text-xs text-[color:var(--text-muted)] truncate">{session.user.email}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-1.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors rounded-md hover:bg-[color:var(--bg-surface-2)]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to search
          </Link>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors rounded-md hover:bg-[color:var(--bg-surface-2)]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2H2C1.45 2 1 2.45 1 3V9C1 9.55 1.45 10 2 10H4M8 8L11 6L8 4M11 6H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
