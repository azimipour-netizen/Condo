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
  },
})
