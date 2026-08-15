import { Pool } from 'pg'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.join(__dirname, '..', '.env') })
config({ path: path.join(__dirname, '..', '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const { rows } = await pool.query('SELECT id, email, role FROM "User"')
console.log(rows)
await pool.end()
