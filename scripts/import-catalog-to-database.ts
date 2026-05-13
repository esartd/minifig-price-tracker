import { PrismaClient } from '@prisma/client-hostinger';
import { promises as fs } from 'fs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function importCatalog() {
  console.log('Starting catalog import to database...\n');

  // Load catalog JSON
  const catalogData = await fs.readFile('public/catalog/minifigs.json', 'utf-8');
  const catalog = JSON.parse(catalogData);

  // Import ALL minifigs (all themes)
  const allMinifigs = catalog;

  console.log(`Found ${allMinifigs.length} total minifigs in catalog (all themes)`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const minifig of allMinifigs) {
    try {
      // Check if already exists
      const existing = await prisma.minifigCatalog.findUnique({
        where: { minifigure_no: minifig.minifigure_no }
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Insert new record
      await prisma.minifigCatalog.create({
        data: {
          minifigure_no: minifig.minifigure_no,
          name: minifig.name,
          category_id: minifig.category_id,
          category_name: minifig.category_name || 'Star Wars',
          year_released: minifig.year_released ? String(minifig.year_released) : null,
          weight_grams: minifig.weight_grams ? parseFloat(minifig.weight_grams) : null,
          search_name: minifig.name.toLowerCase(),
          // Leave description fields null - will be filled later
          description_en: null,
          description_de: null,
          description_fr: null,
          description_es: null,
          description_status: 'pending',
          description_generated_at: null
        }
      });

      imported++;

      if (imported % 50 === 0) {
        console.log(`Progress: ${imported} imported, ${skipped} already exist`);
      }

    } catch (error: any) {
      errors++;
      console.error(`✗ Error importing ${minifig.minifigure_no}: ${error.message}`);
    }
  }

  console.log('\n=== Import Complete ===');
  console.log(`✓ Imported: ${imported}`);
  console.log(`- Skipped (already exist): ${skipped}`);
  console.log(`✗ Errors: ${errors}`);
  console.log(`Total in catalog: ${allMinifigs.length}`);
  console.log(`Total should be in database: ${imported + skipped}`);

  await prisma.$disconnect();
}

importCatalog();
