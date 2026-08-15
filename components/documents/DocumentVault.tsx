'use client'

import { useState, useEffect, useRef } from 'react'

export interface DocCategory {
  value: string
  label: string
  accept?: string
}

export interface VaultDoc {
  id: string
  side: string
  category: string
  label: string
  filename: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  uploader?: { name: string | null; email: string }
  receiver?: { name: string | null; email: string } | null
}

interface Props {
  side: 'buyer' | 'agent'
  categories: DocCategory[]
  title: string
  description: string
  documents: VaultDoc[]
  canUpload: boolean
  onUploaded: (doc: VaultDoc) => void
  onDeleted: (id: string) => void
}

function fileIcon(mime: string) {
  if (mime.startsWith('image/')) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="5.5" cy="5.5" r="1.5" fill="currentColor"/><path d="M1 11L5 7L8 10L11 7L15 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2H10L13 5V14H3V2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M10 2V5H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M5 8H11M5 10.5H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  )
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function DocumentVault({ side, categories, title, description, documents, canUpload, onUploaded, onDeleted }: Props) {
  const [showUpload, setShowUpload] = useState(false)
  const [category, setCategory] = useState(categories[0]?.value ?? '')
  const [customLabel, setCustomLabel] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCustomLabel(categories.find(c => c.value === category)?.label ?? '')
  }, [category, categories])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || uploading) return
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('category', category)
      fd.append('label', customLabel || categories.find(c => c.value === category)?.label || category)
      fd.append('side', side)
      const res = await fetch('/api/documents/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Upload failed'); return }
      onUploaded(json.document)
      setFile(null)
      setShowUpload(false)
      if (fileRef.current) fileRef.current.value = ''
    } catch {
      setError('Upload failed. Check your connection.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      onDeleted(id)
    } finally {
      setDeleting(null)
    }
  }

  const selectedCategory = categories.find(c => c.value === category)

  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[color:var(--border)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[color:var(--foreground)]">{title}</h3>
          <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{description}</p>
        </div>
        {canUpload && (
          <button
            onClick={() => setShowUpload(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white rounded-lg transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1V10M1 5.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
            Upload
          </button>
        )}
      </div>

      {/* Upload form */}
      {showUpload && (
        <form onSubmit={handleUpload} className="px-5 py-4 border-b border-[color:var(--border)] bg-[color:var(--bg-surface-2)]">
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-[color:var(--foreground)] mb-1 block">Document type</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors"
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[color:var(--foreground)] mb-1 block">Label (optional)</label>
              <input
                value={customLabel}
                onChange={e => setCustomLabel(e.target.value)}
                placeholder="e.g. TD Bank — Oct 2024"
                className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none focus:border-[color:var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors mb-3 ${file ? 'border-[color:var(--accent)]/50 bg-[color:var(--accent)]/5' : 'border-[color:var(--border)] hover:border-[color:var(--accent)]/40'}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept={selectedCategory?.accept ?? '.pdf,.jpg,.jpeg,.png,.doc,.docx'}
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-sm text-[color:var(--foreground)]">
                <span className="text-[color:var(--accent)]">{fileIcon(file.type)}</span>
                <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                <span className="text-[color:var(--text-faint)] text-xs">({formatSize(file.size)})</span>
              </div>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 text-[color:var(--text-faint)]"><path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 16.5V18.5C3 19.6 3.9 20.5 5 20.5H19C20.1 20.5 21 19.6 21 18.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <p className="text-sm text-[color:var(--text-muted)]">Click to choose a file</p>
                <p className="text-xs text-[color:var(--text-faint)] mt-1">PDF, JPG, PNG, DOC · max 10 MB</p>
              </>
            )}
          </div>

          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setShowUpload(false); setFile(null); setError('') }}
              className="px-3 py-1.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!file || uploading}
              className="px-4 py-1.5 text-xs font-semibold bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
              {uploading ? 'Uploading…' : 'Upload document'}
            </button>
          </div>
        </form>
      )}

      {/* Document list */}
      {documents.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-3 text-[color:var(--text-faint)]"><path d="M8 4H22L28 10V28H8V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M22 4V10H28" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 16H20M12 20H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <p className="text-sm text-[color:var(--text-muted)]">No documents yet</p>
          {canUpload && <p className="text-xs text-[color:var(--text-faint)] mt-1">Upload your first document above.</p>}
        </div>
      ) : (
        <ul className="divide-y divide-[color:var(--border)]">
          {documents.map(doc => (
            <li key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[color:var(--bg-surface-2)] transition-colors group">
              <span className="text-[color:var(--text-muted)] shrink-0">{fileIcon(doc.mimeType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[color:var(--foreground)] truncate">{doc.label}</p>
                <p className="text-xs text-[color:var(--text-faint)] truncate">
                  {doc.filename} · {formatSize(doc.fileSize)} · {timeAgo(doc.uploadedAt)}
                  {doc.uploader && <span className="ml-1">by {doc.uploader.name ?? doc.uploader.email.split('@')[0]}</span>}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={`/api/documents/${doc.id}/download`} target="_blank" rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface)] transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7 1H12V6M12 1L6 7M2 4H1V12H9V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <button onClick={() => handleDelete(doc.id)} disabled={deleting === doc.id}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[color:var(--text-muted)] hover:text-red-400 hover:bg-[color:var(--bg-surface)] transition-colors disabled:opacity-40">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3H11M5 3V2H8V3M4 3V11H9V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
