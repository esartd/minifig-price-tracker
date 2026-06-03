import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

// Bulk generate descriptions for all Town category minifigs
const TOWN_CATEGORIES = [
  'Town / City',
  'Town / Classic Town',
  'Town',
  'Town / City / Police',
  'Town / City / Fire'
];

async function generateBulk() {
  for (const category of TOWN_CATEGORIES) {
    console.log(`\n📝 Processing ${category}...\n`);

    const missing = await prisma.minifigCatalog.findMany({
      where: {
        category_name: category,
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

    console.log(`Found ${missing.length} minifigs in ${category}`);

    let saved = 0;
    for (const m of missing) {
      try {
        const description = generateDescription(m.name, m.year_released || 'unknown', category);

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
          console.log(`  ✅ ${saved}/${missing.length} saved`);
        }
      } catch (err) {
        console.error(`  ❌ ${m.minifigure_no}: Failed`);
      }
    }

    console.log(`✅ ${category}: ${saved} descriptions saved`);
  }

  console.log(`\n🎉 All Town categories complete!`);
  await prisma.$disconnect();
}

function generateDescription(name: string, year: string, category: string): string {
  const subcategory = category.includes('Police') ? 'police officer' :
                      category.includes('Fire') ? 'firefighter' :
                      'city resident';

  return `This LEGO ${name} minifigure was released in ${year} as part of the ${category} theme. This classic LEGO minifigure represents a ${subcategory} with authentic uniform details and accessories that made the Town theme iconic among collectors. The detailed printing and character design reflect LEGO's commitment to realistic city building and community role-play. This figure is valuable for collectors building complete Town and City displays, perfect for creating populated urban scenes with emergency services, municipal workers, and everyday citizens that bring LEGO cities to life.`;
}

generateBulk();
