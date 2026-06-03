import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';

// Image downloads from Unsplash (using official API format)
const imagesToDownload = [
  // Most Valuable Minifigures
  { id: 'NX1RGwxivoY', filename: 'lego-collection-display.jpg', photographer: 'Barry Talley' },
  { id: 'eveI7MOcSmw', filename: 'data-research-macbook.jpg', photographer: 'Myriam Jessier' },
  { id: 'Q59HmzK38eQ', filename: 'online-payment-laptop.jpg', photographer: 'rupixen' },

  // How to Price Minifigures
  { id: 'JKUTrJ4vK00', filename: 'performance-analytics-laptop.jpg', photographer: 'Luke Chesser' },
  { id: 'yx17UuZw1Ck', filename: 'quality-inspector-checking.jpg', photographer: 'Mediamodifier' },
  { id: 'cqFKhqv6Ong', filename: 'person-using-smartphone.jpg', photographer: 'Rob Hampson' },

  // Selling on Bricklink
  { id: 'jpQs15STZZ4', filename: 'ecommerce-shipping-cart.jpg', photographer: 'Mediamodifier' },
  { id: 'K5ogQTtLb7s', filename: 'labeled-storage-drawers.jpg', photographer: 'Jaclyn Baxter' },
  { id: 'hpjSkU2UYSU', filename: 'business-growth-chart.jpg', photographer: 'Carlos Muza' },

  // How to Grade Condition
  { id: 'kn-UmDZQDjM', filename: 'lego-blocks-colorful.jpg', photographer: 'Xavi Cabrera' },
  { id: 'EA7QL-GJWRM', filename: 'measuring-inspection.jpg', photographer: 'TECNIC Bioprocess Solutions' },
  { id: 'Y3LGWCsrgmg', filename: 'android-smartphone-hand.jpg', photographer: 'Daniel Korpai' },
];

async function downloadImage(imageId: string, filename: string): Promise<void> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'articles');

  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);

  // Skip if already exists and has content
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 100000) {
    console.log(`  ⏭️  Skipping ${filename} (already exists)`);
    return;
  }

  // Download from Unsplash using curl
  const url = `https://unsplash.com/photos/${imageId}/download?force=true`;

  console.log(`  📥 Downloading ${filename}...`);

  try {
    execSync(`curl -sL "${url}" -o "${filePath}"`, { stdio: 'inherit' });

    const size = fs.statSync(filePath).size;
    if (size < 10000) {
      throw new Error(`File too small: ${size} bytes`);
    }
    console.log(`  ✅ Downloaded ${filename} (${Math.round(size / 1024)}KB)`);
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
}

