'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inputCls = "w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors"

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120)
}

interface InitialValues {
  slug?: string
  title?: string
  summary?: string
  body?: string
  published?: boolean
}

export default function BlogEditor({ initial }: { initial?: InitialValues }) {
  const router = useRouter()
  const isEdit = !!initial?.slug

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    summary: initial?.summary ?? '',
    body: initial?.body ?? '',
    published: initial?.published ?? false,
  })
  const [slugManual, setSlugManual] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = key === 'published' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm(f => ({
        ...f,
        [key]: value,
        ...(key === 'title' && !slugManual ? { slug: slugify(e.target.value) } : {}),
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = isEdit
        ? await fetch(`/api/blog/${initial!.slug}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: form.title, summary: form.summary, body: form.body, published: form.published }),
          })
        : await fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Server error')
        return
      }
      router.push('/dashboard/blog')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Title *</label>
          <input type="text" required value={form.title} onChange={set('title')} className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">
            URL Slug *
            {!isEdit && (
              <span className="ml-2 text-xs font-normal text-[color:var(--text-muted)]">
                (auto-generated from title)
              </span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[color:var(--text-muted)]">/blog/</span>
            <input
              type="text"
              required
              value={form.slug}
              readOnly={isEdit}
              onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: e.target.value })) }}
              className={`flex-1 ${inputCls} ${isEdit ? 'opacity-60 cursor-default' : ''}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">
            Summary * <span className="text-xs font-normal text-[color:var(--text-muted)]">(shown on index, max 500 chars)</span>
          </label>
          <textarea required rows={3} maxLength={500} value={form.summary} onChange={set('summary')} className={inputCls} />
        </div>
      </div>

      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5">
        <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">
          Body * <span className="text-xs font-normal text-[color:var(--text-muted)]">(plain text or simple HTML)</span>
        </label>
        <textarea required rows={18} value={form.body} onChange={set('body')} className={inputCls}
          placeholder="Write your market update here..." />
      </div>

      <div className="flex items-center gap-3 px-1">
        <input type="checkbox" id="published" checked={form.published}
          onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
          className="w-4 h-4 accent-[color:var(--accent)]" />
        <label htmlFor="published" className="text-sm text-[color:var(--foreground)] cursor-pointer">
          Publish immediately
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <Link href="/dashboard/blog"
          className="px-5 py-2.5 border border-[color:var(--border)] text-sm rounded-xl hover:bg-[color:var(--bg-surface-2)] transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition">
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}
