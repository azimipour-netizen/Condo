const KEY = 'recently_viewed'
const MAX = 10

export interface RecentEntry {
  id: string
  title: string
  price: number
  thumbnail: string | null
  propertyType: string
  city: string
  bedrooms: number
  viewedAt: number
}

export function recordView(entry: Omit<RecentEntry, 'viewedAt'>) {
  if (typeof window === 'undefined') return
  try {
    const prev = getRecent()
    const next = [
      { ...entry, viewedAt: Date.now() },
      ...prev.filter(e => e.id !== entry.id),
    ].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
}

export function getRecent(): RecentEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as RecentEntry[]
  } catch {
    return []
  }
}
