import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Hostinger VPS PostgreSQL Database - All user data (accounts, collections, listings, price cache)
// Migrated from Hostinger MySQL - May 2026
// Connection pooling: limit=5 for optimal performance
const connectionUrl = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/db';
const pooledUrl = connectionUrl.includes('?')
  ? `${connectionUrl}&connection_limit=5&pool_timeout=20`
  : `${connectionUrl}?connection_limit=5&pool_timeout=20`;

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: pooledUrl
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Legacy export for compatibility
export const prismaPublic = prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
