import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function getMissing() {
  const category = process.argv[2] || 'Friends';
  const limit = parseInt(process.argv[3] || '50');

  const missing = await prisma.minifigCatalog.findMany({
    where: {
      category_name: category,
      OR: [
        { description_en: null },
        { description_en: '' }
      ]
    },
    select: {
      minifigure_no: true,
      name: true,
      category_name: true,
      year_released: true
    },
    take: limit,
    orderBy: {
      minifigure_no: 'asc'
    }
  });

  console.log(JSON.stringify(missing, null, 2));
  await prisma.$disconnect();
}

getMissing();
