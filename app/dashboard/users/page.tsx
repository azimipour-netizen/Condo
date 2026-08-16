import { db } from '@/lib/db'
import DocAccessToggle from './DocAccessToggle'

export const metadata = { title: 'Users — Dashboard' }

async function getUsers() {
  try {
    const users = await (db as any).user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        documentsUnlocked: true,
        createdAt: true,
        _count: { select: { uploadedDocuments: true } },
      },
    })
    return users as Array<{
      id: string
      name: string | null
      email: string
      role: string
      documentsUnlocked: boolean
      createdAt: Date
      _count: { uploadedDocuments: number }
    }>
  } catch {
    return []
  }
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d))
}

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
  agent: 'bg-[color:var(--accent-dim)] text-[color:var(--accent)] border-[color:var(--accent)]/20',
  consumer: 'bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)] border-[color:var(--border)]',
}

export default async function UsersPage() {
  const users = await getUsers()
  const consumers = users.filter(u => u.role === 'consumer')
  const agents = users.filter(u => u.role !== 'consumer')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Users</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">{users.length} total · {consumers.length} buyers · {agents.length} agents/admins</p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 text-[color:var(--text-muted)] text-sm">No users yet.</div>
      ) : (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">Docs</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">Doc access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[color:var(--bg-surface-2)] transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-medium text-[color:var(--foreground)]">{u.name ?? '—'}</p>
                      <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_BADGE[u.role] ?? ROLE_BADGE.consumer}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[color:var(--text-muted)]">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 text-[color:var(--text-muted)] tabular-nums">
                    {u._count.uploadedDocuments}
                  </td>
                  <td className="px-5 py-3.5">
                    {u.role === 'consumer' ? (
                      <div className="flex items-center gap-2.5">
                        <DocAccessToggle userId={u.id} initialUnlocked={u.documentsUnlocked} />
                        <span className="text-xs text-[color:var(--text-faint)]">
                          {u.documentsUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[color:var(--text-faint)]">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
