'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PROPERTY_TYPES = [
  { value: 'detached', label: 'Detached' },
  { value: 'semi_detached', label: 'Semi-Detached' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'multiplex', label: 'Multiplex' },
  { value: 'vacant_land', label: 'Vacant Land' },
  { value: 'commercial', label: 'Commercial' },
]

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

export default function NewPropertyPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'condo',
    transactionType: 'sale',
    bedrooms: '2',
    bathroomsTotal: '2',
    parkingSpaces: '1',
    sqft: '',
    yearBuilt: '',
    maintenanceFee: '',
    taxes: '',
    address: '',
    neighbourhood: '',
    city: 'Toronto',
    province: 'ON',
    postalCode: '',
    virtualTourUrl: '',
    featuresRaw: '',
  })

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const body = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      propertyType: form.propertyType,
      transactionType: form.transactionType,
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
      features: form.featuresRaw.split('\n').map(s => s.trim()).filter(Boolean),
    }

    try {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Server error')
      } else {
        router.push(`/dashboard/properties/${data.property.id}/edit`)
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Add New Listing</h1>
        <p className="text-sm text-[color:var(--muted)] mt-1">Create a manual property listing.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Basic Information</h2>

          <Field label="Listing Title *">
            <input type="text" required value={form.title} onChange={set('title')} className={inputCls}
              placeholder="3-Bed Condo in Yorkville with Stunning Views" />
          </Field>

          <Field label="Description *">
            <textarea required rows={5} value={form.description} onChange={set('description')} className={inputCls}
              placeholder="Describe the property..." />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Transaction Type">
              <select value={form.transactionType} onChange={set('transactionType')} className={inputCls}>
                <option value="sale">For Sale</option>
                <option value="lease">For Lease</option>
              </select>
            </Field>
            <Field label="Property Type">
              <select value={form.propertyType} onChange={set('propertyType')} className={inputCls}>
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Price (CAD) *">
            <input type="number" required min={1} value={form.price} onChange={set('price')} className={inputCls}
              placeholder="850000" />
          </Field>
        </div>

        {/* Details */}
        <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Property Details</h2>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Bedrooms *">
              <input type="number" required min={0} value={form.bedrooms} onChange={set('bedrooms')} className={inputCls} />
            </Field>
            <Field label="Bathrooms *">
              <input type="number" required min={0} step={0.5} value={form.bathroomsTotal} onChange={set('bathroomsTotal')} className={inputCls} />
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

          <Field label="Annual Property Taxes">
            <input type="number" min={0} value={form.taxes} onChange={set('taxes')} className={inputCls} placeholder="Optional" />
          </Field>

          <Field label="Features" note="One per line — e.g. Hardwood floors">
            <textarea rows={4} value={form.featuresRaw} onChange={set('featuresRaw')} className={inputCls}
              placeholder={"Hardwood floors\nStainless steel appliances\nRooftop terrace"} />
          </Field>
        </div>

        {/* Location */}
        <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Location</h2>

          <Field label="Street Address" note="Leave blank to show approximate location only.">
            <input type="text" value={form.address} onChange={set('address')} className={inputCls} placeholder="123 King St W" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Neighbourhood">
              <input type="text" value={form.neighbourhood} onChange={set('neighbourhood')} className={inputCls} placeholder="King West" />
            </Field>
            <Field label="Postal Code">
              <input type="text" value={form.postalCode} onChange={set('postalCode')} className={inputCls} placeholder="M5V 1A1" />
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
          <Field label="Virtual Tour URL" note="YouTube, Matterport, or Vimeo URL.">
            <input type="url" value={form.virtualTourUrl} onChange={set('virtualTourUrl')} className={inputCls}
              placeholder="https://youtube.com/watch?v=..." />
          </Field>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-[color:var(--border)] text-sm rounded-xl hover:bg-[color:var(--bg-surface-2)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition"
          >
            {saving ? 'Creating…' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}
