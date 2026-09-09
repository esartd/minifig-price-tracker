import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Runs ALTER TABLE against User. Idempotent, but an unauthenticated GET
  // that executes DDL is reachable by a crawler or a link prefetch.
  const { authorized, error } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error }, { status: error === 'Unauthorized' ? 401 : 403 });
  }

  try {
    // Run each ALTER TABLE separately to handle existing columns gracefully
    const migrations = [
      // Inventory fields
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS shareTokenInventory VARCHAR(191) UNIQUE DEFAULT NULL`,
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS shareEnabledInventory BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS sharePricingInventory BOOLEAN NOT NULL DEFAULT true`,

      // Collection fields
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS shareTokenCollection VARCHAR(191) UNIQUE DEFAULT NULL`,
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS shareEnabledCollection BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS sharePricingCollection BOOLEAN NOT NULL DEFAULT false`,

      // Sets inventory fields
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS shareTokenSetsInventory VARCHAR(191) UNIQUE DEFAULT NULL`,
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS shareEnabledSetsInventory BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS sharePricingSetsInventory BOOLEAN NOT NULL DEFAULT true`,

      // Sets collection fields
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS shareTokenSetsCollection VARCHAR(191) UNIQUE DEFAULT NULL`,
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS shareEnabledSetsCollection BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE User ADD COLUMN IF NOT EXISTS sharePricingSetsCollection BOOLEAN NOT NULL DEFAULT false`,
    ];

    const results = [];

    for (const sql of migrations) {
      try {
        await prisma.$executeRawUnsafe(sql);
        results.push({ sql, status: 'success' });
      } catch (error: any) {
        // Column might already exist, which is fine
        if (error.message?.includes('Duplicate column')) {
          results.push({ sql, status: 'already exists' });
        } else {
          results.push({ sql, status: 'error', error: error.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Share collection migration completed',
      results
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
