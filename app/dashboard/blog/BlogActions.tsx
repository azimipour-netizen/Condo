'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BlogActions({ slug, published }: { slug: string; published: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function togglePublish() {
    setBusy(true)
    try {
      await fetch(`/api/blog/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      })
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  async function deletePost() {
    if (!confirm('Delete this post permanently?')) return
    setBusy(true)
    try {
      await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button onClick={togglePublish} disabled={busy}
        className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] disabled:opacity-50 transition-colors">
        {published ? 'Unpublish' : 'Publish'}
      </button>
      <button onClick={deletePost} disabled={busy}
        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors">
        Delete
      </button>
    </>
  )
}
