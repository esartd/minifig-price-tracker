import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { logOAuthEvent } from "@/lib/oauth-analytics"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as any),

  // Allow automatic account linking by email
  // This lets users sign in with Google even if they have an existing email/password account
  trustHost: true,

  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials Provider (email/password)
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          preferredCurrency: user.preferredCurrency,
          preferredCountryCode: user.preferredCountryCode,
          preferredRegion: user.preferredRegion,
          currencySymbol: user.currencySymbol,
          locale: user.locale,
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async linkAccount({ user }) {
      console.log('✅ Account linked for user:', user.email)
    }
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    // CRITICAL: Verify Google email and enable automatic account linking
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        const googleProfile = profile as { email_verified?: boolean; email?: string }

        // MUST verify email - Google guarantees email ownership
        if (!googleProfile.email_verified) {
          console.error('Google sign-in blocked: email not verified', googleProfile.email)
          return false
        }

        // Enable automatic account linking by email
        // Check if a user with this email already exists
        if (googleProfile.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: googleProfile.email },
            include: { Account: true }
          })

          if (existingUser) {
            // User exists - check if they already have a Google account linked
            const hasGoogleAccount = existingUser.Account.some(
              acc => acc.provider === 'google'
            )

            if (!hasGoogleAccount) {
              // Link the Google account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: 'oauth',
                  provider: 'google',
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                }
              })

              console.log('✅ Account linked:', googleProfile.email, 'to existing user')
              logOAuthEvent('account_linked', { email: googleProfile.email })
            } else {
              // User signing in with already-linked Google account
              logOAuthEvent('google_signin', { email: googleProfile.email })
            }
          } else {
            // New user signing up with Google
            logOAuthEvent('google_signup', { email: googleProfile.email })
          }
        }
      }

      return true
    },

    async jwt({ token, user, trigger, session }) {
      // On initial sign in (OAuth or credentials), load user data from database
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            preferredCurrency: true,
            preferredCountryCode: true,
            preferredRegion: true,
            currencySymbol: true,
            locale: true,
          }
        })

        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          token.name = dbUser.name
          token.picture = dbUser.image
          token.preferredCurrency = dbUser.preferredCurrency
          token.preferredCountryCode = dbUser.preferredCountryCode
          token.preferredRegion = dbUser.preferredRegion
          token.currencySymbol = dbUser.currencySymbol
          token.locale = dbUser.locale
        }
      }

      // When session is updated (e.g., avatar change, currency preferences)
      if (trigger === "update") {
        if (session?.image) {
          token.picture = session.image
        }
        if (session?.preferredCurrency !== undefined) {
          token.preferredCurrency = session.preferredCurrency
          token.preferredCountryCode = session.preferredCountryCode
          token.preferredRegion = session.preferredRegion
          token.currencySymbol = session.currencySymbol
          token.locale = session.locale
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
        session.user.preferredCurrency = token.preferredCurrency as string
        session.user.preferredCountryCode = token.preferredCountryCode as string
        session.user.preferredRegion = token.preferredRegion as string
        session.user.currencySymbol = token.currencySymbol as string
        session.user.locale = token.locale as string
      }
      return session
    },
  },
})
