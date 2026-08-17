import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth, signOut } from '@/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/dashboard')

  const role = session.user.role
  if (role !== 'agent' && role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[color:var(--border)] bg-[color:var(--bg-surface)] flex flex-col">
        <div className="px-5 py-5 border-b border-[color:var(--border)]">
          <Link href="/" className="text-sm font-bold text-[color:var(--foreground)]">Toronto Realty</Link>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Agent Dashboard</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <NavLink href="/dashboard" label="Overview" icon="⊞" />
          <NavLink href="/dashboard/leads" label="Leads" icon="◈" />
          <NavLink href="/dashboard/showings" label="Showings" icon="◷" />
          <NavLink href="/dashboard/questions" label="Questions" icon="?" />
          <NavLink href="/dashboard/properties" label="Properties" icon="⊠" />
          <NavLink href="/dashboard/open-houses" label="Open Houses" icon="⌂" />
          <NavLink href="/dashboard/documents" label="Documents" icon="⊟" />
          <NavLink href="/dashboard/users" label="Users" icon="⊙" />
          <NavLink href="/dashboard/inquiries" label="Inquiries" icon="✉" />
          <NavLink href="/dashboard/analytics" label="Analytics" icon="↗" />
          <NavLink href="/dashboard/blog" label="Blog / Updates" icon="✎" />
          <NavLink href="/dashboard/broadcast" label="Broadcast" icon="✉" />
          <div className="mt-2 pt-2 border-t border-[color:var(--border)]">
            <NavLink href="/account/favorites" label="My Favorite Listings" icon="♡" />
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-[color:var(--border)]">
          <div className="px-2 mb-3">
            <p className="text-xs font-medium text-[color:var(--foreground)] truncate">{session.user.name}</p>
            <p className="text-xs text-[color:var(--text-muted)] truncate">{session.user.email}</p>
          </div>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
            <button type="submit" className="w-full text-left px-2 py-1.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors"
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </Link>
  )
}
