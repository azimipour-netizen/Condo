'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'compareIds'
const MAX_COMPARE = 4

function getIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function setIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event('compare-updated'))
}

export function useCompareIds() {
  const [ids, setIdsState] = useState<string[]>([])

  useEffect(() => {
    setIdsState(getIds())
    const handler = () => setIdsState(getIds())
    window.addEventListener('compare-updated', handler)
    return () => window.removeEventListener('compare-updated', handler)
  }, [])

  function toggle(id: string) {
    const current = getIds()
    if (current.includes(id)) {
      setIds(current.filter(x => x !== id))
    } else if (current.length < MAX_COMPARE) {
      setIds([...current, id])
    }
  }

  function remove(id: string) {
    setIds(getIds().filter(x => x !== id))
  }

  function clear() {
    setIds([])
  }

  return { ids, toggle, remove, clear }
}

interface Props {
  propertyId: string
}

export default function CompareButton({ propertyId }: Props) {
  const { ids, toggle } = useCompareIds()
  const added = ids.includes(propertyId)
  const full = ids.length >= MAX_COMPARE && !added

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={() => toggle(propertyId)}
        disabled={full}
        className={[
          'w-full flex items-center justify-center gap-2 border text-sm font-medium py-3 rounded-xl transition-colors',
          added
            ? 'border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:var(--accent)]/5'
            : full
            ? 'border-[color:var(--border)] text-[color:var(--text-faint)] cursor-not-allowed opacity-60'
            : 'border-[color:var(--border)] hover:border-[color:var(--accent)] text-[color:var(--foreground)]',
        ].join(' ')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          {added ? (
            <path d="M2 7H12M7 2V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M1 3H13M1 7H8M1 11H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
        {added ? 'Added to Comparison' : full ? 'Comparison Full (4)' : 'Add to Comparison'}
      </button>
      {added && ids.length >= 2 && (
        <Link
          href={`/compare?ids=${ids.join(',')}`}
          className="w-full text-center text-xs text-[color:var(--accent)] hover:underline py-1"
        >
          Compare {ids.length} properties →
        </Link>
      )}
    </div>
  )
}
