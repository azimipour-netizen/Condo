'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GTA_CITIES } from '@/lib/seo/gta-cities'

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
  coverImageUrl?: string | null
  citySlug?: string | null
  metaDescription?: string | null
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
    coverImageUrl: initial?.coverImageUrl ?? '',
    citySlug: initial?.citySlug ?? '',
    metaDescription: initial?.metaDescription ?? '',
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

    const payload = {
      ...form,
      coverImageUrl: form.coverImageUrl.trim() || null,
      citySlug: form.citySlug || null,
      metaDescription: form.metaDescription.trim() || null,
    }

    try {
      const res = isEdit
        ? await fetch(`/api/blog/${initial!.slug}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: payload.title, summary: payload.summary, body: payload.body,
              published: payload.published, coverImageUrl: payload.coverImageUrl, citySlug: payload.citySlug,
              metaDescription: payload.metaDescription,
            }),
          })
        : await fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
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

        <div>
          <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">
            Meta description{' '}
            <span className="text-xs font-normal text-[color:var(--text-muted)]">
              (used in Google search snippet — max 160 chars, leave blank to use summary)
            </span>
          </label>
          <textarea
            rows={2}
            maxLength={160}
            value={form.metaDescription}
            onChange={set('metaDescription')}
            className={inputCls}
            placeholder="Concise search-result description, max 160 characters…"
          />
          <p className="text-xs text-[color:var(--text-faint)] mt-1 text-right">
            {form.metaDescription.length}/160
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">
              Cover image URL <span className="text-xs font-normal text-[color:var(--text-muted)]">(optional)</span>
            </label>
            <input type="url" value={form.coverImageUrl} onChange={set('coverImageUrl')} className={inputCls}
              placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">
              City <span className="text-xs font-normal text-[color:var(--text-muted)]">(optional — drives the &quot;homes for sale&quot; sidebar)</span>
            </label>
            <select
              value={form.citySlug}
              onChange={e => setForm(f => ({ ...f, citySlug: e.target.value }))}
              className={inputCls}
            >
              <option value="">None — general GTA content</option>
              {GTA_CITIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
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
