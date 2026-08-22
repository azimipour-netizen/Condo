/**
 * Remove accounts that never verified their email address.
 *
 * Dry-run by default. Pass --confirm to actually delete.
 *   npx tsx scripts/purge-unverified.ts                # report only
 *   npx tsx scripts/purge-unverified.ts --confirm      # delete
 *
 * Accounts newer than GRACE_HOURS are kept so someone who signed up minutes ago
 * and has not opened their inbox yet is not wiped out.
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const GRACE_HOURS = 48
const CONFIRM = process.argv.includes('--confirm')

async function main() {
  const { db } = await import('../lib/db')
  const cutoff = new Date(Date.now() - GRACE_HOURS * 60 * 60 * 1000)

  const where = {
    emailVerified: null,
    createdAt: { lt: cutoff },
    // Never touch staff accounts, and keep anyone who signed in via OAuth
    // (those users are verified by the provider, not by our email link).
    role: 'consumer' as const,
    accounts: { none: {} },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const victims = await (db as any).user.findMany({
    where,
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totals = await (db as any).user.groupBy({
    by: ['role'],
    _count: { _all: true },
  }).catch(() => null)

  console.log(`\nUnverified consumer accounts older than ${GRACE_HOURS}h: ${victims.length}`)
  if (totals) console.log('All users by role:', JSON.stringify(totals))

  if (victims.length === 0) {
    console.log('Nothing to remove.\n')
    process.exit(0)
  }

  // Show the email-domain spread — spam usually clusters on a few domains.
  const byDomain = new Map<string, number>()
  for (const v of victims) {
    const d = String(v.email).split('@')[1] ?? '?'
    byDomain.set(d, (byDomain.get(d) ?? 0) + 1)
  }
  const top = [...byDomain.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
  console.log('\nTop email domains:')
  for (const [d, n] of top) console.log(`  ${String(n).padStart(5)}  ${d}`)

  console.log('\n20 most recent:')
  for (const v of victims.slice(0, 20)) {
    console.log(`  ${new Date(v.createdAt).toISOString().slice(0, 16)}  ${v.email}  ${JSON.stringify(v.name)}`)
  }

  if (!CONFIRM) {
    console.log(`\nDRY RUN — nothing deleted. Re-run with --confirm to remove these ${victims.length} accounts.\n`)
    process.exit(0)
  }

  const ids = victims.map((v: { id: string }) => v.id)
  const res = await (db as any).user.deleteMany({ where: { id: { in: ids } } })
  console.log(`\nDeleted ${res.count} accounts.\n`)
  process.exit(0)
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
