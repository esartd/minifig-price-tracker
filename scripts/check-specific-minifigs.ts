#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function main() {
  // Sample from first link
  const checkList = [
    'cty1800', 'cty1653', 'cty1870', 'sw1080', 'sw1079', 'frnd0735',
    'njo1058', 'edu035', 'edu034', 'edi001'
  ];

  console.log('Checking sample minifigs from BrickLink catalog changes:\n');

  for (const no of checkList) {
    const exists = await prisma.minifigCatalog.findUnique({
      where: { minifigure_no: no },
      select: { minifigure_no: true, name: true }
    });

    if (exists) {
      console.log(`✅ ${no} - ${exists.name}`);
    } else {
      console.log(`❌ ${no} - NOT IN DATABASE`);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
