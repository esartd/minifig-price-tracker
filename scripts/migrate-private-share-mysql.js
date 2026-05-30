require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('.prisma/client-hostinger');

const prisma = new PrismaClient();

async function runMigration() {
  console.log('🔄 Running migration on MySQL: Add private share tokens...');
  console.log('Database:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));

  try {
    // MySQL syntax
    await prisma.$executeRawUnsafe(`
      ALTER TABLE User ADD COLUMN IF NOT EXISTS shareTokenInventoryPrivate VARCHAR(191) UNIQUE;
    `);
    console.log('✅ Added shareTokenInventoryPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE User ADD COLUMN IF NOT EXISTS shareEnabledInventoryPrivate BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Added shareEnabledInventoryPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE User ADD COLUMN IF NOT EXISTS shareTokenCollectionPrivate VARCHAR(191) UNIQUE;
    `);
    console.log('✅ Added shareTokenCollectionPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE User ADD COLUMN IF NOT EXISTS shareEnabledCollectionPrivate BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Added shareEnabledCollectionPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE User ADD COLUMN IF NOT EXISTS shareTokenSetsInventoryPrivate VARCHAR(191) UNIQUE;
    `);
    console.log('✅ Added shareTokenSetsInventoryPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE User ADD COLUMN IF NOT EXISTS shareEnabledSetsInventoryPrivate BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Added shareEnabledSetsInventoryPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE User ADD COLUMN IF NOT EXISTS shareTokenSetsCollectionPrivate VARCHAR(191) UNIQUE;
    `);
    console.log('✅ Added shareTokenSetsCollectionPrivate');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE User ADD COLUMN IF NOT EXISTS shareEnabledSetsCollectionPrivate BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Added shareEnabledSetsCollectionPrivate');

    console.log('\n✨ Migration completed successfully on MySQL!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
