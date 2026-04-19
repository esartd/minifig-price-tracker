import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  providers: [
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
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On initial sign in, set user data from database
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.preferredCurrency = user.preferredCurrency
        token.preferredCountryCode = user.preferredCountryCode
        token.preferredRegion = user.preferredRegion
        token.currencySymbol = user.currencySymbol
        token.locale = user.locale
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
