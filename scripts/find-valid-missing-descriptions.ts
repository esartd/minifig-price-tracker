import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function findValidMissing() {
  console.log('Finding minifigs that need descriptions AND exist in catalog JSON...\n');

  // Load catalog JSON
  const catalogData = await fs.readFile('public/catalog/minifigs.json', 'utf-8');
  const catalog = JSON.parse(catalogData);
  const catalogNumbers = new Set(catalog.map((m: any) => m.minifigure_no));

  // Find database records without descriptions
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

  console.log(`Database has ${missingDescriptions.length} SW minifigs without descriptions`);

  // Filter to only those that exist in catalog
  const validMissing = missingDescriptions.filter(m => catalogNumbers.has(m.minifigure_no));

  console.log(`Of those, ${validMissing.length} exist in catalog JSON and can be displayed:\n`);

  validMissing.forEach(minifig => {
    console.log(`${minifig.minifigure_no}: ${minifig.name}`);
  });

  console.log(`\n${missingDescriptions.length - validMissing.length} are in database but NOT in catalog (will be skipped)`);

  await prisma.$disconnect();
}

findValidMissing();
