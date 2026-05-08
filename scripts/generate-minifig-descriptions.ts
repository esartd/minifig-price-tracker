import { PrismaClient } from '@prisma/client-hostinger';
import { generateMinifigDescription } from '../lib/description-generator';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

// Priority themes (highest SEO traffic)
const PRIORITY_THEMES = [
  'Star Wars',
  'Harry Potter',
  'Marvel Super Heroes',
  'DC Comics Super Heroes',
  'The Lord of the Rings',
  'Disney',
  'City',
  'Ninjago'
];

async function batchGenerate(batchSize = 100, themeFilter?: string) {
  console.log('\n🚀 Starting batch description generation (4 languages per minifig)...\n');

  // Load pending minifigs
  const minifigs = await prisma.minifigCatalog.findMany({
    where: {
      description_status: 'pending',
      ...(themeFilter && {
        category_name: { contains: themeFilter }
      })
    },
    take: batchSize,
    orderBy: [
      { year_released: 'desc' }, // Newest first
      { minifigure_no: 'asc' }
    ]
  });

  console.log(`📊 Found ${minifigs.length} minifigs to process\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const minifig of minifigs) {
    try {
      console.log(`  📝 Generating: ${minifig.name} (${minifig.minifigure_no})`);

      // Generate descriptions in all 4 languages
      const descriptions = await generateMinifigDescription({
        minifigure_no: minifig.minifigure_no,
        name: minifig.name,
        category_name: minifig.category_name,
        year_released: minifig.year_released
      });

      // Validate all languages received
      if (!descriptions.en || !descriptions.de || !descriptions.fr || !descriptions.es) {
        throw new Error('Missing translations in response');
      }

      // Save to database
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: {
          description_en: descriptions.en,
          description_de: descriptions.de,
          description_fr: descriptions.fr,
          description_es: descriptions.es,
          description_generated_at: new Date(),
          description_status: 'generated'
        }
      });

      successCount++;
      console.log(`  ✅ Success (${successCount}/${minifigs.length}) - Generated all 4 languages\n`);

      // Rate limiting: 3 seconds between requests (OpenAI safety margin)
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error: any) {
      errorCount++;
      console.error(`  ❌ Error: ${error.message}\n`);

      // Mark as error for retry
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: { description_status: 'error' }
      }).catch(() => {}); // Ignore if this fails
    }
  }

  console.log('\n✅ Batch complete!');
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total languages generated: ${successCount * 4}\n`);

  await prisma.$disconnect();
}

// Run with optional theme filter
const theme = process.argv[2];
const batchSize = parseInt(process.argv[3]) || 100;

batchGenerate(batchSize, theme).catch(console.error);
