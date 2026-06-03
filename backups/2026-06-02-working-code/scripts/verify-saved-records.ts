import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function verifyRecords() {
  const testRecords = ['sw0098', 'sw0112', 'sw0185', 'sw0186'];

  console.log('Checking if records exist in database:\n');

  for (const minifigNo of testRecords) {
    const record = await prisma.minifigCatalog.findUnique({
      where: { minifigure_no: minifigNo },
      select: {
        minifigure_no: true,
        name: true,
        description_en: true,
        description_status: true
      }
    });

    if (record) {
      console.log(`✓ ${minifigNo}: ${record.name}`);
      console.log(`  Description: ${record.description_en ? record.description_en.substring(0, 80) + '...' : 'NULL'}`);
      console.log(`  Status: ${record.description_status || 'NULL'}\n`);
    } else {
      console.log(`✗ ${minifigNo}: NOT FOUND IN DATABASE\n`);
    }
  }

  await prisma.$disconnect();
}

verifyRecords();
