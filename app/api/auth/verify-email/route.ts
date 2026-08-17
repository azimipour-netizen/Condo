import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/verify-email?error=missing', req.url))

  const record = await (db as any).emailVerificationToken.findUnique({ where: { token } })
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.redirect(new URL('/verify-email?error=expired', req.url))
  }

  await (db as any).user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  })
  await (db as any).emailVerificationToken.delete({ where: { id: record.id } })

  return NextResponse.redirect(new URL('/verify-email?success=1', req.url))
}
