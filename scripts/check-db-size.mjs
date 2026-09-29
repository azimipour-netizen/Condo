import { createRequire } from 'module'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  const dbSize = await db.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database())) AS size`
  console.log('Total DB size:', dbSize[0].size)

  const tables = await db.$queryRaw`
    SELECT relname AS table,
           pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
           pg_size_pretty(pg_relation_size(relid)) AS table_size,
           pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS indexes_size
    FROM pg_catalog.pg_statio_user_tables
    ORDER BY pg_total_relation_size(relid) DESC
    LIMIT 15
  `
  console.log('\nTop tables by size:')
  console.table(tables)

  const byStatus = await db.property.groupBy({ by: ['status'], _count: { id: true } })
  console.log('\nProperty rows by status:')
  console.table(byStatus.map(s => ({ status: s.status, count: s._count.id })))

  const totalProps = await db.property.count()
  const totalImages = await db.propertyImage.count()
  console.log(`\nTotal Property rows: ${totalProps}`)
  console.log(`Total PropertyImage rows: ${totalImages}`)
}

main().catch(e => console.error(e)).finally(() => pool.end())
