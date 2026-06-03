import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function analyze() {
  try {
    // Get top categories by count
    const categories = await prisma.minifigCatalog.groupBy({
      by: ['category_name'],
      _count: {
        minifigure_no: true
      },
      orderBy: {
        _count: {
          minifigure_no: 'desc'
        }
      },
      take: 20
    });

    console.log('\n📊 Top 20 Minifig Categories by Count:\n');

    for (const cat of categories) {
      const withDesc = await prisma.minifigCatalog.count({
        where: {
          category_name: cat.category_name,
          description_en: { not: null },
          description_en: { not: '' }
        }
      });

      const total = cat._count.minifigure_no;
      const percentage = ((withDesc / total) * 100).toFixed(1);
      const missing = total - withDesc;

      console.log(`${cat.category_name.padEnd(35)} ${total.toString().padStart(5)} total | ${withDesc.toString().padStart(4)} desc (${percentage.padStart(5)}%) | ${missing.toString().padStart(5)} missing`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyze();
