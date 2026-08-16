import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { notify } from '@/lib/notify'

const RegisterSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = RegisterSchema.parse(body)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (db as any).user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db as any).user.create({ data: { name, email, passwordHash } })

    notify(`👤 <b>New User Registered</b>\n${name} &lt;${email}&gt;`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
