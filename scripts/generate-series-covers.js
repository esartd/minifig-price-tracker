/**
 * Auto-generate series cover images by finding minifigs with white backgrounds
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createCanvas, loadImage } = require('canvas');

// Load catalog
const catalogPath = path.join(__dirname, '../public/catalog/minifigs.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

console.log(`Loaded ${catalog.length} minifigs from catalog`);

// Group by category
const categoriesMap = new Map();

catalog.forEach(minifig => {
  const category = minifig.category_name;
  if (!categoriesMap.has(category)) {
    categoriesMap.set(category, []);
  }
  categoriesMap.get(category).push(minifig);
});

console.log(`Found ${categoriesMap.size} unique categories`);

// Check if image has white background
async function hasWhiteBackground(imageUrl) {
  try {
    const img = await loadImage(imageUrl);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Sample corners and edges (10 points)
    const samplePoints = [
      [0, 0],
      [img.width - 1, 0],
      [0, img.height - 1],
      [img.width - 1, img.height - 1],
      [Math.floor(img.width / 2), 0],
      [Math.floor(img.width / 2), img.height - 1],
      [0, Math.floor(img.height / 2)],
      [img.width - 1, Math.floor(img.height / 2)],
      [Math.floor(img.width / 4), Math.floor(img.height / 4)],
      [Math.floor(img.width * 3 / 4), Math.floor(img.height * 3 / 4)]
    ];

    let whitePixels = 0;
    for (const [x, y] of samplePoints) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0], g = pixel[1], b = pixel[2];

      // Consider white if RGB all > 240
      if (r > 240 && g > 240 && b > 240) {
        whitePixels++;
      }
    }

    // Require at least 80% white pixels
    return whitePixels >= 8;
  } catch (error) {
    console.error(`Error checking ${imageUrl}:`, error.message);
    return false;
  }
}

// Process categories
async function generateSeriesCovers() {
  const results = [];

  // Load existing THEME_MAIN_CHARACTERS to preserve manual entries
  const themeMainCharactersPath = path.join(__dirname, '../lib/theme-main-characters.ts');
  const existingContent = fs.readFileSync(themeMainCharactersPath, 'utf-8');
  const existingEntries = new Set();

  // Parse existing entries
  const regex = /'([^']+)':\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(existingContent)) !== null) {
    existingEntries.add(match[1]);
  }

  console.log(`Found ${existingEntries.size} existing manual entries`);

  // Filter to only subcategories (contains " / ")
  const subcategories = Array.from(categoriesMap.entries())
    .filter(([name]) => name.includes(' / '))
    .sort((a, b) => a[0].localeCompare(b[0]));

  console.log(`Processing ${subcategories.length} subcategories...\n`);

  for (const [categoryName, minifigs] of subcategories) {
    // Skip if already has manual entry
    if (existingEntries.has(categoryName)) {
      console.log(`⏭️  ${categoryName} - already has manual entry`);
      continue;
    }

    // Sort minifigs by number
    const sortedMinifigs = minifigs.sort((a, b) =>
      a.minifigure_no.localeCompare(b.minifigure_no)
    );

    // Find first minifig with white background
    let selectedMinifig = null;
    for (const minifig of sortedMinifigs.slice(0, 20)) { // Check first 20 only
      const imageUrl = `https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`;

      process.stdout.write(`  Checking ${minifig.minifigure_no}...`);
      const isWhite = await hasWhiteBackground(imageUrl);

      if (isWhite) {
        selectedMinifig = minifig;
        console.log(` ✅ WHITE`);
        break;
      } else {
        console.log(` ❌ colored`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (selectedMinifig) {
      results.push({
        category: categoryName,
        minifigNo: selectedMinifig.minifigure_no,
        name: selectedMinifig.name
      });
      console.log(`✅ ${categoryName} -> ${selectedMinifig.minifigure_no}\n`);
    } else {
      // Fallback to first minifig if none have white background
      const fallback = sortedMinifigs[0];
      results.push({
        category: categoryName,
        minifigNo: fallback.minifigure_no,
        name: fallback.name
      });
      console.log(`⚠️  ${categoryName} -> ${fallback.minifigure_no} (fallback)\n`);
    }
  }

  // Generate TypeScript code
  console.log('\n\n=== GENERATED ENTRIES ===\n');

  const grouped = {};
  results.forEach(({ category, minifigNo }) => {
    const parts = category.split(' / ');
    const theme = parts[0];
    if (!grouped[theme]) grouped[theme] = [];
    grouped[theme].push({ category, minifigNo });
  });

  for (const [theme, entries] of Object.entries(grouped).sort()) {
    console.log(`  // ${theme}`);
    entries.forEach(({ category, minifigNo }) => {
      console.log(`  '${category}': '${minifigNo}',`);
    });
    console.log('');
  }

  console.log(`\n✅ Generated ${results.length} series covers`);
}

// Run
generateSeriesCovers().catch(console.error);
