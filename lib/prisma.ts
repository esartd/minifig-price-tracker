import { PrismaClient } from '../node_modules/.prisma/client-hostinger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Hostinger MySQL Database - All user data (accounts, collections, listings, price cache)
// Migrated from Neon PostgreSQL - April 2026
// Connection pooling configured via DATABASE_URL query params to prevent exhausting Hostinger's limits
export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Legacy export for compatibility
export const prismaPublic = prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
