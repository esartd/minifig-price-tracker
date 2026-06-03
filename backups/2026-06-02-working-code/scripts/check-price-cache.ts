import { prismaPublic } from '../lib/prisma';

async function main() {
  const count = await prisma.priceCache.count();
  const sample = await prisma.priceCache.findMany({ take: 5 });
  console.log('Total price cache entries:', count);
  console.log('Sample entries:', JSON.stringify(sample, null, 2));
  await prismaPublic.$disconnect();
}

main();
