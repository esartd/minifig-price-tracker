import { prisma } from './prisma';

let migrationRan = false;

/**
 * Run migrations automatically on app startup
 * Only runs once per deployment
 */
export async function runMigrations() {
  if (migrationRan) return;

  try {
    console.log('[Migrations] Checking for pending migrations...');

    // Check if unaccent column exists
    const result = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'MinifigCatalog'
        AND column_name = 'search_name_unaccent'
      ) as exists`
    );

    if (!result[0].exists) {
      console.log('[Migrations] Running unaccent migration...');

      // Enable unaccent extension
      await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS unaccent');
      console.log('[Migrations] ✓ Unaccent extension enabled');

      // Add unaccented search column
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "MinifigCatalog"
        ADD COLUMN search_name_unaccent TEXT
      `);
      console.log('[Migrations] ✓ Added search_name_unaccent column');

      // Populate with unaccented values
      await prisma.$executeRawUnsafe(`
        UPDATE "MinifigCatalog"
        SET search_name_unaccent = unaccent(search_name)
      `);
      console.log('[Migrations] ✓ Populated unaccented values');

      // Add GIN trigram index
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "MinifigCatalog_search_name_unaccent_gin_trgm"
        ON "MinifigCatalog" USING gin (search_name_unaccent gin_trgm_ops)
      `);
      console.log('[Migrations] ✓ Created trigram index');

      console.log('[Migrations] ✅ Migration completed successfully!');
    } else {
      console.log('[Migrations] ✓ Database is up to date');
    }

    migrationRan = true;
  } catch (error) {
    console.error('[Migrations] ❌ Migration failed:', error);
    // Don't throw - allow app to start even if migration fails
  }
}
