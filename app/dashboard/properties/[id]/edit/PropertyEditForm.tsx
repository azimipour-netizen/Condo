'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PropertyImageManager from '@/components/admin/PropertyImageManager'

const PROPERTY_TYPES = [
  { value: 'detached', label: 'Detached' },
  { value: 'semi_detached', label: 'Semi-Detached' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'multiplex', label: 'Multiplex' },
  { value: 'vacant_land', label: 'Vacant Land' },
  { value: 'commercial', label: 'Commercial' },
]

const STATUS_OPTIONS = ['active', 'sold', 'terminated', 'expired', 'suspended']

function Field({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">{label}</label>
      {children}
      {note && <p className="text-xs text-[color:var(--muted)] mt-1">{note}</p>}
    </div>
  )
}

const inputCls = "w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors"

interface PropertyData {
  id: string
  listingId: string
  title: string
  description: string
  price: number
  propertyType: string
  transactionType: string
  status: string
  bedrooms: number
  bathroomsTotal: number
  parkingSpaces: number
  sqft: number | null
  yearBuilt: number | null
  maintenanceFee: number | null
  taxes: number | null
  address: string | null
  neighbourhood: string | null
  city: string
  province: string
  postalCode: string | null
  virtualTourUrl: string | null
  features: string[]
  images: { id: string; url: string; order: number; alt: string | null }[]
}

export default function PropertyEditForm({ property: p }: { property: PropertyData }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    title: p.title,
    description: p.description,
    price: String(p.price),
    propertyType: p.propertyType,
    transactionType: p.transactionType,
    status: p.status,
    bedrooms: String(p.bedrooms),
    bathroomsTotal: String(p.bathroomsTotal),
    parkingSpaces: String(p.parkingSpaces),
    sqft: p.sqft ? String(p.sqft) : '',
    yearBuilt: p.yearBuilt ? String(p.yearBuilt) : '',
    maintenanceFee: p.maintenanceFee ? String(p.maintenanceFee) : '',
    taxes: p.taxes ? String(p.taxes) : '',
    address: p.address ?? '',
    neighbourhood: p.neighbourhood ?? '',
    city: p.city,
    province: p.province,
    postalCode: p.postalCode ?? '',
    virtualTourUrl: p.virtualTourUrl ?? '',
    featuresRaw: p.features.join('\n'),
  })

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const body = {
      status: form.status,
      price: Number(form.price),
      virtualTourUrl: form.virtualTourUrl || null,
    }

    // Full update via a dedicated endpoint
    try {
      const res = await fetch(`/api/admin/properties/${p.id}/full`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          propertyType: form.propertyType,
          transactionType: form.transactionType,
          status: form.status,
          bedrooms: Number(form.bedrooms),
          bathroomsTotal: Number(form.bathroomsTotal),
          parkingSpaces: Number(form.parkingSpaces),
          sqft: form.sqft ? Number(form.sqft) : null,
          yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : null,
          maintenanceFee: form.maintenanceFee ? Number(form.maintenanceFee) : null,
          taxes: form.taxes ? Number(form.taxes) : null,
          address: form.address || null,
          neighbourhood: form.neighbourhood || null,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode || null,
          virtualTourUrl: form.virtualTourUrl || null,
          features: form.featuresRaw.split('\n').map((s: string) => s.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Server error')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photos */}
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Photos</h2>
        <PropertyImageManager propertyId={p.id} initialImages={p.images} />
      </div>

      {/* Basic info */}
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Basic Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select value={form.status} onChange={set('status')} className={inputCls}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </Field>
          <Field label="Transaction Type">
            <select value={form.transactionType} onChange={set('transactionType')} className={inputCls}>
              <option value="sale">For Sale</option>
              <option value="lease">For Lease</option>
            </select>
          </Field>
        </div>

        <Field label="Title *">
          <input type="text" required value={form.title} onChange={set('title')} className={inputCls} />
        </Field>

        <Field label="Description *">
          <textarea required rows={6} value={form.description} onChange={set('description')} className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Property Type">
            <select value={form.propertyType} onChange={set('propertyType')} className={inputCls}>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Price (CAD) *">
            <input type="number" required min={1} value={form.price} onChange={set('price')} className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Details */}
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Property Details</h2>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Bedrooms">
            <input type="number" min={0} value={form.bedrooms} onChange={set('bedrooms')} className={inputCls} />
          </Field>
          <Field label="Bathrooms">
            <input type="number" min={0} step={0.5} value={form.bathroomsTotal} onChange={set('bathroomsTotal')} className={inputCls} />
          </Field>
          <Field label="Parking">
            <input type="number" min={0} value={form.parkingSpaces} onChange={set('parkingSpaces')} className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Sqft">
            <input type="number" min={1} value={form.sqft} onChange={set('sqft')} className={inputCls} placeholder="Optional" />
          </Field>
          <Field label="Year Built">
            <input type="number" min={1800} max={2030} value={form.yearBuilt} onChange={set('yearBuilt')} className={inputCls} placeholder="Optional" />
          </Field>
          <Field label="Maint. Fee/mo">
            <input type="number" min={0} value={form.maintenanceFee} onChange={set('maintenanceFee')} className={inputCls} placeholder="Optional" />
          </Field>
        </div>

        <Field label="Annual Taxes">
          <input type="number" min={0} value={form.taxes} onChange={set('taxes')} className={inputCls} placeholder="Optional" />
        </Field>

        <Field label="Features" note="One per line">
          <textarea rows={4} value={form.featuresRaw} onChange={set('featuresRaw')} className={inputCls} />
        </Field>
      </div>

      {/* Location */}
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Location</h2>

        <Field label="Street Address">
          <input type="text" value={form.address} onChange={set('address')} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Neighbourhood">
            <input type="text" value={form.neighbourhood} onChange={set('neighbourhood')} className={inputCls} />
          </Field>
          <Field label="Postal Code">
            <input type="text" value={form.postalCode} onChange={set('postalCode')} className={inputCls} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City">
            <input type="text" value={form.city} onChange={set('city')} className={inputCls} />
          </Field>
          <Field label="Province">
            <input type="text" value={form.province} onChange={set('province')} className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Media */}
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Media</h2>
        <Field label="Virtual Tour URL">
          <input type="url" value={form.virtualTourUrl} onChange={set('virtualTourUrl')} className={inputCls}
            placeholder="https://youtube.com/watch?v=..." />
        </Field>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <Link href="/dashboard/properties"
          className="px-5 py-2.5 border border-[color:var(--border)] text-sm rounded-xl hover:bg-[color:var(--bg-surface-2)] transition-colors">
          Back
        </Link>
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition">
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
        <Link href={`/property/${p.id}`} target="_blank"
          className="px-4 py-2.5 border border-[color:var(--border)] text-sm rounded-xl hover:bg-[color:var(--bg-surface-2)] transition-colors whitespace-nowrap">
          View ↗
        </Link>
      </div>
    </form>
  )
}
