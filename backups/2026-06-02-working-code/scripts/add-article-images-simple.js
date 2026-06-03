// Simple script to add images to article via direct database update
const mysql = require('mysql2/promise');

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker';

async function main() {
  console.log('📝 Adding images to BrickEconomy article...\n');

  const connection = await mysql.createConnection(DATABASE_URL);

  try {
    // Get the article
    const [rows] = await connection.execute(
      'SELECT id, contentBlocks FROM Article WHERE slug = ?',
      ['figtracker-vs-brickeconomy']
    );

    if (rows.length === 0) {
      console.error('❌ Article not found');
      process.exit(1);
    }

    const article = rows[0];
    const contentBlocks = JSON.parse(article.contentBlocks);

    // Free-to-use Unsplash images (no attribution required)
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

    const dataImage = {
      id: `block-data-${Date.now()}`,
      type: 'image',
      images: [{
        imageId: 'data-1',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        alt: 'Data analysis charts and graphs',
        caption: 'Real marketplace data vs inflated listing prices',
      }],
      columns: 1,
    };

    const mobileImage = {
      id: `block-mobile-${Date.now()}`,
      type: 'image',
      images: [{
        imageId: 'mobile-1',
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
        alt: 'Modern mobile interface',
        caption: 'Mobile-first design for pricing on the go',
      }],
      columns: 1,
    };

    // Insert images at strategic positions
    const updatedBlocks = [];
    let addedCount = 0;

    for (let i = 0; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];

      // Add hero after introduction
      if (i === 2 && !contentBlocks[3]?.type === 'image') {
        updatedBlocks.push(heroImage);
        addedCount++;
        console.log('✓ Added hero image after introduction');
      }

      // Add data image before comparison heading
      if (block.type === 'heading' && block.text.includes('Side-by-Side Comparison')) {
        updatedBlocks.push(dataImage);
        addedCount++;
        console.log('✓ Added data visualization before comparison');
      }

      // Add mobile image before mobile heading
      if (block.type === 'heading' && block.text.includes('Clean, Modern Mobile')) {
        updatedBlocks.push(mobileImage);
        addedCount++;
        console.log('✓ Added mobile interface image');
      }

      updatedBlocks.push(block);
    }

    if (addedCount === 0) {
      console.log('⚠️  No new images added (may already exist)');
      process.exit(0);
    }

    // Update database
    await connection.execute(
      'UPDATE Article SET contentBlocks = ? WHERE id = ?',
      [JSON.stringify(updatedBlocks), article.id]
    );

    console.log(`\n✅ Successfully added ${addedCount} images to article!`);
    console.log('   View at: https://figtracker.ericksu.com/articles/figtracker-vs-brickeconomy');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('❌ Failed:', error);
  process.exit(1);
});
