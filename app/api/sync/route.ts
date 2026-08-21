import { NextRequest, NextResponse } from 'next/server'
import { appendFileSync } from 'fs'
import { syncAll, syncIncremental } from '@/lib/mls/sync'

const SECRET = process.env.CRON_SECRET ?? ''
const LOG_FILE = '/home/ubuntu/sync.log'

export const maxDuration = 300

function fileLog(msg: string) {
  const line = `${new Date().toISOString()} ${msg}\n`
  process.stdout.write(line)
  try { appendFileSync(LOG_FILE, line) } catch {}
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  if (SECRET && auth !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const mode = searchParams.get('mode') ?? 'incremental'
  const sinceHours = Number(searchParams.get('hours') ?? '25')

  if (mode === 'full') {
    setImmediate(() => syncAll(fileLog).catch(err => fileLog(`[sync] ERROR: ${err}`)))
    return NextResponse.json({ started: true, mode: 'full' })
  }

  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)
  setImmediate(() => syncIncremental(since, fileLog).catch(err => fileLog(`[sync] ERROR: ${err}`)))
  return NextResponse.json({ started: true, mode: 'incremental', since: since.toISOString() })
}
