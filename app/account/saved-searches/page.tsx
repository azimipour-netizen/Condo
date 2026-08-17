import { auth } from '@/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import SavedSearchList from './SavedSearchList'

export const metadata = { title: 'Saved Searches' }

async function getSavedSearches(userId: string) {
  try {
    const searches = await (db as any).savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, filters: true, alertsEnabled: true, createdAt: true },
    })
    return searches.map((s: any) => ({ ...s, createdAt: s.createdAt.toISOString() }))
  } catch {
    return []
  }
}

export default async function SavedSearchesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/account/saved-searches')

  const searches = await getSavedSearches(session.user.id)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Saved Searches</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">
          {searches.length === 0
            ? 'Save any property search from the main page'
            : `${searches.length} saved search${searches.length !== 1 ? 'es' : ''}`}
        </p>
      </div>

      <SavedSearchList initial={searches} />
    </div>
  )
}
