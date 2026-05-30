import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function checkMickey() {
  const mickey = await prisma.minifigCatalog.findUnique({
    where: { minifigure_no: 'dis012' },
    select: {
      minifigure_no: true,
      name: true,
      description_en: true,
      description_de: true,
      description_fr: true,
      description_es: true,
    }
  });

  console.log('Mickey Mouse (dis012) in database:');
  console.log(JSON.stringify(mickey, null, 2));

  await prisma.$disconnect();
}

checkMickey().catch(console.error);
