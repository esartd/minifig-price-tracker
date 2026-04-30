require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runMigration() {
  console.log('🔄 Running migration: Add private share tokens...');

  try {
    // Add columns using raw SQL
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareTokenInventoryPrivate" TEXT UNIQUE;
    `);
    console.log('✅ Added shareTokenInventoryPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareEnabledInventoryPrivate" BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Added shareEnabledInventoryPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareTokenCollectionPrivate" TEXT UNIQUE;
    `);
    console.log('✅ Added shareTokenCollectionPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareEnabledCollectionPrivate" BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Added shareEnabledCollectionPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareTokenSetsInventoryPrivate" TEXT UNIQUE;
    `);
    console.log('✅ Added shareTokenSetsInventoryPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareEnabledSetsInventoryPrivate" BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Added shareEnabledSetsInventoryPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareTokenSetsCollectionPrivate" TEXT UNIQUE;
    `);
    console.log('✅ Added shareTokenSetsCollectionPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareEnabledSetsCollectionPrivate" BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Added shareEnabledSetsCollectionPrivate');

    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
