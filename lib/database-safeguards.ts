/**
 * CRITICAL DATABASE SAFEGUARDS
 *
 * This file contains protection mechanisms to prevent accidental data loss.
 * These checks MUST pass before any destructive database operations.
 */

import { prisma, prismaPublic } from './prisma';

/**
 * Verify database has data before any destructive operations
 * Throws error if production database appears to be empty
 */
export async function verifyProductionDataExists(): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production' ||
                       !process.env.DATABASE_URL?.includes('localhost');

  if (!isProduction) {
    // Allow operations on local/dev databases
    return;
  }

  // Check if critical tables have data
  const [userCount, collectionCount, catalogCount] = await Promise.all([
    prisma.user.count(),
    prisma.collectionItem.count(),
    prismaPublic.minifigCatalog.count(),
  ]);

  // If ALL critical tables are empty, something is very wrong
  if (userCount === 0 && collectionCount === 0 && catalogCount === 0) {
    throw new Error(
      '🚨 CRITICAL: Production database appears to be empty! ' +
      'This operation has been blocked to prevent data loss. ' +
      'Please restore from backup before proceeding.'
    );
  }

  console.log('✅ Database safeguard check passed:', {
    users: userCount,
    collections: collectionCount,
    catalog: catalogCount
  });
}

/**
 * Block dangerous Prisma operations in production
 * Call this at startup to prevent accidental wipes
 */
export function setupProductionSafeguards() {
  const isProduction = process.env.NODE_ENV === 'production' ||
                       !process.env.DATABASE_URL?.includes('localhost');

  if (!isProduction) {
    console.log('⚠️  Development mode: Database safeguards are informational only');
    return;
  }

  console.log('🛡️  Production mode: Database safeguards are ACTIVE');

  // Warn about dangerous operations
  const originalDeleteMany = prisma.$transaction.bind(prisma);

  // Log all transactions in production for audit trail
  prisma.$use(async (params, next) => {
    const start = Date.now();

    // Block deleteMany operations entirely in production
    if (params.action === 'deleteMany') {
      console.error('🚨 BLOCKED: deleteMany operation attempted in production!', {
        model: params.model,
        timestamp: new Date().toISOString()
      });
      throw new Error(
        'deleteMany is BLOCKED in production to prevent data loss. ' +
        'Use individual delete operations with explicit where clauses instead.'
      );
    }

    // Warn about bulk deletes
    if (params.action === 'delete' && !params.args?.where) {
      console.error('🚨 BLOCKED: Delete without where clause in production!', {
        model: params.model,
        timestamp: new Date().toISOString()
      });
      throw new Error(
        'Delete operations MUST include a where clause in production.'
      );
    }

    const result = await next(params);
    const duration = Date.now() - start;

    // Log slow queries and mutations
    if (duration > 1000 || ['create', 'update', 'delete', 'upsert'].includes(params.action)) {
      console.log('🔍 Database operation:', {
        model: params.model,
        action: params.action,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });
    }

    return result;
  });
}

/**
 * Create a safety snapshot before risky operations
 * Returns a function to verify data wasn't lost
 */
export async function createSafetySnapshot() {
  const snapshot = {
    timestamp: new Date().toISOString(),
    users: await prisma.user.count(),
    collectionItems: await prisma.collectionItem.count(),
    personalItems: await prisma.personalCollectionItem.count(),
    catalog: await prismaPublic.minifigCatalog.count(),
    priceCache: await prismaPublic.priceCache.count(),
  };

  console.log('📸 Safety snapshot created:', snapshot);

  return {
    snapshot,
    verify: async () => {
      const current = {
        users: await prisma.user.count(),
        collectionItems: await prisma.collectionItem.count(),
        personalItems: await prisma.personalCollectionItem.count(),
        catalog: await prismaPublic.minifigCatalog.count(),
        priceCache: await prismaPublic.priceCache.count(),
      };

      // Check if any critical data was lost (allow growth)
      if (current.users < snapshot.users ||
          current.collectionItems < snapshot.collectionItems ||
          current.personalItems < snapshot.personalItems) {
        console.error('🚨 DATA LOSS DETECTED!', {
          before: snapshot,
          after: current,
          loss: {
            users: snapshot.users - current.users,
            collectionItems: snapshot.collectionItems - current.collectionItems,
            personalItems: snapshot.personalItems - current.personalItems,
          }
        });
        return false;
      }

      console.log('✅ Data integrity verified - no loss detected');
      return true;
    }
  };
}

/**
 * Emergency: Prevent ALL writes to production database
 * Use this if something has gone terribly wrong
 */
export function enableEmergencyReadOnly() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  Emergency read-only mode not applied (not production)');
    return;
  }

  prisma.$use(async (params, next) => {
    if (['create', 'update', 'delete', 'upsert', 'deleteMany', 'updateMany'].includes(params.action)) {
      throw new Error(
        '🚨 EMERGENCY READ-ONLY MODE: All write operations are blocked. ' +
        'Database is in emergency protection mode.'
      );
    }
    return next(params);
  });

  console.error('🚨 EMERGENCY READ-ONLY MODE ACTIVATED - ALL WRITES BLOCKED');
}
