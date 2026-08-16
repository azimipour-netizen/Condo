import { db } from '@/lib/db'
import { updateStatus } from './actions'
import ShowingsView from './ShowingsView'

export const metadata = { title: 'Showings' }

async function getShowings() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (db as any).showingRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { title: true, listingId: true } } },
      take: 100,
    })
  } catch {
    return []
  }
}

export default async function ShowingsPage() {
  const showings = await getShowings()
  return <ShowingsView showings={showings} updateStatus={updateStatus} />
}
