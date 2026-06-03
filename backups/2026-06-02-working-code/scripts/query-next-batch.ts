import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function query() {
  // Check main numbered sequence (sw0648, sw0649, etc.)
  const mainSequence = await prisma.minifigCatalog.findMany({
    where: {
      minifigure_no: {
        startsWith: 'sw',
        gte: 'sw0648',
        lte: 'sw0750'
      },
      description_en: null
    },
    orderBy: { minifigure_no: 'asc' },
    take: 100
  });

  console.log(`Main sequence (sw0648-sw0750) without descriptions: ${mainSequence.length}`);
  if (mainSequence.length > 0) {
    console.log('\nFirst 20:');
    mainSequence.slice(0, 20).forEach(m => console.log(`${m.minifigure_no}: ${m.name}`));
  }

  // Check variant minifigs (with letters like sw0001a, sw0002b)
  const variants = await prisma.minifigCatalog.count({
    where: {
      minifigure_no: {
        startsWith: 'sw',
        contains: /[a-z]$/
      },
      description_en: null
    }
  });

  console.log(`\nVariant minifigs (with letters) without descriptions: ${variants}`);

  await prisma.$disconnect();
}

query();
