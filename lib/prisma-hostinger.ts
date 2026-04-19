import { PrismaClient } from '../node_modules/.prisma/client-hostinger'

const globalForPrisma = globalThis as unknown as {
  prismaHostinger: PrismaClient | undefined
}

// Hostinger MySQL Database - User data (accounts, collections, listings, price cache)
export const prismaHostinger: PrismaClient = globalForPrisma.prismaHostinger ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL // Will be set to Hostinger connection
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaHostinger = prismaHostinger
}
