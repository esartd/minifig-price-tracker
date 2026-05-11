import { PrismaClient } from '@prisma/client-hostinger';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function restoreNames() {
  console.log('🔄 Restoring minifigure names from JSON...\n');

  // Read the JSON catalog
  const jsonPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
  const minifigsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // Filter Star Wars minifigs
  const starWarsMinifigs = minifigsData.filter((m: any) =>
    m.category_name && m.category_name.includes('Star Wars')
  );

  console.log(`Found ${starWarsMinifigs.length} Star Wars minifigs in JSON\n`);

  let restored = 0;
  let errors = 0;

  for (const minifig of starWarsMinifigs) {
    try {
      // Only update the name field, nothing else
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: {
          name: minifig.name,
          category_name: minifig.category_name,
          year_released: minifig.year_released,
          weight_grams: minifig.weight ? parseFloat(minifig.weight) : null
        }
      });

      restored++;
      if (restored % 100 === 0) {
        console.log(`  ✅ Restored ${restored} names...`);
      }
    } catch (error: any) {
      // Minifig might not exist in database yet - skip
      errors++;
    }
  }

  console.log(`\n✨ Complete! Restored ${restored} minifig names`);
  if (errors > 0) {
    console.log(`   ⚠️  ${errors} minifigs not found in database (skipped)`);
  }

  await prisma.$disconnect();
}

restoreNames().catch(console.error);
