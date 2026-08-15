'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface SavedCtx {
  savedIds: Set<string>
  toggle: (propertyId: string) => Promise<void>
  isSaved: (propertyId: string) => boolean
}

const Ctx = createContext<SavedCtx>({
  savedIds: new Set(),
  toggle: async () => {},
  isSaved: () => false,
})

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status !== 'authenticated') {
      setSavedIds(new Set())
      return
    }
    fetch('/api/properties/saved')
      .then(r => r.json())
      .then(data => setSavedIds(new Set(data.ids ?? [])))
      .catch(() => {})
  }, [status])

  const toggle = useCallback(async (propertyId: string) => {
    const isSaved = savedIds.has(propertyId)
    setSavedIds(prev => {
      const next = new Set(prev)
      if (isSaved) next.delete(propertyId)
      else next.add(propertyId)
      return next
    })
    try {
      const res = await fetch('/api/properties/saved', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      })
      if (!res.ok) {
        // revert on failure
        setSavedIds(prev => {
          const next = new Set(prev)
          if (isSaved) next.add(propertyId)
          else next.delete(propertyId)
          return next
        })
      }
    } catch {
      setSavedIds(prev => {
        const next = new Set(prev)
        if (isSaved) next.add(propertyId)
        else next.delete(propertyId)
        return next
      })
    }
  }, [savedIds])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  return <Ctx.Provider value={{ savedIds, toggle, isSaved }}>{children}</Ctx.Provider>
}

export function useSaved() {
  return useContext(Ctx)
}
