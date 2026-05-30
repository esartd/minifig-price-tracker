import { PrismaClient } from '@prisma/client-hostinger';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Load correct BrickLink catalog
const minifigsPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const minifigs = JSON.parse(fs.readFileSync(minifigsPath, 'utf-8'));

async function syncCatalog() {
  console.log(`🔄 Syncing MinifigCatalog table with BrickLink JSON (source of truth)...`);
  console.log(`📊 Total minifigs in JSON: ${minifigs.length}\n`);

  let synced = 0;
  let created = 0;
  let updated = 0;
  let errors = 0;

  // Process in batches
  const BATCH_SIZE = 50;

  for (let i = 0; i < minifigs.length; i += BATCH_SIZE) {
    const batch = minifigs.slice(i, i + BATCH_SIZE);

    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${i + 1}-${Math.min(i + BATCH_SIZE, minifigs.length)} of ${minifigs.length})...`);

    for (const minifig of batch) {
      try {
        // Use upsert to create or update with correct BrickLink data
        await prisma.minifigCatalog.upsert({
          where: { minifigure_no: minifig.minifigure_no },
          update: {
            name: minifig.name,
            // Don't overwrite existing descriptions
          },
          create: {
            minifigure_no: minifig.minifigure_no,
            name: minifig.name,
            description_en: null,
            description_de: null,
            description_fr: null,
            description_es: null,
          },
        });

        synced++;

        if (synced % 100 === 0) {
          const progress = (synced / minifigs.length * 100).toFixed(1);
          console.log(`  ✅ Synced ${synced} minifigs (${progress}%)`);
        }

      } catch (error: any) {
        errors++;
        if (errors < 10) {
          console.error(`  ❌ Error syncing ${minifig.minifigure_no}:`, error.message);
        }
      }
    }

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Catalog sync complete!`);
  console.log(`📊 Final stats:`);
  console.log(`   - Total synced: ${synced}`);
  console.log(`   - Errors: ${errors}`);

  await prisma.$disconnect();
}

syncCatalog().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
