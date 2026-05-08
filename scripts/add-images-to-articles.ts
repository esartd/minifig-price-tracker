import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';

async function addImagesToArticle(slug: string, imageInsertions: Array<{ heading: string; image: any; position: 'before' | 'after' }>) {
  console.log(`\n📝 Processing: ${slug}`);

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    console.log(`❌ Article not found: ${slug}`);
    return;
  }

  const contentBlocks = JSON.parse(article.contentBlocks as string);
  const updatedBlocks: any[] = [];
  let addedCount = 0;

  for (let i = 0; i < contentBlocks.length; i++) {
    const block = contentBlocks[i];

    // Check if we should add an image before this block
    for (const insertion of imageInsertions) {
      if (insertion.position === 'before' &&
          block.type === 'heading' &&
          block.text?.includes(insertion.heading)) {
        updatedBlocks.push(insertion.image);
        addedCount++;
        console.log(`  ✅ Added image before: ${insertion.heading}`);
      }
    }

    updatedBlocks.push(block);

    // Check if we should add an image after this block
    for (const insertion of imageInsertions) {
      if (insertion.position === 'after' &&
          block.type === 'heading' &&
          block.text?.includes(insertion.heading)) {
        updatedBlocks.push(insertion.image);
        addedCount++;
        console.log(`  ✅ Added image after: ${insertion.heading}`);
      }
    }
  }

  if (addedCount > 0) {
    await prisma.article.update({
      where: { slug },
      data: { contentBlocks: JSON.stringify(updatedBlocks) }
    });
    console.log(`  ✅ Updated with ${addedCount} images`);
  } else {
    console.log(`  ⚠️  No images added (headings not found)`);
  }
}

async function main() {
  console.log('\n🖼️  Adding images to articles...\n');

  // 1. Most Valuable Minifigs - collector/investment focus
  await addImagesToArticle('most-valuable-lego-minifigures-2026', [
    {
      heading: 'What Makes a Minifigure Valuable',
      position: 'after',
      image: {
        id: `img-valuable-hero-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'lego-sorting',
          imageUrl: `${baseUrl}/uploads/articles/lego-sorting-hero.jpg`,
          alt: 'Organized LEGO minifigures collection',
          caption: 'Valuable minifigures require careful organization and storage',
        }],
        columns: 1,
      }
    },
    {
      heading: 'How to Price Your Own Collection',
      position: 'before',
      image: {
        id: `img-valuable-pricing-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'laptop-data',
          imageUrl: `${baseUrl}/uploads/articles/laptop-data-man.jpg`,
          alt: 'Analyzing LEGO pricing data',
          caption: 'Research market data to accurately price your collection',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Where to Buy and Sell',
      position: 'before',
      image: {
        id: `img-valuable-decision-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'decision-making',
          imageUrl: `${baseUrl}/uploads/articles/decision-making-woman.jpg`,
          alt: 'Choosing where to sell valuable LEGO',
          caption: 'Selecting the right marketplace affects your returns',
        }],
        columns: 1,
      }
    },
  ]);

  // 2. How to Price Minifigs - pricing/selling focus
  await addImagesToArticle('how-to-price-lego-minifigures', [
    {
      heading: 'Understanding Bricklink Price Data',
      position: 'after',
      image: {
        id: `img-pricing-data-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'laptop-data-pricing',
          imageUrl: `${baseUrl}/uploads/articles/laptop-data-man.jpg`,
          alt: 'Analyzing Bricklink marketplace data',
          caption: 'Understanding Bricklink data is key to accurate pricing',
        }],
        columns: 1,
      }
    },
    {
      heading: 'How to Price: Step-by-Step',
      position: 'before',
      image: {
        id: `img-pricing-mobile-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'mobile-pricing',
          imageUrl: `${baseUrl}/uploads/articles/mobile-pricing-woman.jpg`,
          alt: 'Using mobile app for LEGO pricing',
          caption: 'Price your minifigures quickly with mobile-first tools',
        }],
        columns: 1,
      }
    },
    {
      heading: 'How FigTracker Simplifies Pricing',
      position: 'before',
      image: {
        id: `img-pricing-happy-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'happy-mobile',
          imageUrl: `${baseUrl}/uploads/articles/happy-mobile-user.jpg`,
          alt: 'Happy user using pricing app',
          caption: 'Skip manual calculations with instant pricing tools',
        }],
        columns: 1,
      }
    },
  ]);

  // 3. Selling on Bricklink - marketplace/seller focus
  await addImagesToArticle('selling-lego-on-bricklink', [
    {
      heading: 'Why Sell on Bricklink',
      position: 'after',
      image: {
        id: `img-selling-desktop-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'bricklink-desktop',
          imageUrl: `${baseUrl}/uploads/articles/bricklink-desktop-user.jpg`,
          alt: 'User browsing Bricklink marketplace',
          caption: 'Bricklink connects you with serious LEGO buyers worldwide',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Adding Inventory: The Right Way',
      position: 'before',
      image: {
        id: `img-selling-sorting-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'lego-sorting-selling',
          imageUrl: `${baseUrl}/uploads/articles/lego-sorting-hero.jpg`,
          alt: 'Organized LEGO inventory',
          caption: 'Proper inventory management starts with organization',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Growing Your Bricklink Business',
      position: 'before',
      image: {
        id: `img-selling-builder-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'lego-builder',
          imageUrl: `${baseUrl}/uploads/articles/lego-builder-hero.jpg`,
          alt: 'Building a LEGO business',
          caption: 'Scale your Bricklink store with smart strategies',
        }],
        columns: 1,
      }
    },
  ]);

  // 4. Grading Guide - condition/quality focus
  await addImagesToArticle('how-to-grade-lego-condition', [
    {
      heading: 'The Standard LEGO Condition Grading Scale',
      position: 'after',
      image: {
        id: `img-grading-sorting-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'lego-sorting-grade',
          imageUrl: `${baseUrl}/uploads/articles/lego-sorting-hero.jpg`,
          alt: 'LEGO sorted by condition',
          caption: 'Organize your LEGO by condition for accurate grading',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Grading Minifigures: What Actually Affects Value',
      position: 'before',
      image: {
        id: `img-grading-builder-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'lego-builder-grade',
          imageUrl: `${baseUrl}/uploads/articles/lego-builder-hero.jpg`,
          alt: 'Inspecting LEGO minifigures',
          caption: 'Carefully inspect each minifigure for defects',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Using FigTracker for Condition-Specific Pricing',
      position: 'before',
      image: {
        id: `img-grading-mobile-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'mobile-couch',
          imageUrl: `${baseUrl}/uploads/articles/mobile-couch-woman.jpg`,
          alt: 'Pricing LEGO by condition',
          caption: 'Get instant condition-specific pricing with FigTracker',
        }],
        columns: 1,
      }
    },
  ]);

  console.log('\n✅ All images added!\n');
  await prisma.$disconnect();
}

main().catch(console.error);
