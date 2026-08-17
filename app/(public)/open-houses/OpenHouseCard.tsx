'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const inputCls = "w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--text-faint)]"

const TYPE_LABELS: Record<string, string> = {
  detached: 'Detached', semi_detached: 'Semi-Detached', townhouse: 'Townhouse',
  condo: 'Condo', multiplex: 'Multiplex', vacant_land: 'Land', commercial: 'Commercial',
}

interface Props {
  openHouseId: string
  dateRange: string
  notes: string | null
  registrationCount: number
  property: {
    id: string
    title: string
    address: string | null
    neighbourhood: string | null
    city: string
    price: number
    bedrooms: number
    bathroomsTotal: number
    propertyType: string
    transactionType: string
    images: { url: string }[]
  }
}

export default function OpenHouseCard({ openHouseId, dateRange, notes, registrationCount, property: p }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error' | 'dup'>('idle')

  function setField(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function register(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`/api/open-houses/${openHouseId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.status === 409) { setStatus('dup'); return }
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const thumb = p.images[0]?.url

  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <Link href={`/property/${p.id}`} className="sm:w-48 shrink-0 bg-[color:var(--bg-surface-2)] aspect-video sm:aspect-auto relative block">
          {thumb ? (
            <Image src={thumb} alt={p.title} fill sizes="192px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[color:var(--text-faint)] text-3xl">⊠</div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-xs font-semibold text-[color:var(--accent)] uppercase tracking-wide mb-1">{dateRange}</p>
              <Link href={`/property/${p.id}`}>
                <h2 className="text-base font-semibold text-[color:var(--foreground)] hover:text-[color:var(--accent)] transition-colors leading-snug">
                  {p.title}
                </h2>
              </Link>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
                {p.neighbourhood ?? p.city} · {TYPE_LABELS[p.propertyType] ?? p.propertyType} · {p.bedrooms}bd {Number(p.bathroomsTotal)}ba
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-[color:var(--foreground)] tabular-nums">
                ${Number(p.price).toLocaleString()}
              </p>
              <p className="text-xs text-[color:var(--text-muted)] capitalize">{p.transactionType}</p>
            </div>
          </div>

          {notes && <p className="text-xs text-[color:var(--text-muted)] mb-3 italic">{notes}</p>}

          <div className="flex items-center gap-3">
            {status === 'done' ? (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ You&apos;re registered!</span>
            ) : (
              <button
                onClick={() => setShowForm(s => !s)}
                className="px-4 py-1.5 bg-[color:var(--accent)] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition"
              >
                {showForm ? 'Cancel' : 'RSVP'}
              </button>
            )}
            <span className="text-xs text-[color:var(--text-muted)]">
              {registrationCount} {registrationCount === 1 ? 'person' : 'people'} registered
            </span>
            <Link href={`/property/${p.id}`} className="text-xs text-[color:var(--text-muted)] hover:underline ml-auto">
              View listing ↗
            </Link>
          </div>

          {showForm && status !== 'done' && (
            <form onSubmit={register} className="mt-4 border-t border-[color:var(--border)] pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1">Name *</label>
                  <input type="text" required value={form.name} onChange={setField('name')} className={inputCls} placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1">Email *</label>
                  <input type="email" required value={form.email} onChange={setField('email')} className={inputCls} placeholder="jane@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={setField('phone')} className={inputCls} placeholder="416-555-0100" />
              </div>
              {status === 'dup' && <p className="text-xs text-amber-600 dark:text-amber-400">Already registered with this email.</p>}
              {status === 'error' && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
              <button type="submit" disabled={status === 'sending'}
                className="px-4 py-2 bg-[color:var(--accent)] text-white text-xs font-semibold rounded-lg hover:opacity-90 disabled:opacity-60 transition">
                {status === 'sending' ? 'Registering…' : 'Confirm RSVP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
