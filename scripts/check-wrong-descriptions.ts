import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function checkIssues() {
  // Check the reported wrong minifigs
  const issues = [
    'sh0270', // Should be Star-Lord, user says it's Kraven
    'sh0167', // Should be Thanos, user says it's Iron Man Mark 43
    'mar0016', // Should be Goomba, user says it's Boo
  ];

  for (const id of issues) {
    const minifig = await prisma.minifigCatalog.findUnique({
      where: { minifigure_no: id },
      select: {
        minifigure_no: true,
        name: true,
        description_en: true,
      }
    });

    console.log(`\n${id}:`);
    console.log(`Name in DB: ${minifig?.name || 'NOT FOUND'}`);
    console.log(`Description: ${minifig?.description_en?.substring(0, 150) || 'NO DESCRIPTION'}...`);
  }

  await prisma.$disconnect();
}

checkIssues().catch(console.error);