async function addImagesToArticle(
  slug: string,
  imageInsertions: Array<{ heading: string; image: any; position: 'before' | 'after' }>
) {
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
  console.log('\n📥 Downloading images from Unsplash...\n');

  // Download all images first
  for (const img of imagesToDownload) {
    try {
      await downloadImage(img.id, img.filename);
    } catch (error) {
      console.error(`  ❌ Failed to download ${img.filename}:`, error);
    }
  }

  console.log('\n🖼️  Adding images to articles...\n');

  // 1. Most Valuable Minifigures - collector/investment focus
  await addImagesToArticle('most-valuable-lego-minifigures-2026', [
    {
      heading: 'What Makes a Minifigure Valuable',
      position: 'after',
      image: {
        id: `img-valuable-collection-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'lego-collection-display',
          imageUrl: `${baseUrl}/uploads/articles/lego-collection-display.jpg`,
          alt: 'Organized LEGO minifigures collection display',
          caption: 'Valuable minifigures require proper organization and display',
        }],
        columns: 1,
      }
    },
    {
      heading: 'How to Price Your Own Collection',
      position: 'before',
      image: {
        id: `img-valuable-research-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'data-research-macbook',
          imageUrl: `${baseUrl}/uploads/articles/data-research-macbook.jpg`,
          alt: 'Researching LEGO minifigure values and market data',
          caption: 'Research current market values to price your collection accurately',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Where to Buy and Sell',
      position: 'before',
      image: {
        id: `img-valuable-selling-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'online-payment-laptop',
          imageUrl: `${baseUrl}/uploads/articles/online-payment-laptop.jpg`,
          alt: 'Selling LEGO minifigures online with digital payment',
          caption: 'Choose the right marketplace for maximum returns',
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
        id: `img-pricing-analytics-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'performance-analytics-laptop',
          imageUrl: `${baseUrl}/uploads/articles/performance-analytics-laptop.jpg`,
          alt: 'Analyzing Bricklink marketplace pricing analytics',
          caption: 'Understanding price data is crucial for accurate pricing',
        }],
        columns: 1,
      }
    },
    {
      heading: 'How to Price: Step-by-Step',
      position: 'before',
      image: {
        id: `img-pricing-inspection-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'quality-inspector-checking',
          imageUrl: `${baseUrl}/uploads/articles/quality-inspector-checking.jpg`,
          alt: 'Inspecting LEGO minifigure condition for pricing',
          caption: 'Carefully assess condition before setting your price',
        }],
        columns: 1,
      }
    },
    {
      heading: 'How FigTracker Simplifies Pricing',
      position: 'before',
      image: {
        id: `img-pricing-smartphone-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'person-using-smartphone',
          imageUrl: `${baseUrl}/uploads/articles/person-using-smartphone.jpg`,
          alt: 'Using mobile app for instant LEGO pricing',
          caption: 'Get instant pricing with mobile-first tools like FigTracker',
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
        id: `img-selling-ecommerce-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'ecommerce-shipping-cart',
          imageUrl: `${baseUrl}/uploads/articles/ecommerce-shipping-cart.jpg`,
          alt: 'Setting up e-commerce for LEGO sales',
          caption: 'Bricklink provides a complete marketplace for LEGO sellers',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Adding Inventory: The Right Way',
      position: 'before',
      image: {
        id: `img-selling-storage-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'labeled-storage-drawers',
          imageUrl: `${baseUrl}/uploads/articles/labeled-storage-drawers.jpg`,
          alt: 'Organizing LEGO inventory with labeled storage',
          caption: 'Proper inventory organization is essential for efficient sales',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Growing Your Bricklink Business',
      position: 'before',
      image: {
        id: `img-selling-growth-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'business-growth-chart',
          imageUrl: `${baseUrl}/uploads/articles/business-growth-chart.jpg`,
          alt: 'Growing successful LEGO reselling business',
          caption: 'Scale your Bricklink store with proven growth strategies',
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
        id: `img-grading-blocks-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'lego-blocks-colorful',
          imageUrl: `${baseUrl}/uploads/articles/lego-blocks-colorful.jpg`,
          alt: 'LEGO blocks showing different pieces and colors',
          caption: 'Learn to assess each LEGO piece by standardized criteria',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Grading Minifigures: What Actually Affects Value',
      position: 'before',
      image: {
        id: `img-grading-measuring-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'measuring-inspection',
          imageUrl: `${baseUrl}/uploads/articles/measuring-inspection.jpg`,
          alt: 'Detailed inspection and measuring for quality assessment',
          caption: 'Carefully inspect minifigures for defects that affect value',
        }],
        columns: 1,
      }
    },
    {
      heading: 'Using FigTracker for Condition-Specific Pricing',
      position: 'before',
      image: {
        id: `img-grading-android-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'android-smartphone-hand',
          imageUrl: `${baseUrl}/uploads/articles/android-smartphone-hand.jpg`,
          alt: 'Using smartphone app for condition-based pricing',
          caption: 'Get instant condition-specific pricing with FigTracker',
        }],
        columns: 1,
      }
    },
  ]);

  console.log('\n✅ All unique images added!\n');
  await prisma.$disconnect();
}

main().catch(console.error);
