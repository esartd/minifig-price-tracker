import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

// Generate descriptions for ALL remaining minifigs across all categories
async function generateAll() {
  const categories = await prisma.minifigCatalog.groupBy({
    by: ['category_name'],
    where: {
      OR: [
        { description_en: null },
        { description_en: '' }
      ]
    },
    _count: true,
    orderBy: {
      _count: {
        minifigure_no: 'desc'
      }
    }
  });

  console.log(`\n📊 Found ${categories.length} categories needing descriptions\n`);

  let totalSaved = 0;

  for (const cat of categories) {
    console.log(`\n📝 Processing ${cat.category_name} (${cat._count} minifigs)...`);

    const missing = await prisma.minifigCatalog.findMany({
      where: {
        category_name: cat.category_name,
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

    let catSaved = 0;
    for (const m of missing) {
      try {
        const description = generateDescription(m.name, m.year_released || 'unknown year', cat.category_name);

        await prisma.minifigCatalog.update({
          where: { minifigure_no: m.minifigure_no },
          data: {
            description_en: description,
            description_generated_at: new Date(),
            description_status: 'completed'
          }
        });

        catSaved++;
        totalSaved++;

        if (catSaved % 100 === 0) {
          console.log(`  ✅ ${catSaved}/${missing.length} (${cat.category_name})`);
        }
      } catch (err) {
        console.error(`  ❌ ${m.minifigure_no}`);
      }
    }

    console.log(`✅ ${cat.category_name}: ${catSaved}/${missing.length} complete`);
  }

  console.log(`\n🎉 ALL CATEGORIES COMPLETE! Total saved: ${totalSaved}`);
  await prisma.$disconnect();
}

function generateDescription(name: string, year: string, category: string): string {
  return `This LEGO ${name} minifigure from the ${category} theme was released in ${year}. This collectible LEGO minifigure features detailed printing, authentic accessories, and character-specific design elements that make it valuable for collectors and builders. The figure represents LEGO's commitment to quality character design within the ${category} universe. Perfect for collectors building themed displays, completing character sets, or recreating scenes from their favorite ${category} sets, this minifigure brings personality and storytelling possibilities to any LEGO collection.`;
}

generateAll();
