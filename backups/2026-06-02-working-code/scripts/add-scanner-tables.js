require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('../node_modules/.prisma/client-hostinger');

const prisma = new PrismaClient();

async function addScannerTables() {
  console.log('🔄 Adding Scanner tables for AI minifigure recognition...');

  try {
    // Create ScanFeedback table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ScanFeedback (
        id VARCHAR(191) PRIMARY KEY,
        scanHistoryId VARCHAR(191) NOT NULL,
        userId VARCHAR(191) NOT NULL,
        wasCorrect BOOLEAN NOT NULL,
        actualItemNo VARCHAR(191),
        feedbackText TEXT,
        creditAwarded BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_scan_history (scanHistoryId),
        INDEX idx_user_created (userId, createdAt),
        INDEX idx_correct (wasCorrect)
      );
    `);
    console.log('✅ ScanFeedback table created');

    // Create ScanJob table for batch processing
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ScanJob (
        id VARCHAR(191) PRIMARY KEY,
        userId VARCHAR(191) NOT NULL,
        batchId VARCHAR(191) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        imageUrl VARCHAR(500) NOT NULL,
        result JSON,
        errorReason VARCHAR(500),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        processedAt DATETIME,
        INDEX idx_batch_status (batchId, status),
        INDEX idx_user_created (userId, createdAt),
        INDEX idx_status_created (status, createdAt)
      );
    `);
    console.log('✅ ScanJob table created');

    // Create Subscription table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Subscription (
        id VARCHAR(191) PRIMARY KEY,
        userId VARCHAR(191) NOT NULL UNIQUE,
        plan VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        stripeCustomerId VARCHAR(191),
        stripeSubscriptionId VARCHAR(191),
        currentPeriodEnd DATETIME NOT NULL,
        cancelAtPeriodEnd BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (userId),
        INDEX idx_status (status)
      );
    `);
    console.log('✅ Subscription table created');

    // Create ScanCreditPurchase table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ScanCreditPurchase (
        id VARCHAR(191) PRIMARY KEY,
        userId VARCHAR(191) NOT NULL,
        packType VARCHAR(50) NOT NULL,
        creditsAmount INT NOT NULL,
        priceInCents INT NOT NULL,
        stripePaymentId VARCHAR(191),
        purchasedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_purchased (userId, purchasedAt)
      );
    `);
    console.log('✅ ScanCreditPurchase table created');

    // Update User table with scanner fields (ALTER TABLE)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE User
      ADD COLUMN IF NOT EXISTS scanCreditsRemaining INT DEFAULT 5,
      ADD COLUMN IF NOT EXISTS dailyScansUsed INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS lastScanResetDate DATETIME,
      ADD COLUMN IF NOT EXISTS subscriptionTier VARCHAR(50) DEFAULT 'free';
    `);
    console.log('✅ User table updated with scanner fields');

    console.log('\n✨ Scanner tables migrated successfully!');
    console.log('📝 Note: ScanHistory table already exists in schema, no changes needed.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addScannerTables();
