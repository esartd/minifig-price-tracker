import { PrismaClient } from '@prisma/client'
import { PrismaClient as PrismaClientSupabase } from '../node_modules/.prisma/client-supabase'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaPublic: PrismaClientSupabase | undefined
}

// Neon Database - User data (accounts, collections, listings)
export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient({})

// Supabase Database - Public data (catalog, cache, API tracker)
export const prismaPublic: PrismaClientSupabase = globalForPrisma.prismaPublic ?? new PrismaClientSupabase({})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaPublic = prismaPublic
}
