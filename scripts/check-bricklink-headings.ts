import { prisma } from '../lib/prisma';

async function checkHeadings() {
  const article = await prisma.article.findUnique({
    where: { slug: 'figtracker-vs-bricklink' }
  });

  if (!article) {
    console.log('Article not found');
    process.exit(1);
  }

  const blocks = JSON.parse(article.contentBlocks as string);

  console.log('\n=== Heading blocks in BrickLink article ===\n');
  blocks.forEach((block: any, i: number) => {
    if (block.type === 'heading') {
      console.log(`[${i}] H${block.level}: "${block.text}"`);
    }
  });

  console.log('\n=== Image blocks currently in article ===\n');
  blocks.forEach((block: any, i: number) => {
    if (block.type === 'image') {
      console.log(`[${i}] Image: ${block.images?.[0]?.imageUrl || 'unknown'}`);
      console.log(`    Alt: ${block.images?.[0]?.alt || 'unknown'}`);
    }
  });

  await prisma.$disconnect();
}

checkHeadings();
