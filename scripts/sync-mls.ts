/**
 * Standalone MLS sync — bypass Next.js API route.
 * Run: npx tsx scripts/sync-mls.ts [full|incremental]
 *
 * A full run walks every AMPRE page and takes hours. It checkpoints after each
 * page, so a crash resumes where it stopped rather than restarting from zero —
 * this script retries the whole pass until it completes.
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const MAX_ATTEMPTS = 50

const log = (msg: string) => console.log(`[${new Date().toISOString()}] ${msg}`)
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const MODES = ['full', 'incremental', 'sold'] as const
type Mode = typeof MODES[number]

// How far back to pull closed sales. The feed only holds ~2 years anyway.
const SOLD_YEARS = 2

async function main() {
  const arg = process.argv[2]
  const mode: Mode = (MODES as readonly string[]).includes(arg) ? arg as Mode : 'full'
  log(`Starting ${mode} sync...`)

  const { syncAll, syncIncremental, syncSold } = await import('../lib/mls/sync')

  if (mode === 'incremental') {
    const since = new Date(Date.now() - 25 * 60 * 60 * 1000)
    const total = await syncIncremental(since, log)
    log(`Done. ${total} listings updated.`)
    process.exit(0)
  }

  const since = new Date(Date.now() - SOLD_YEARS * 365 * 24 * 60 * 60 * 1000)
  const run = mode === 'sold'
    ? () => syncSold(since, log)
    : () => syncAll(log)

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const total = await run()
      log(`Done. ${total} listings synced.`)
      process.exit(0)
    } catch (err) {
      log(`Attempt ${attempt}/${MAX_ATTEMPTS} failed: ${String(err).slice(0, 200)}`)
      if (attempt === MAX_ATTEMPTS) {
        log('Giving up — max attempts reached.')
        process.exit(1)
      }
      await sleep(15_000)
      log('Resuming from checkpoint...')
    }
  }
}

main().catch(err => {
  log(`FATAL: ${err}`)
  process.exit(1)
})
