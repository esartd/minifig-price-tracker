import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Manual migration endpoint - run migrations on production
 * Call this once to apply pending migrations
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Running unaccent migration...');

    // Enable unaccent extension
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS unaccent');
    console.log('✓ Unaccent extension enabled');

    // Add unaccented search column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "MinifigCatalog"
      ADD COLUMN IF NOT EXISTS search_name_unaccent TEXT
    `);
    console.log('✓ Added search_name_unaccent column');

    // Populate with unaccented values
    await prisma.$executeRawUnsafe(`
      UPDATE "MinifigCatalog"
      SET search_name_unaccent = unaccent(search_name)
      WHERE search_name_unaccent IS NULL
    `);
    console.log('✓ Populated unaccented values');

    // Add GIN trigram index
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MinifigCatalog_search_name_unaccent_gin_trgm"
      ON "MinifigCatalog" USING gin (search_name_unaccent gin_trgm_ops)
    `);
    console.log('✓ Created trigram index');

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully'
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
