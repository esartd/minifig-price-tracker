/**
 * AUTOMATIC BRICKLINK CATALOG UPDATE
 *
 * Run via GitHub Actions every 2 weeks:
 * 1. Download latest catalog from BrickLink
 * 2. Detect item number changes from catalog logs
 * 3. Migrate user data (collections, cache)
 * 4. Update catalog JSON files
 * 5. Upload to Hostinger CDN
 *
 * Schedule: Bi-weekly on Mondays at 2 AM
 */

import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ItemNumberChange {
  oldNumber: string;
  newNumber: string;
  name: string;
  changeDate: string;
}

/**
 * Step 1: Download latest catalog TXT files from BrickLink
 */
async function downloadCatalog(): Promise<string> {
  console.log('📥 Downloading latest catalog from BrickLink...');

  const downloadUrl = 'https://www.bricklink.com/catalogDownload.asp';

  // BrickLink catalog download requires form submission
  // Filter: Item Type = Minifigures
  const formData = new URLSearchParams({
    'itemType': 'M', // Minifigures
    'downloadType': 'TSV' // Tab-separated values
  });

  const response = await fetch(downloadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'FigTracker-CatalogBot/1.0'
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Failed to download catalog: ${response.status}`);
  }

  const txtContent = await response.text();

  // Save to temporary location
  const tempDir = path.join(process.cwd(), 'temp-catalog');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const txtPath = path.join(tempDir, 'Minifigures.txt');
  fs.writeFileSync(txtPath, txtContent);

  console.log(`✅ Downloaded catalog (${txtContent.length} bytes)`);
  return tempDir;
}

/**
 * Step 2: Scrape item number changes from BrickLink catalog logs
 */
async function detectItemNumberChanges(): Promise<ItemNumberChange[]> {
  console.log('🔍 Detecting item number changes...');

  // Scrape the last 30 days of changes
  const url = 'https://www.bricklink.com/catalogReqList.asp?viewYear=&viewMonth=&viewGeDate=&q=&viewStatus=1&itemType=M&viewAction=I';

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'FigTracker-CatalogBot/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch catalog changes: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const changes: ItemNumberChange[] = [];

  // Parse the table of item number changes
  $('table tr').each((i, row) => {
    if (i === 0) return; // Skip header

    const cols = $(row).find('td');
    if (cols.length < 4) return;

    const changeDate = $(cols[0]).text().trim();
    const itemType = $(cols[1]).text().trim();
    const changeText = $(cols[2]).text().trim(); // e.g., "sw1234 → sw1234a"
    const name = $(cols[3]).text().trim();

    if (itemType !== 'Minifig') return;

    // Parse "old → new" format
    const match = changeText.match(/(\S+)\s*→\s*(\S+)/);
    if (match) {
      changes.push({
        oldNumber: match[1],
        newNumber: match[2],
        name,
        changeDate
      });
    }
  });

  console.log(`✅ Found ${changes.length} item number changes`);
  return changes;
}

/**
 * Step 3: Migrate user data to new item numbers
 */
async function migrateUserData(changes: ItemNumberChange[]): Promise<void> {
  console.log('🔄 Migrating user data...');

  if (changes.length === 0) {
    console.log('   No migrations needed');
    return;
  }

  let migratedCount = 0;

  for (const change of changes) {
    console.log(`   Migrating ${change.oldNumber} → ${change.newNumber} (${change.name})`);

    // Update CollectionItem (For Sale)
    const collectionResult = await prisma.collectionItem.updateMany({
      where: { minifigure_no: change.oldNumber },
      data: { minifigure_no: change.newNumber }
    });

    // Update PersonalCollectionItem (To Keep)
    const personalResult = await prisma.personalCollectionItem.updateMany({
      where: { minifigure_no: change.oldNumber },
      data: { minifigure_no: change.newNumber }
    });

    // Update PriceCache
    const cacheResult = await prisma.priceCache.updateMany({
      where: {
        item_no: change.oldNumber,
        item_type: 'MINIFIG'
      },
      data: { item_no: change.newNumber }
    });

    // Update WishlistItem
    const wishlistResult = await prisma.wishlistItem.updateMany({
      where: { minifigure_no: change.oldNumber },
      data: { minifigure_no: change.newNumber }
    });

    const totalAffected =
      collectionResult.count +
      personalResult.count +
      cacheResult.count +
      wishlistResult.count;

    if (totalAffected > 0) {
      console.log(`      ✅ Updated ${totalAffected} records`);
      migratedCount++;
    }
  }

  console.log(`✅ Migration complete (${migratedCount} IDs migrated)`);
}

/**
 * Step 4: Convert TXT to JSON
 */
async function convertToJSON(catalogDir: string): Promise<void> {
  console.log('📄 Converting TXT to JSON...');

  const txtPath = path.join(catalogDir, 'Minifigures.txt');
  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim());

  const minifigs = dataLines.map(line => {
    const parts = line.split('\t');
    return {
      minifigure_no: parts[2]?.trim() || '',
      name: parts[3]?.trim() || '',
      category_id: parseInt(parts[0]?.trim() || '0'),
      category_name: parts[1]?.trim() || '',
      year_released: parts[4]?.trim() || null,
      weight: parts[5]?.trim() || null,
      size: null,
      image_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/MN/0/${parts[2].trim()}.png` : null,
      thumbnail_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/TN/0/${parts[2].trim()}.png` : null,
      updated_at: new Date().toISOString()
    };
  }).filter(m => m.minifigure_no);

  const outputDir = path.join(process.cwd(), 'public', 'catalog');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'minifigs.json');
  fs.writeFileSync(outputPath, JSON.stringify(minifigs, null, 2));

  console.log(`✅ Converted ${minifigs.length} minifigs to JSON`);
}

/**
 * Step 5: Upload to Hostinger CDN (optional - can use Vercel edge)
 */
async function uploadToCDN(): Promise<void> {
  console.log('☁️  Uploading to CDN...');

  // If using Vercel, just commit to git and push
  // Vercel will auto-deploy the updated catalog

  console.log('✅ Catalog will be deployed via Vercel');
}

/**
 * Main execution
 */
async function main() {
  console.log('🤖 AUTO CATALOG UPDATE STARTED\n');

  try {
    // Step 1: Download catalog
    const catalogDir = await downloadCatalog();

    // Step 2: Detect item number changes
    const changes = await detectItemNumberChanges();

    // Step 3: Migrate user data
    await migrateUserData(changes);

    // Step 4: Convert to JSON
    await convertToJSON(catalogDir);

    // Step 5: Upload to CDN
    await uploadToCDN();

    // Cleanup temp files
    fs.rmSync(catalogDir, { recursive: true, force: true });

    console.log('\n✅ AUTO CATALOG UPDATE COMPLETE');
    console.log(`   Changes detected: ${changes.length}`);
    console.log(`   Next run: In 2 weeks`);

  } catch (error) {
    console.error('❌ AUTO CATALOG UPDATE FAILED');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
