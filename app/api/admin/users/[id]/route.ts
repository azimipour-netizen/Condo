import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Deleting a user is destructive and irreversible, so keep it to admins —
  // agents can toggle document access but not remove accounts.
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  if (id === session.user.id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = await (db as any).user.findUnique({
      where:  { id },
      select: { id: true, email: true, role: true },
    })
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Guard against removing the last admin and locking everyone out.
    if (target.role === 'admin') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admins = await (db as any).user.count({ where: { role: 'admin' } })
      if (admins <= 1) {
        return NextResponse.json({ error: 'Cannot delete the last admin' }, { status: 400 })
      }
    }

    // BlogPost.author is a required relation with no cascade, so Prisma restricts
    // the delete. Say so plainly instead of returning a generic 500.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts = await (db as any).blogPost.count({ where: { authorId: id } })
    if (posts > 0) {
      return NextResponse.json(
        { error: `This user wrote ${posts} blog post${posts === 1 ? '' : 's'}. Reassign or delete them first.` },
        { status: 409 },
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db as any).user.delete({ where: { id } })
    return NextResponse.json({ ok: true, email: target.email })
  } catch (err) {
    console.error('[admin/users/delete]', err)
    if (String(err).includes('P2003')) {
      return NextResponse.json(
        { error: 'This user still has linked records that must be removed first.' },
        { status: 409 },
      )
    }
    return NextResponse.json({ error: 'Could not delete user' }, { status: 500 })
  }
}
