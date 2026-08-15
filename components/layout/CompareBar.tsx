'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'compareIds'

function getIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export default function CompareBar() {
  const [ids, setIds] = useState<string[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const current = getIds()
      setIds(current)
      setVisible(current.length > 0)
    }
    update()
    window.addEventListener('compare-updated', update)
    return () => window.removeEventListener('compare-updated', update)
  }, [])

  function remove(id: string) {
    const next = ids.filter(x => x !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('compare-updated'))
  }

  function clear() {
    localStorage.setItem(STORAGE_KEY, '[]')
    window.dispatchEvent(new Event('compare-updated'))
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[color:var(--border)] bg-[color:var(--bg-surface)]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-[color:var(--text-muted)] shrink-0">
            Comparing {ids.length} {ids.length === 1 ? 'property' : 'properties'}
          </span>
          <div className="flex gap-2 overflow-x-auto">
            {ids.map(id => (
              <span
                key={id}
                className="shrink-0 flex items-center gap-1 px-2 py-0.5 text-xs bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)]"
              >
                <span className="font-mono">{id}</span>
                <button
                  onClick={() => remove(id)}
                  className="ml-0.5 text-[color:var(--text-faint)] hover:text-[color:var(--foreground)] transition-colors"
                  aria-label={`Remove ${id}`}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors px-2 py-1"
          >
            Clear
          </button>
          <Link
            href={`/compare?ids=${ids.join(',')}`}
            className={[
              'px-4 py-2 text-xs font-semibold rounded-xl transition-colors',
              ids.length >= 2
                ? 'bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white'
                : 'bg-[color:var(--bg-surface-2)] text-[color:var(--text-faint)] cursor-not-allowed pointer-events-none',
            ].join(' ')}
          >
            Compare{ids.length >= 2 ? '' : ' (need 2+)'}
          </Link>
        </div>
      </div>
    </div>
  )
}
