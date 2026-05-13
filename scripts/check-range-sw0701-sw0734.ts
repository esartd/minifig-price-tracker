import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function check() {
  const minifigs = await prisma.minifigCatalog.findMany({
    where: {
      minifigure_no: {
        gte: 'sw0701',
        lte: 'sw0734'
      }
    },
    select: {
      minifigure_no: true,
      name: true,
      description_status: true
    },
    orderBy: { minifigure_no: 'asc' }
  });

  console.log('Minifigs sw0701-sw0734:');
  minifigs.forEach(m => console.log(`${m.minifigure_no}: ${m.name} - Status: ${m.description_status || 'none'}`));
  console.log(`\nTotal: ${minifigs.length}`);

  const midpoint = Math.ceil(minifigs.length / 2);
  console.log(`\nPart 1: ${minifigs[0].minifigure_no} to ${minifigs[midpoint - 1].minifigure_no} (${midpoint} minifigs)`);
  console.log(`Part 2: ${minifigs[midpoint].minifigure_no} to ${minifigs[minifigs.length - 1].minifigure_no} (${minifigs.length - midpoint} minifigs)`);

  await prisma.$disconnect();
}

check();
