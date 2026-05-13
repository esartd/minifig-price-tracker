import { PrismaClient } from '@prisma/client-hostinger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Hostinger MySQL Database - All user data (accounts, collections, listings, price cache)
// Migrated from Neon PostgreSQL - April 2026
// Connection pooling: limit=5 to prevent exhausting Hostinger's 500 connections/hour limit
const connectionUrl = process.env.DATABASE_URL || 'mysql://user:pass@localhost:3306/db';
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
