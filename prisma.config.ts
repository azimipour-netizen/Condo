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
    // NOTE: migrations must NOT run through Neon's -pooler endpoint. PgBouncer
    // breaks Postgres advisory locks, so `prisma migrate deploy` hangs and fails
    // with P1002. Run migrations with the unpooled host, e.g.
    //   DATABASE_URL="${DATABASE_URL/-pooler./.}" npx prisma migrate deploy
    // (Prisma 7's config accepts only `url` and `shadowDatabaseUrl` here.)
    url: process.env.DATABASE_URL ?? '',
  },
})
