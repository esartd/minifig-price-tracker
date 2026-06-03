import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupDir = path.join(process.cwd(), 'database-backups');

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('\n🔒 BACKING UP NEON DATABASE');
  console.log('='.repeat(70));
  console.log(`📁 Backup location: ${backupDir}`);
  console.log(`⏰ Timestamp: ${timestamp}\n`);

  try {
    // Backup all critical user data
    console.log('📥 Backing up User data...');
    const users = await prisma.user.findMany({
      include: {
        Account: true,
        Session: true,
      }
    });
    fs.writeFileSync(
      path.join(backupDir, `users-${timestamp}.json`),
      JSON.stringify(users, null, 2)
    );
    console.log(`   ✅ ${users.length} users backed up`);

    console.log('📥 Backing up CollectionItem data...');
    const collectionItems = await prisma.collectionItem.findMany();
    fs.writeFileSync(
      path.join(backupDir, `collection-items-${timestamp}.json`),
      JSON.stringify(collectionItems, null, 2)
    );
    console.log(`   ✅ ${collectionItems.length} collection items backed up`);

    console.log('📥 Backing up PersonalCollectionItem data...');
    const personalItems = await prisma.personalCollectionItem.findMany();
    fs.writeFileSync(
      path.join(backupDir, `personal-items-${timestamp}.json`),
      JSON.stringify(personalItems, null, 2)
    );
    console.log(`   ✅ ${personalItems.length} personal items backed up`);

    console.log('📥 Backing up Listing data...');
    const listings = await prisma.listing.findMany();
    fs.writeFileSync(
      path.join(backupDir, `listings-${timestamp}.json`),
      JSON.stringify(listings, null, 2)
    );
    console.log(`   ✅ ${listings.length} listings backed up`);

    // Also backup public data (we'll move this to Supabase)
    console.log('📥 Backing up MinifigCatalog data...');
    const catalog = await prisma.minifigCatalog.findMany();
    fs.writeFileSync(
      path.join(backupDir, `catalog-${timestamp}.json`),
      JSON.stringify(catalog, null, 2)
    );
    console.log(`   ✅ ${catalog.length} catalog items backed up`);

    console.log('📥 Backing up MinifigCache data...');
    const cache = await prisma.minifigCache.findMany();
    fs.writeFileSync(
      path.join(backupDir, `minifig-cache-${timestamp}.json`),
      JSON.stringify(cache, null, 2)
    );
    console.log(`   ✅ ${cache.length} cached minifigs backed up`);

    console.log('📥 Backing up PriceCache data...');
    const priceCache = await prisma.priceCache.findMany();
    fs.writeFileSync(
      path.join(backupDir, `price-cache-${timestamp}.json`),
      JSON.stringify(priceCache, null, 2)
    );
    console.log(`   ✅ ${priceCache.length} price cache entries backed up`);

    console.log('📥 Backing up ApiCallTracker data...');
    const apiTracker = await prisma.apiCallTracker.findMany();
    fs.writeFileSync(
      path.join(backupDir, `api-tracker-${timestamp}.json`),
      JSON.stringify(apiTracker, null, 2)
    );
    console.log(`   ✅ ${apiTracker.length} API tracker entries backed up`);

    // Create summary
    const summary = {
      timestamp,
      backup_date: new Date().toISOString(),
      database_url: process.env.DATABASE_URL?.includes('neon.tech') ? 'Neon (confirmed)' : 'Unknown',
      tables: {
        users: users.length,
        accounts: users.reduce((sum, u) => sum + u.Account.length, 0),
        sessions: users.reduce((sum, u) => sum + u.Session.length, 0),
        collectionItems: collectionItems.length,
        personalItems: personalItems.length,
        listings: listings.length,
        catalog: catalog.length,
        minifigCache: cache.length,
        priceCache: priceCache.length,
        apiTracker: apiTracker.length,
      },
      total_user_items: collectionItems.length + personalItems.length + listings.length,
    };

    fs.writeFileSync(
      path.join(backupDir, `BACKUP-SUMMARY-${timestamp}.json`),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n' + '='.repeat(70));
    console.log('✅ BACKUP COMPLETE!');
    console.log('='.repeat(70));
    console.log('\n📊 Summary:');
    console.log(`   Users: ${summary.tables.users}`);
    console.log(`   Total User Items: ${summary.total_user_items}`);
    console.log(`   Catalog Items: ${summary.tables.catalog}`);
    console.log(`   Cache Entries: ${summary.tables.minifigCache + summary.tables.priceCache}`);
    console.log(`\n📁 All files saved to: ${backupDir}`);
    console.log('\n⚠️  IMPORTANT: Keep these backup files safe until migration is verified!\n');

  } catch (error) {
    console.error('\n❌ BACKUP FAILED:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
