/**
 * Fix minifigure names in CollectionItem table
 *
 * This script updates all collection items with correct character names
 * from MinifigCache (which has fresh names from BrickLink API).
 *
 * Usage: npm run fix-names
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMinifigNames() {
  console.log('🔧 Fixing minifigure names in inventory...\n');

  try {
    // Get all collection items
    const items = await prisma.collectionItem.findMany({
      select: {
        id: true,
        minifigure_no: true,
        minifigure_name: true,
      }
    });

    console.log(`Found ${items.length} items in inventory\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of items) {
      try {
        // Look up correct name from MinifigCache
        const cached = await prisma.minifigCache.findUnique({
          where: { minifigure_no: item.minifigure_no }
        });

        if (!cached) {
          console.log(`⚠️  ${item.minifigure_no}: Not in cache, skipping`);
          skipped++;
          continue;
        }

        // Check if name needs updating
        if (item.minifigure_name === cached.name) {
          skipped++;
          continue;
        }

        // Update the name
        await prisma.collectionItem.update({
          where: { id: item.id },
          data: { minifigure_name: cached.name }
        });

        console.log(`✅ ${item.minifigure_no}:`);
        console.log(`   OLD: "${item.minifigure_name}"`);
        console.log(`   NEW: "${cached.name}"\n`);
        updated++;

      } catch (error: any) {
        console.error(`❌ ${item.minifigure_no}: ${error.message}`);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixMinifigNames();
