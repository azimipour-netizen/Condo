import { db } from '@/lib/db'
import UsersGrid, { type UserRow } from './UsersGrid'

export const metadata = { title: 'Users — Dashboard' }

async function getUsers(): Promise<UserRow[]> {
  try {
    return await (db as any).user.findMany({
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
  } catch {
    return []
  }
}

export default async function UsersPage() {
  const users = await getUsers()
  const consumers = users.filter(u => u.role === 'consumer')
  const agents = users.filter(u => u.role !== 'consumer')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Users</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">
          {users.length} total · {consumers.length} buyers · {agents.length} agents/admins
        </p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 text-[color:var(--text-muted)] text-sm">No users yet.</div>
      ) : (
        <UsersGrid users={users} />
      )}
    </div>
  )
}
