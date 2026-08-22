'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

interface Props {
  userId: string
  label: string
  /** Own account and last-admin cases are rejected server-side too. */
  disabled?: boolean
}

export default function DeleteUserButton({ userId, label, disabled }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function remove() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(body.error ?? 'Could not delete user')
        setConfirming(false)
        return
      }
      router.refresh()
    } catch {
      setError('Network error')
      setConfirming(false)
    } finally {
      setLoading(false)
    }
  }

  if (disabled) return null

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Delete?</span>
        <button
          onClick={remove}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-3 w-3 animate-spin" />}
          Yes
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="rounded-full px-2.5 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${label}`}
        title={`Delete ${label}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 dark:text-neutral-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {error && <span className="max-w-[200px] text-right text-[11px] leading-tight text-red-600 dark:text-red-400">{error}</span>}
    </div>
  )
}
