import { PrismaClient } from '@prisma/client'
import { PrismaClient as PrismaClientSupabase } from '../node_modules/.prisma/client-supabase'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaPublic: PrismaClientSupabase | undefined
}

// Neon Database - User data (accounts, collections, listings)
export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Supabase Database - Public data (catalog, cache, API tracker)
// Limit connections to avoid MaxClientsInSessionMode error during builds
export const prismaPublic: PrismaClientSupabase = globalForPrisma.prismaPublic ?? new PrismaClientSupabase({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL
    }
  },
  // Limit connection pool for Session mode pooler
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaPublic = prismaPublic
}
