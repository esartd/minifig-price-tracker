import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function checkDescriptions() {
  console.log('Checking if flagship descriptions actually exist in database...\n');

  // Check a few flagship minifigs that we supposedly updated
  const testIds = [
    'sh0270', // User said this is Kraven (we wrote Star-Lord desc)
    'sh0167', // User said this is Iron Man Mark 43 (we wrote Thanos desc)
    'min001', // Should be Creeper (we wrote Creeper desc - AFTER fix)
    'min002', // Should be Steve (we wrote Steve desc - AFTER fix)
    'dis012', // Should be Mickey Mouse
  ];

  for (const id of testIds) {
    const minifig = await prisma.minifigCatalog.findUnique({
      where: { minifigure_no: id },
      select: {
        minifigure_no: true,
        name: true,
        description_en: true,
      }
    });

    console.log(`\n${id}:`);
    if (!minifig) {
      console.log('  ❌ NOT FOUND IN DATABASE');
    } else {
      console.log(`  Name: ${minifig.name}`);
      if (minifig.description_en) {
        console.log(`  Description exists: ${minifig.description_en.substring(0, 100)}...`);
      } else {
        console.log(`  ❌ NO DESCRIPTION (null)`);
      }
    }
  }

  console.log('\n\n---\n');

  // Count total minifigs with descriptions
  const withDesc = await prisma.minifigCatalog.count({
    where: {
      description_en: { not: null }
    }
  });

  const total = await prisma.minifigCatalog.count();

  console.log(`Total minifigs in database: ${total}`);
  console.log(`Minifigs with English descriptions: ${withDesc}`);
  console.log(`Percentage: ${((withDesc / total) * 100).toFixed(2)}%`);

  await prisma.$disconnect();
}

checkDescriptions().catch(console.error);
