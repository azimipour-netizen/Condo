'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Props {
  propertyId: string
  initialSaved?: boolean
  size?: 'sm' | 'md'
}

export default function SaveButton({ propertyId, initialSaved = false, size = 'sm' }: Props) {
  const { status } = useSession()
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/properties/saved', {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      })
      if (res.ok) setSaved(s => !s)
    } finally {
      setLoading(false)
    }
  }

  if (size === 'md') {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={[
          'w-full flex items-center justify-center gap-2 border rounded-xl py-3 text-sm font-medium transition-colors',
          saved
            ? 'bg-rose-500 border-rose-500 text-white'
            : 'border-[color:var(--border)] text-[color:var(--foreground)] hover:border-rose-400 hover:text-rose-400',
          loading ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        <svg width="15" height="15" viewBox="0 0 14 14" fill={saved ? 'currentColor' : 'none'}>
          <path
            d="M7 12.5C7 12.5 1 8.5 1 4.5C1 2.567 2.567 1 4.5 1C5.553 1 6.5 1.5 7 2.3C7.5 1.5 8.447 1 9.5 1C11.433 1 13 2.567 13 4.5C13 8.5 7 12.5 7 12.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {saved ? 'Saved' : 'Save Property'}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? 'Remove from saved' : 'Save property'}
      className={[
        'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border transition-colors',
        saved
          ? 'bg-rose-500 border-rose-500 text-white'
          : 'border-[color:var(--border)] text-[color:var(--text-muted)] hover:border-rose-400 hover:text-rose-400',
        loading ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill={saved ? 'currentColor' : 'none'}>
        <path
          d="M7 12.5C7 12.5 1 8.5 1 4.5C1 2.567 2.567 1 4.5 1C5.553 1 6.5 1.5 7 2.3C7.5 1.5 8.447 1 9.5 1C11.433 1 13 2.567 13 4.5C13 8.5 7 12.5 7 12.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
