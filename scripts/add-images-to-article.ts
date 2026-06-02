import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

async function main() {
  console.log('📝 Adding images to BrickEconomy article...\n');

  const slug = 'figtracker-vs-brickeconomy';

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    console.error('❌ Article not found');
    process.exit(1);
  }

  const contentBlocks = JSON.parse(article.contentBlocks as string);

  // Add hero image at the beginning (after first paragraph)
  const heroImage = {
    id: `block-hero-${Date.now()}`,
    type: 'image',
    images: [{
      imageId: 'hero-1',
      imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80',
      alt: 'LEGO minifigures collection organization',
      caption: 'Managing your LEGO collection with accurate pricing data',
    }],
    columns: 1,
  };

  // Add comparison visualization image
  const comparisonImage = {
    id: `block-comparison-${Date.now()}`,
    type: 'image',
    images: [{
      imageId: 'comparison-1',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      alt: 'Data analysis and pricing comparison',
      caption: 'Real sold data vs listing prices - the key difference',
    }],
    columns: 1,
  };

  // Add mobile experience image
  const mobileImage = {
    id: `block-mobile-${Date.now()}`,
    type: 'image',
    images: [{
      imageId: 'mobile-1',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
      alt: 'Mobile device showing modern interface',
      caption: 'Clean, modern mobile interface for pricing on the go',
    }],
    columns: 1,
  };

  // Insert images at strategic positions
  const updatedBlocks = [];

  for (let i = 0; i < contentBlocks.length; i++) {
    const block = contentBlocks[i];

    // Add hero image after introduction (after block 2)
    if (i === 2) {
      updatedBlocks.push(heroImage);
    }

    // Add comparison image before comparison block
    if (block.type === 'comparison') {
      updatedBlocks.push(comparisonImage);
    }

    // Add mobile image before "Clean, Modern Mobile Experience" heading
    if (block.type === 'heading' && block.text === 'Clean, Modern Mobile Experience') {
      updatedBlocks.push(mobileImage);
    }

    updatedBlocks.push(block);
  }

  await prisma.article.update({
    where: { slug },
    data: {
      contentBlocks: JSON.stringify(updatedBlocks)
    }
  });

  console.log('✅ Images added successfully!');
  console.log(`   - Hero image at top`);
  console.log(`   - Comparison visualization`);
  console.log(`   - Mobile interface image`);
  console.log('\nImages are from Unsplash (free to use, no attribution required)');
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
