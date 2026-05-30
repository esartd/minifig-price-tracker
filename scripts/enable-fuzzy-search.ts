import { prisma } from '../lib/prisma';

async function enableFuzzySearch() {
  try {
    console.log('Enabling pg_trgm extension...');
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pg_trgm');

    console.log('Creating GIN index for fuzzy search...');
    await prisma.$executeRawUnsafe(
      'CREATE INDEX IF NOT EXISTS "MinifigCatalog_search_name_gin_trgm" ON "MinifigCatalog" USING gin (search_name gin_trgm_ops)'
    );

    console.log('✅ Fuzzy search enabled successfully!');
  } catch (error) {
    console.error('Error enabling fuzzy search:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enableFuzzySearch();
