import { prisma } from '../lib/prisma';

async function enableUnaccent() {
  try {
    console.log('Enabling unaccent extension...');
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS unaccent');

    console.log('Adding unaccented search column...');

    // Add a regular column (not generated)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "MinifigCatalog"
      ADD COLUMN IF NOT EXISTS search_name_unaccent TEXT
    `);

    console.log('Populating unaccented values...');

    // Populate the column with unaccented values
    await prisma.$executeRawUnsafe(`
      UPDATE "MinifigCatalog"
      SET search_name_unaccent = unaccent(search_name)
      WHERE search_name_unaccent IS NULL
    `);

    console.log('Creating index on unaccented column...');
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MinifigCatalog_search_name_unaccent_gin_trgm"
      ON "MinifigCatalog" USING gin (search_name_unaccent gin_trgm_ops)
    `);

    console.log('✅ Unaccent search enabled successfully!');
    console.log('Now searches like "padme" will find "padmé"');
  } catch (error) {
    console.error('Error enabling unaccent:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enableUnaccent();
