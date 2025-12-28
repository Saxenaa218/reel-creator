/**
 * Type augmentation for NextAuth.js
 * Extends the default Session interface to include custom user fields
 * such as profile completion status and username
 */
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isProfileComplete?: boolean
      username?: string | null
    }
  }
}
