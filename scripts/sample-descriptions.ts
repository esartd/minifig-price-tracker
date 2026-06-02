import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function sampleDescriptions() {
  console.log('Sampling descriptions from database...\n');

  // Get 5 random minifigs WITH descriptions
  const withDesc = await prisma.minifigCatalog.findMany({
    where: {
      description_en: { not: null }
    },
    take: 5,
    select: {
      minifigure_no: true,
      name: true,
      category_name: true,
      description_en: true,
    }
  });

  console.log('=== 5 Random Minifigs WITH Descriptions ===\n');
  withDesc.forEach(m => {
    console.log(`${m.minifigure_no} - ${m.name}`);
    console.log(`Category: ${m.category_name}`);
    console.log(`Description: ${m.description_en?.substring(0, 200)}...`);
    console.log('');
  });

  // Get minifigs WITHOUT descriptions
  const withoutDesc = await prisma.minifigCatalog.findMany({
    where: {
      description_en: null
    },
    select: {
      minifigure_no: true,
      name: true,
      category_name: true,
    }
  });

  console.log(`\n=== ${withoutDesc.length} Minifigs WITHOUT Descriptions ===\n`);
  withoutDesc.forEach(m => {
    console.log(`${m.minifigure_no} - ${m.name} (${m.category_name})`);
  });

  await prisma.$disconnect();
}

sampleDescriptions().catch(console.error);
