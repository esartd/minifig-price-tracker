import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function check() {
  try {
    const total = await prisma.minifigCatalog.count();
    const withDesc = await prisma.minifigCatalog.count({
      where: {
        description_en: { not: null },
        description_en: { not: '' }
      }
    });
    const pending = await prisma.minifigCatalog.count({
      where: { description_status: 'pending' }
    });
    const completed = await prisma.minifigCatalog.count({
      where: { description_status: 'completed' }
    });

    console.log(`\n📊 Minifig Description Progress:\n`);
    console.log(`Total minifigs: ${total}`);
    console.log(`With descriptions: ${withDesc} (${(withDesc/total*100).toFixed(1)}%)`);
    console.log(`Status - Pending: ${pending}`);
    console.log(`Status - Completed: ${completed}`);
    console.log(`Missing: ${total - withDesc}\n`);

    // Check categories
    const starWars = await prisma.minifigCatalog.count({
      where: {
        category_name: 'Star Wars',
        description_en: { not: null }
      }
    });
    const superHeroes = await prisma.minifigCatalog.count({
      where: {
        category_name: 'Super Heroes',
        description_en: { not: null }
      }
    });

    console.log(`Category breakdown:`);
    console.log(`- Star Wars: ${starWars} with descriptions`);
    console.log(`- Super Heroes: ${superHeroes} with descriptions\n`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
