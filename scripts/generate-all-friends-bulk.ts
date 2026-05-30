import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

// Bulk generate descriptions for all remaining Friends minifigs
// This is a condensed but complete description generator

async function generateBulk() {
  const missing = await prisma.minifigCatalog.findMany({
    where: {
      category_name: 'Friends',
      OR: [
        { description_en: null },
        { description_en: '' }
      ]
    },
    select: {
      minifigure_no: true,
      name: true,
      year_released: true
    },
    orderBy: {
      minifigure_no: 'asc'
    }
  });

  console.log(`📝 Generating descriptions for ${missing.length} Friends minifigures...\n`);

  let saved = 0;
  let failed = 0;

  for (const m of missing) {
    try {
      // Generate SEO description based on name and year
      const description = generateDescription(m.name, m.year_released || '2012');

      await prisma.minifigCatalog.update({
        where: { minifigure_no: m.minifigure_no },
        data: {
          description_en: description,
          description_generated_at: new Date(),
          description_status: 'completed'
        }
      });

      saved++;
      if (saved % 50 === 0) {
        console.log(`✅ Progress: ${saved}/${missing.length} saved`);
      }
    } catch (err) {
      console.error(`❌ ${m.minifigure_no}: Failed`);
      failed++;
    }
  }

  console.log(`\n🎉 Complete! Saved: ${saved}, Failed: ${failed}`);
  await prisma.$disconnect();
}

function generateDescription(name: string, year: string): string {
  // Extract character name and outfit details from the full name
  const parts = name.split(' - ');
  const characterFull = parts[0].replace('Friends ', '');
  const outfit = parts[1] || '';

  // Generate a standard SEO description
  return `This LEGO Friends ${characterFull} minifigure${outfit ? ` features ${outfit.toLowerCase()}` : ''}, released in ${year} as part of the Friends collection. This mini-doll figure showcases the distinctive LEGO Friends styling with detailed clothing prints and accessories that made the theme popular among collectors. ${characterFull} represents the diverse cast of Heartlake City residents, allowing builders to create populated scenes and storylines. This minifigure works perfectly in Friends themed sets and displays, helping collectors build complete character collections and realistic community scenarios throughout the Heartlake City universe.`;
}

generateBulk();
