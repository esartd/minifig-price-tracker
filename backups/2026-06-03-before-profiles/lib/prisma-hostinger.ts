import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prismaHostinger: PrismaClient | undefined
}

// Hostinger VPS PostgreSQL Database - User data (accounts, collections, listings, price cache)
// Migrated from Hostinger MySQL - May 2026
// Connection pooling: limit=5 for optimal performance
const connectionUrl = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/db';
const pooledUrl = connectionUrl.includes('?')
  ? `${connectionUrl}&connection_limit=5&pool_timeout=20`
  : `${connectionUrl}?connection_limit=5&pool_timeout=20`;

export const prismaHostinger: PrismaClient = globalForPrisma.prismaHostinger ?? new PrismaClient({
  datasources: {
    db: {
      url: pooledUrl
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaHostinger = prismaHostinger
}
