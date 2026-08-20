import { NextRequest, NextResponse } from 'next/server'
import { syncAll, syncIncremental } from '@/lib/mls/sync'

const SECRET = process.env.CRON_SECRET ?? ''

export const maxDuration = 300 // 5 min (Node runtime on VPS — no hard limit)

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  if (SECRET && auth !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const mode = searchParams.get('mode') ?? 'incremental'
  const sinceHours = Number(searchParams.get('hours') ?? '25')

  // Run in background — respond immediately so curl doesn't time out
  const logs: string[] = []
  const log = (msg: string) => { logs.push(msg); console.log(msg) }

  if (mode === 'full') {
    // Fire-and-forget — logs go to PM2 stdout
    setImmediate(() => syncAll(log).catch(console.error))
    return NextResponse.json({ started: true, mode: 'full' })
  }

  // Incremental: short enough to await
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)
  setImmediate(() => syncIncremental(since, log).catch(console.error))
  return NextResponse.json({ started: true, mode: 'incremental', since: since.toISOString() })
}
