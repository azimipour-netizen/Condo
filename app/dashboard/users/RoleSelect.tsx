'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'consumer' | 'agent' | 'admin'

const ROLE_LABELS: Record<Role, string> = {
  consumer: 'Buyer',
  agent: 'Agent',
  admin: 'Admin',
}

interface Props {
  userId: string
  initialRole: Role
  /** True for the signed-in admin's own card — self-demotion is blocked. */
  isSelf?: boolean
}

export default function RoleSelect({ userId, initialRole, isSelf }: Props) {
  const router = useRouter()
  const [role, setRole] = useState<Role>(initialRole)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function changeRole(next: Role) {
    if (next === role) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: next }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(body.error ?? 'Could not update role')
        return
      }
      setRole(next)
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={role}
        disabled={loading || (isSelf && role === 'admin')}
        onChange={e => changeRole(e.target.value as Role)}
        title={isSelf && role === 'admin' ? 'Promote another admin before changing your own role' : 'Change role'}
        className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition-colors disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
      >
        {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>
      {error && <span className="max-w-[180px] text-right text-[11px] leading-tight text-red-600 dark:text-red-400">{error}</span>}
    </div>
  )
}
