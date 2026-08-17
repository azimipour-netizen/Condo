import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { z } from 'zod'

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db as Parameters<typeof PrismaAdapter>[0]),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await (db as any).user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user || !user.passwordHash) return null

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!ok) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as { role?: 'consumer' | 'agent' | 'admin' }).role
      }
      // Re-fetch role from DB so promotions take effect without re-login
      if (token.id && !user) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dbUser = await (db as any).user.findUnique({
            where: { id: token.id as string },
            select: { role: true, documentsUnlocked: true },
          })
          if (dbUser) {
            token.role = dbUser.role
            token.documentsUnlocked = dbUser.documentsUnlocked
          }
        } catch {}
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = (token.role as 'consumer' | 'agent' | 'admin' | undefined) ?? 'consumer'
        session.user.documentsUnlocked = Boolean(token.documentsUnlocked)
      }
      return session
    },
  },
})
