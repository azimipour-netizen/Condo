import { createRequire } from 'module'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter: new PrismaPg(pool) })

const job = await db.syncJob.findFirst({ orderBy: { startedAt: 'desc' } })
if (!job) {
  console.log('No sync jobs found in this database.')
} else {
  console.log('Most recent sync job:')
  console.log('  status:        ', job.status)
  console.log('  started:       ', job.startedAt)
  console.log('  completed:     ', job.completedAt ?? '(still running or did not finish)')
  console.log('  recordsSynced: ', job.recordsSynced)
  if (job.error) console.log('  error:         ', job.error)
}

await pool.end()
