import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function checkRange() {
  console.log('Checking database for Star Wars minifig records...\n');

  // Find highest sw number
  const highestSW = await prisma.minifigCatalog.findFirst({
    where: {
      minifigure_no: {
        startsWith: 'sw'
      }
    },
    orderBy: {
      minifigure_no: 'desc'
    },
    select: {
      minifigure_no: true,
      name: true
    }
  });

  console.log('Highest SW minifig:', highestSW);

  // Count total SW records
  const swCount = await prisma.minifigCatalog.count({
    where: {
      minifigure_no: {
        startsWith: 'sw'
      }
    }
  });

  console.log('Total SW minifigs in database:', swCount);

  // Check specific records after sw0668
  const testRecords = ['sw0669', 'sw0675', 'sw0700', 'sw0800', 'sw0900', 'sw1000'];

  console.log('\nTesting specific records:');
  for (const minifigNo of testRecords) {
    const exists = await prisma.minifigCatalog.findUnique({
      where: { minifigure_no: minifigNo },
      select: { minifigure_no: true, name: true }
    });
    console.log(`  ${minifigNo}: ${exists ? `✓ ${exists.name}` : '✗ Not found'}`);
  }

  // Find records without descriptions
  const needsDescription = await prisma.minifigCatalog.count({
    where: {
      minifigure_no: {
        startsWith: 'sw'
      },
      OR: [
        { description_en: null },
        { description_en: '' }
      ]
    }
  });

  console.log('\nSW minifigs needing descriptions:', needsDescription);

  await prisma.$disconnect();
}

checkRange();
