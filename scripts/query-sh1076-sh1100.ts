import { PrismaClient as PrismaClientHostinger } from '@prisma/client-hostinger';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
    }
  }
});

async function query() {
  const minifigs = await prisma.minifigCatalog.findMany({
    where: {
      minifigure_no: {
        gte: 'sh1076',
        lte: 'sh1100'
      }
    },
    orderBy: {
      minifigure_no: 'asc'
    },
    select: {
      minifigure_no: true,
      name: true
    }
  });

  console.log(JSON.stringify(minifigs, null, 2));
  await prisma.$disconnect();
}

query();
