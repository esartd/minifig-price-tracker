#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || process.env.HOSTINGER_DATABASE_URL
});

async function main() {
  const totalMinifigs = await prisma.minifigCatalog.count();
  const minifigsWithDescriptions = await prisma.minifigCatalog.count({
    where: { description_en: { not: null } }
  });

  const totalSets = await prisma.setsCatalog.count();
  const setsWithDescriptions = await prisma.setsCatalog.count({
    where: { description_en: { not: null } }
  });

  console.log('📊 Database Status:');
  console.log('\nMinifigs:');
  console.log(`  Total: ${totalMinifigs}`);
  console.log(`  With descriptions: ${minifigsWithDescriptions}`);
  console.log(`  Need descriptions: ${totalMinifigs - minifigsWithDescriptions}`);

  console.log('\nSets:');
  console.log(`  Total: ${totalSets}`);
  console.log(`  With descriptions: ${setsWithDescriptions}`);
  console.log(`  Need descriptions: ${totalSets - setsWithDescriptions}`);

  await prisma.$disconnect();
}

main().catch(console.error);
