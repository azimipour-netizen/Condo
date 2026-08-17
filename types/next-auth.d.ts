import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'consumer' | 'agent' | 'admin'
      documentsUnlocked: boolean
    } & DefaultSession['user']
  }

  interface User {
    role?: 'consumer' | 'agent' | 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: 'consumer' | 'agent' | 'admin'
    documentsUnlocked?: boolean
  }
}
