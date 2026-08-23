import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

const VALID_ROLES = ['consumer', 'agent', 'admin'] as const
type Role = typeof VALID_ROLES[number]

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only admins can grant or revoke roles — an agent granting themselves
  // admin would defeat the whole point of the restriction.
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const role = body.role as Role

  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = await (db as any).user.findUnique({
      where:  { id },
      select: { id: true, role: true },
    })
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Guard against demoting the last admin and locking everyone out —
    // including yourself, since a self-demotion is just as final.
    if (target.role === 'admin' && role !== 'admin') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admins = await (db as any).user.count({ where: { role: 'admin' } })
      if (admins <= 1) {
        return NextResponse.json({ error: 'Cannot remove the last admin' }, { status: 400 })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await (db as any).user.update({
      where: { id },
      data:  { role },
      select: { id: true, role: true },
    })
    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error('[admin/users/role]', err)
    return NextResponse.json({ error: 'Could not update role' }, { status: 500 })
  }
}
