import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const duplicateImages = [
  'lego-sorting-hero.jpg',
  'laptop-data-man.jpg',
  'decision-making-woman.jpg',
  'bricklink-desktop-user.jpg',
  'lego-builder-hero.jpg',
  'mobile-pricing-woman.jpg',
  'happy-mobile-user.jpg',
  'mobile-couch-woman.jpg',
];

async function removeDuplicateImages(slug: string) {
  console.log(`\n📝 Processing: ${slug}`);

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    console.log(`❌ Article not found: ${slug}`);
    return;
  }

  const contentBlocks = JSON.parse(article.contentBlocks as string);

  // Filter out image blocks that use duplicate images
  const cleanedBlocks = contentBlocks.filter((block: any) => {
    if (block.type !== 'image') return true;

    // Check if any image in this block uses a duplicate image
    const hasDuplicate = block.images?.some((img: any) =>
      duplicateImages.some(dupImg => img.imageUrl?.includes(dupImg))
    );

    return !hasDuplicate;
  });

  const removedCount = contentBlocks.length - cleanedBlocks.length;

  if (removedCount > 0) {
    await prisma.article.update({
      where: { slug },
      data: { contentBlocks: JSON.stringify(cleanedBlocks) }
    });
    console.log(`  ✅ Removed ${removedCount} duplicate images`);
  } else {
    console.log(`  ℹ️  No duplicate images found`);
  }
}

async function main() {
  console.log('\n🧹 Removing duplicate images from articles...\n');

  await removeDuplicateImages('most-valuable-lego-minifigures-2026');
  await removeDuplicateImages('how-to-price-lego-minifigures');
  await removeDuplicateImages('selling-lego-on-bricklink');
  await removeDuplicateImages('how-to-grade-lego-condition');

  console.log('\n✅ All duplicate images removed!\n');
  await prisma.$disconnect();
}

main().catch(console.error);
