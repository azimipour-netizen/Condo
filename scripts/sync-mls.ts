/**
 * Standalone MLS sync — bypass Next.js API route.
 * Run: npx tsx scripts/sync-mls.ts [full|incremental]
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const mode = process.argv[2] === 'incremental' ? 'incremental' : 'full'
  console.log(`[${new Date().toISOString()}] Starting ${mode} sync...`)

  const { syncAll, syncIncremental } = await import('../lib/mls/sync')

  const log = (msg: string) => console.log(`[${new Date().toISOString()}] ${msg}`)

  try {
    if (mode === 'full') {
      const total = await syncAll(log)
      log(`Done. ${total} listings synced.`)
    } else {
      const since = new Date(Date.now() - 25 * 60 * 60 * 1000)
      const total = await syncIncremental(since, log)
      log(`Done. ${total} listings updated.`)
    }
    process.exit(0)
  } catch (err) {
    log(`ERROR: ${err}`)
    process.exit(1)
  }
}

main()
