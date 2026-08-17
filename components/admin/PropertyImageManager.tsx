'use client'

import { useState, useRef, useCallback } from 'react'
import NextImage from 'next/image'

interface Image { id: string; url: string; order: number; alt: string | null }

interface Props {
  propertyId: string
  initialImages?: Image[]
}

export default function PropertyImageManager({ propertyId, initialImages = [] }: Props) {
  const [images, setImages] = useState<Image[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (files: FileList) => {
    setUploading(true)
    setError('')
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch(`/api/admin/properties/${propertyId}/images`, { method: 'POST', body: fd })
        const data = await res.json()
        if (res.ok) {
          setImages(prev => [...prev, data.image])
        } else {
          setError(data.error ?? 'Upload failed')
        }
      } catch {
        setError('Network error')
      }
    }
    setUploading(false)
  }, [propertyId])

  async function deleteImage(imageId: string) {
    const res = await fetch(`/api/admin/properties/${propertyId}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId }),
    })
    if (res.ok) setImages(prev => prev.filter(img => img.id !== imageId))
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) upload(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[color:var(--border)] rounded-2xl p-8 text-center cursor-pointer hover:border-[color:var(--accent)] transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={e => e.target.files && upload(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-[color:var(--muted)]">
            <div className="w-4 h-4 border-2 border-[color:var(--accent)]/30 border-t-[color:var(--accent)] rounded-full animate-spin" />
            Uploading…
          </div>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-2 text-[color:var(--muted)]">
              <path d="M16 4v16M8 12l8-8 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 24v2a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <p className="text-sm font-medium text-[color:var(--foreground)]">Click or drag photos here</p>
            <p className="text-xs text-[color:var(--muted)] mt-1">JPEG, PNG, WebP · max 10 MB each</p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-[color:var(--bg-surface-2)]">
              <NextImage src={img.url} alt={img.alt ?? `Photo ${i + 1}`} fill className="object-cover" sizes="120px" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-[color:var(--accent)] text-white px-1.5 py-0.5 rounded-md">
                  Cover
                </span>
              )}
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
