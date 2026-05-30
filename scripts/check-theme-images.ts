import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking theme images in database...\n');

  const themes = await prisma.$queryRaw<Array<{ category_name: string }>>`
    SELECT DISTINCT category_name
    FROM "MinifigCatalog"
    ORDER BY category_name
  `;

  console.log(`📊 Total themes/categories: ${themes.length}\n`);

  // Check minifig images
  const totalMinifigs = await prisma.minifigCatalog.count();
  console.log(`\n📷 Total minifigs in catalog: ${totalMinifigs}`);

  // Check set images
  const totalSets = await prisma.legoBoxes.count();
  console.log(`📦 Total sets in catalog: ${totalSets}`);

  // Check if image URLs in database are from Bricklink or Blob
  const sampleMinifig = await prisma.minifigCache.findFirst();
  if (sampleMinifig) {
    console.log(`\n🔗 Sample minifig image URL: ${sampleMinifig.image_url}`);
  }

  const sampleSet = await prisma.legoBoxes.findFirst({
    where: { image_url: { not: null } }
  });
  if (sampleSet) {
    console.log(`🔗 Sample set image URL: ${sampleSet.image_url}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
