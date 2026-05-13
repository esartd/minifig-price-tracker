import { PrismaClient } from '@prisma/client-hostinger'

const globalForPrisma = globalThis as unknown as {
  prismaHostinger: PrismaClient | undefined
}

// Hostinger MySQL Database - User data (accounts, collections, listings, price cache)
// Connection pooling: limit=5 to prevent exhausting Hostinger's 500 connections/hour limit
const connectionUrl = process.env.DATABASE_URL || 'mysql://user:pass@localhost:3306/db';
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
