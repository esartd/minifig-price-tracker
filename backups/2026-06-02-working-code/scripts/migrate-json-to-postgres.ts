import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function migrateData() {
  console.log('⚠️  This script is obsolete after the database schema update to include userId.');
  console.log('It is kept for reference only and will not run.');
  return;

  const jsonPath = path.join(process.cwd(), 'data', 'collection.json');

  if (!fs.existsSync(jsonPath)) {
    console.log('❌ No existing data to migrate');
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`📦 Migrating ${data.collection.length} items from JSON to PostgreSQL...\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const item of data.collection) {
    try {
      await prisma.collectionItem.upsert({
        where: {
          id: item.id
        },
        update: {
          minifigure_no: item.minifigure_no,
          minifigure_name: item.minifigure_name,
          quantity: item.quantity,
          condition: item.condition,
          image_url: item.image_url,
          pricing_six_month_avg: item.pricing?.sixMonthAverage,
          pricing_current_avg: item.pricing?.currentAverage,
          pricing_current_lowest: item.pricing?.currentLowest,
          pricing_suggested_price: item.pricing?.suggestedPrice,
          date_added: new Date(item.date_added),
          last_updated: new Date(item.last_updated)
        },
        create: {
          id: item.id,
          minifigure_no: item.minifigure_no,
          minifigure_name: item.minifigure_name,
          quantity: item.quantity,
          condition: item.condition,
          image_url: item.image_url,
          pricing_six_month_avg: item.pricing?.sixMonthAverage,
          pricing_current_avg: item.pricing?.currentAverage,
          pricing_current_lowest: item.pricing?.currentLowest,
          pricing_suggested_price: item.pricing?.suggestedPrice,
          date_added: new Date(item.date_added),
          last_updated: new Date(item.last_updated),
          userId: 'placeholder' // This code is unreachable
        }
      });

      console.log(`✅ Migrated: ${item.minifigure_name} (${item.minifigure_no})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to migrate ${item.minifigure_no}:`, error);
      skipCount++;
    }
  }

  console.log(`\n🎉 Migration complete!`);
  console.log(`   ✅ Successfully migrated: ${successCount} items`);
  if (skipCount > 0) {
    console.log(`   ⚠️  Skipped: ${skipCount} items`);
  }
}

migrateData()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Migration failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
