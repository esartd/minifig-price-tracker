import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

async function cleanDuplicates(slug: string) {
  console.log(`\n📝 Processing: ${slug}`);

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    console.log(`❌ Article not found: ${slug}`);
    return;
  }

  const contentBlocks = JSON.parse(article.contentBlocks as string);

  // Track which images we've seen
  const seenImages = new Set<string>();
  const cleanedBlocks: any[] = [];

  for (const block of contentBlocks) {
    if (block.type === 'image') {
      const imageUrl = block.images?.[0]?.imageUrl;

      // Only keep first occurrence of each unique image
      if (imageUrl && !seenImages.has(imageUrl)) {
        seenImages.add(imageUrl);
        cleanedBlocks.push(block);
        console.log(`  ✅ Kept: ${imageUrl.split('/').pop()}`);
      } else {
        console.log(`  ❌ Removed duplicate: ${imageUrl?.split('/').pop()}`);
      }
    } else {
      cleanedBlocks.push(block);
    }
  }

  const removedCount = contentBlocks.length - cleanedBlocks.length;

  if (removedCount > 0) {
    await prisma.article.update({
      where: { slug },
      data: { contentBlocks: JSON.stringify(cleanedBlocks) }
    });
    console.log(`  ✅ Removed ${removedCount} duplicate image blocks`);
  } else {
    console.log(`  ℹ️  No duplicates found`);
  }
}

async function main() {
  console.log('\n🧹 Cleaning duplicate image blocks...\n');

  await cleanDuplicates('most-valuable-lego-minifigures-2026');
  await cleanDuplicates('how-to-price-lego-minifigures');
  await cleanDuplicates('selling-lego-on-bricklink');
  await cleanDuplicates('how-to-grade-lego-condition');

  console.log('\n✅ All duplicates cleaned!\n');
  await prisma.$disconnect();
}

main().catch(console.error);
