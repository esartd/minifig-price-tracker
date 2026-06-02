import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function findMissing() {
  console.log('Finding SW minifigs without descriptions...\n');

  const missingDescriptions = await prisma.minifigCatalog.findMany({
    where: {
      minifigure_no: {
        startsWith: 'sw'
      },
      OR: [
        { description_en: null },
        { description_en: '' }
      ]
    },
    select: {
      minifigure_no: true,
      name: true
    },
    orderBy: {
      minifigure_no: 'asc'
    }
  });

  console.log(`Found ${missingDescriptions.length} minifigs without descriptions:\n`);

  missingDescriptions.forEach(minifig => {
    console.log(`${minifig.minifigure_no}: ${minifig.name}`);
  });

  await prisma.$disconnect();
}

findMissing();
