'use client'

import { useState } from 'react'

interface Props {
  userId: string
  initialUnlocked: boolean
}

export default function DocAccessToggle({ userId, initialUnlocked }: Props) {
  const [unlocked, setUnlocked] = useState(initialUnlocked)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/documents-access`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unlocked: !unlocked }),
      })
      if (res.ok) setUnlocked(u => !u)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={[
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] disabled:opacity-50',
        unlocked ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--border)]',
      ].join(' ')}
      role="switch"
      aria-checked={unlocked}
      aria-label="Toggle document access"
    >
      <span
        className={[
          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200',
          unlocked ? 'translate-x-4' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}
