'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

const PROPERTY_TYPES = [
  { value: 'detached', label: 'Detached' },
  { value: 'semi_detached', label: 'Semi-Detached' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'multiplex', label: 'Multiplex' },
  { value: 'vacant_land', label: 'Vacant Land' },
  { value: 'commercial', label: 'Commercial' },
]

const STATUS_OPTIONS = ['active', 'sold', 'terminated', 'expired', 'suspended'] as const

function Field({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">{label}</label>
      {children}
      {note && <p className="text-xs text-[color:var(--text-muted)] mt-1">{note}</p>}
    </div>
  )
}

const inputCls = "w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors"

interface PropertyImage {
  id: string
  url: string
  order: number
  alt: string | null
}

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
  latitude: number | null
  longitude: number | null
  images: PropertyImage[]
}

export default function EditPropertyPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'condo',
    transactionType: 'sale',
    status: 'active',
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
    latitude: '',
    longitude: '',
    featuresRaw: '',
  })

  const [images, setImages] = useState<PropertyImage[]>([])

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`)
      .then(r => r.json())
      .then(({ property: p }: { property: PropertyData }) => {
        setProperty(p)
        setForm({
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
          latitude: p.latitude ? String(p.latitude) : '',
          longitude: p.longitude ? String(p.longitude) : '',
          featuresRaw: p.features.join('\n'),
        })
        setImages(p.images)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load property.')
        setLoading(false)
      })
  }, [id])

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const body = {
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
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      features: form.featuresRaw.split('\n').map(s => s.trim()).filter(Boolean),
    }

    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Server error')
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = useCallback(async (files: FileList) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch(`/api/admin/properties/${id}/images`, { method: 'POST', body: fd })
        const { image } = await res.json()
        if (image) setImages(prev => [...prev, image])
      } catch { /* skip failed uploads */ }
    }
    setUploading(false)
  }, [id])

  async function deleteImage(imageId: string) {
    await fetch(`/api/admin/properties/${id}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId }),
    })
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  async function handleDeleteProperty() {
    if (!confirm('Delete this listing permanently? This cannot be undone.')) return
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
    router.push('/dashboard/properties')
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleImageUpload(e.dataTransfer.files)
  }

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto animate-pulse">
        <div className="h-7 bg-[color:var(--border)] rounded w-1/3 mb-8" />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-5 mb-4">
            <div className="h-4 bg-[color:var(--border)] rounded w-1/4 mb-4" />
            <div className="h-10 bg-[color:var(--border)] rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!property && !loading) {
    return <div className="p-8 text-sm text-[color:var(--text-muted)]">Property not found.</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Edit Listing</h1>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5">#{property?.listingId}</p>
        </div>
        <div className="flex gap-2">
          <a href={`/property/${id}`} target="_blank"
            className="px-4 py-2 border border-[color:var(--border)] text-sm rounded-xl hover:bg-[color:var(--bg-surface-2)] transition-colors text-[color:var(--foreground)]">
            View ↗
          </a>
          <button onClick={handleDeleteProperty}
            className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            Delete
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-4">Photos ({images.length})</h2>

        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-[color:var(--border)]">
                <Image src={img.url} alt={img.alt ?? `Photo ${idx + 1}`} fill className="object-cover" sizes="120px" />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">Cover</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[color:var(--border)] rounded-xl p-6 text-center cursor-pointer hover:border-[color:var(--accent)] transition-colors"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={e => e.target.files && handleImageUpload(e.target.files)}
          />
          {uploading ? (
            <p className="text-sm text-[color:var(--text-muted)]">Uploading…</p>
          ) : (
            <>
              <p className="text-sm text-[color:var(--text-muted)]">Drag & drop or click to upload photos</p>
              <p className="text-xs text-[color:var(--text-faint)] mt-1">JPEG, PNG, WebP, AVIF · max 10 MB each</p>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic */}
        <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Basic Information</h2>

          <Field label="Listing Title *">
            <input type="text" required value={form.title} onChange={set('title')} className={inputCls} />
          </Field>

          <Field label="Description *">
            <textarea required rows={5} value={form.description} onChange={set('description')} className={inputCls} />
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

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (CAD) *">
              <input type="number" required min={1} value={form.price} onChange={set('price')} className={inputCls} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={set('status')} className={inputCls}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </Field>
          </div>
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

          <Field label="Features" note="One per line">
            <textarea rows={4} value={form.featuresRaw} onChange={set('featuresRaw')} className={inputCls}
              placeholder={"Hardwood floors\nStainless steel appliances"} />
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

          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude" note="e.g. 43.6532">
              <input type="number" step="any" value={form.latitude} onChange={set('latitude')} className={inputCls} placeholder="Optional" />
            </Field>
            <Field label="Longitude" note="e.g. -79.3832">
              <input type="number" step="any" value={form.longitude} onChange={set('longitude')} className={inputCls} placeholder="Optional" />
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
        {success && <p className="text-sm text-green-600 dark:text-green-400">Saved successfully.</p>}

        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/dashboard/properties')}
            className="px-5 py-2.5 border border-[color:var(--border)] text-sm rounded-xl hover:bg-[color:var(--bg-surface-2)] transition-colors text-[color:var(--foreground)]">
            ← Back
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
