import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientSupabase } from '../node_modules/.prisma/client-supabase';

// Read from Neon using regular Prisma (still has all tables)
const neon = new PrismaClient();
const supabase = new PrismaClientSupabase();

async function migrateData() {
  console.log('\n📦 MIGRATING PUBLIC DATA FROM NEON TO SUPABASE');
  console.log('='.repeat(70));

  try {
    // Migrate MinifigCatalog
    console.log('\n📥 Migrating MinifigCatalog...');
    const catalog = await neon.minifigCatalog.findMany();
    console.log(`   Found ${catalog.length} catalog items`);

    for (let i = 0; i < catalog.length; i += 100) {
      const batch = catalog.slice(i, i + 100);
      await supabase.minifigCatalog.createMany({
        data: batch,
        skipDuplicates: true,
      });
      console.log(`   Migrated ${Math.min(i + 100, catalog.length)}/${catalog.length}`);
    }
    console.log(`   ✅ Migrated ${catalog.length} catalog items`);

    // Migrate MinifigCache
    console.log('\n📥 Migrating MinifigCache...');
    const cache = await neon.minifigCache.findMany();
    console.log(`   Found ${cache.length} cached minifigs`);

    if (cache.length > 0) {
      await supabase.minifigCache.createMany({
        data: cache,
        skipDuplicates: true,
      });
      console.log(`   ✅ Migrated ${cache.length} cached minifigs`);
    }

    // Migrate PriceCache
    console.log('\n📥 Migrating PriceCache...');
    const priceCache = await neon.priceCache.findMany();
    console.log(`   Found ${priceCache.length} price cache entries`);

    for (let i = 0; i < priceCache.length; i += 100) {
      const batch = priceCache.slice(i, i + 100);
      await supabase.priceCache.createMany({
        data: batch,
        skipDuplicates: true,
      });
      console.log(`   Migrated ${Math.min(i + 100, priceCache.length)}/${priceCache.length}`);
    }
    console.log(`   ✅ Migrated ${priceCache.length} price cache entries`);

    // Migrate ApiCallTracker
    console.log('\n📥 Migrating ApiCallTracker...');
    const apiTracker = await neon.apiCallTracker.findMany();
    console.log(`   Found ${apiTracker.length} API tracker entries`);

    if (apiTracker.length > 0) {
      await supabase.apiCallTracker.createMany({
        data: apiTracker,
        skipDuplicates: true,
      });
      console.log(`   ✅ Migrated ${apiTracker.length} API tracker entries`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ MIGRATION COMPLETE!');
    console.log('='.repeat(70));
    console.log('\n📊 Summary:');
    console.log(`   MinifigCatalog: ${catalog.length} items`);
    console.log(`   MinifigCache: ${cache.length} items`);
    console.log(`   PriceCache: ${priceCache.length} items`);
    console.log(`   ApiCallTracker: ${apiTracker.length} items`);
    console.log('\n✅ All public data is now on Supabase!\n');

  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error);
    throw error;
  } finally {
    await neon.$disconnect();
    await supabase.$disconnect();
  }
}

migrateData();
