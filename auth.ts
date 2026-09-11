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
  // Use secure cookies only in production
  useSecureCookies: process.env.NODE_ENV === 'production',
  ...(process.env.NODE_ENV === 'production' && {
    cookies: {
      sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        }
      },
      callbackUrl: {
        name: `__Secure-next-auth.callback-url`,
        options: {
          sameSite: 'lax',
          path: '/',
          secure: true,
        }
      },
      csrfToken: {
        name: `__Host-next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        }
      },
      pkceCodeVerifier: {
        name: `__Secure-next-auth.pkce.code_verifier`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        }
      },
      state: {
        name: `__Secure-next-auth.state`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        }
      },
      nonce: {
        name: `__Secure-next-auth.nonce`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        }
      }
    }
  }),
  callbacks: {
    // CRITICAL: Verify Google email and enable automatic account linking
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        const googleProfile = profile as { email_verified?: boolean; email?: string; picture?: string }

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

            // Keep the Google photo URL fresh on every sign-in, in a column of
            // its own so that picking a LEGO avatar cannot destroy it.
            //
            // `image` is whichever avatar is actually shown and holds two
            // different kinds of thing -- a Google URL or a LEGO avatar id. If
            // the user is currently showing their Google photo, move them onto
            // the new URL too; Google rotates these when someone changes their
            // picture, and a stale one renders as a broken image. If they are
            // showing a LEGO avatar, leave `image` alone -- that is their
            // choice, and googleImage is only the standby.
            if (googleProfile.picture) {
              const showingGooglePhoto =
                existingUser.image != null &&
                (existingUser.image === existingUser.googleImage ||
                  existingUser.image.startsWith('https://lh3.googleusercontent.com/'));

              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  googleImage: googleProfile.picture,
                  ...(showingGooglePhoto ? { image: googleProfile.picture } : {}),
                },
              });
            }

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
            // New user signing up with Google. The row does not exist yet --
            // the adapter creates it right after this callback returns -- so
            // googleImage is mirrored in the jwt callback below instead, on the
            // first pass where a dbUser exists.
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
            username: true,
            profilePublic: true,
            googleImage: true,
            Account: { select: { provider: true } },
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
          token.username = dbUser.username
          token.profilePublic = dbUser.profilePublic

          // A brand-new Google signup has its row created by the adapter AFTER
          // the signIn callback runs, so that callback had nothing to update.
          // This is the first pass where the row exists: if the adapter stored
          // a Google photo as `image` and googleImage is still empty, mirror it
          // now. Without this the very first Google session has no standby
          // photo, so the account page would offer no way back after picking a
          // LEGO avatar.
          let googleImage = dbUser.googleImage
          if (!googleImage && dbUser.image?.startsWith('https://lh3.googleusercontent.com/')) {
            googleImage = dbUser.image
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { googleImage },
            })
          }

          token.googleImage = googleImage
          token.hasGoogle = dbUser.Account.some((a) => a.provider === 'google')
        }
      }

      // When session is updated (e.g., avatar change, currency preferences)
      if (trigger === "update") {
        if (session?.image) {
          token.picture = session.image
        }
        if (session?.googleImage !== undefined) {
          token.googleImage = session.googleImage
        }
        if (session?.preferredCurrency !== undefined) {
          token.preferredCurrency = session.preferredCurrency
          token.preferredCountryCode = session.preferredCountryCode
          token.preferredRegion = session.preferredRegion
          token.currencySymbol = session.currencySymbol
          token.locale = session.locale
        }
        if (session?.username !== undefined) {
          token.username = session.username
        }
        if (session?.profilePublic !== undefined) {
          token.profilePublic = session.profilePublic
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
        session.user.username = token.username as string | null | undefined
        session.user.profilePublic = token.profilePublic as boolean | null | undefined
        // Both are needed by the account page's avatar picker: whether to offer
        // the Google option at all, and what to show in it.
        session.user.googleImage = token.googleImage as string | null | undefined
        session.user.hasGoogle = token.hasGoogle as boolean | undefined
      }
      return session
    },
    // Preserve subdomain during OAuth redirect
    async redirect({ url, baseUrl }) {
      // If url is relative, preserve it
      if (url.startsWith('/')) return url

      // If url is on our domain (any subdomain), allow it
      try {
        const urlObj = new URL(url)
        const allowedDomain = 'figtracker.ericksu.com'

        if (urlObj.hostname === allowedDomain || urlObj.hostname.endsWith(`.${allowedDomain}`)) {
          return url
        }
      } catch {
        // Invalid URL, fall back to baseUrl
      }

      // Default: redirect to baseUrl (but this shouldn't happen with our setup)
      return baseUrl
    },
  },
})
