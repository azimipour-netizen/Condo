import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// Load .env since Prisma CLI doesn't inject it before evaluating this config
config({ path: path.join(__dirname, '.env') })
// Also try .env.local (Next.js convention)
config({ path: path.join(__dirname, '.env.local'), override: false })

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL ?? '',
    // Migrations need a direct connection: Neon's -pooler endpoint is PgBouncer,
    // and Postgres advisory locks do not survive it, so `migrate deploy` fails
    // with P1002 waiting for a lock it can never take. Falls back to stripping
    // "-pooler" from DATABASE_URL when DIRECT_URL is not set.
    directUrl:
      process.env.DIRECT_URL ??
      (process.env.DATABASE_URL ?? '').replace('-pooler.', '.'),
  },
})
