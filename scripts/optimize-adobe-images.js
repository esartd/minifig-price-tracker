const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const inputDir = path.join(process.cwd(), 'public/uploads/articles');
  const images = [
    'lego-builder-hero.jpg',
    'mobile-pricing-woman.jpg',
    'laptop-data-man.jpg',
    'mobile-couch-woman.jpg'
  ];

  console.log('🖼️  Optimizing Adobe Stock images for web...\n');

  for (const filename of images) {
    const inputPath = path.join(inputDir, filename);
    const outputPath = path.join(inputDir, filename);

    try {
      const stats = await fs.stat(inputPath);
      const originalSize = (stats.size / 1024 / 1024).toFixed(2);

      console.log(`Processing: ${filename} (${originalSize} MB)`);

      await sharp(inputPath)
        .resize(1920, null, { // Max width 1920px (more than enough for articles)
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({
          quality: 85, // High quality, good compression
          progressive: true // Progressive JPEG for faster loading
        })
        .toFile(outputPath + '.tmp');

      // Replace original with optimized
      await fs.rename(outputPath + '.tmp', outputPath);

      const newStats = await fs.stat(outputPath);
      const newSize = (newStats.size / 1024 / 1024).toFixed(2);
      const saved = ((1 - newStats.size / stats.size) * 100).toFixed(0);

      console.log(`  ✓ Optimized: ${newSize} MB (${saved}% smaller)\n`);
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}\n`);
    }
  }

  console.log('✅ All images optimized!');
}

optimizeImages().catch(console.error);
