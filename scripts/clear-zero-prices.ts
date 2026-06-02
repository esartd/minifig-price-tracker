import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearZeroPrices() {
  console.log('Connecting to database...');
  
  const result = await prisma.priceCache.deleteMany({
    where: {
      suggested_price: 0
    }
  });
  
  console.log(`✅ Deleted ${result.count} cached $0 prices`);
  
  await prisma.$disconnect();
}

clearZeroPrices().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
