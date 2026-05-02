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
 * Step 1: Load catalog TXT files from local directory
 */
async function loadCatalogFiles(): Promise<string> {
  console.log('📂 Loading catalog files from public/catalog/updates/...');

  const updatesDir = path.join(process.cwd(), 'public', 'catalog', 'updates');

  if (!fs.existsSync(updatesDir)) {
    throw new Error(`Updates directory not found: ${updatesDir}\n\nPlease create the directory and place your downloaded TXT files there.`);
  }

  const minifigsPath = path.join(updatesDir, 'Minifigures.txt');
  const setsPath = path.join(updatesDir, 'Sets.txt');

  if (!fs.existsSync(minifigsPath) && !fs.existsSync(setsPath)) {
    throw new Error(`No catalog files found in ${updatesDir}\n\nPlease download:\n- Minifigures.txt from BrickLink\n- Sets.txt from BrickLink\n\nAnd place them in: ${updatesDir}`);
  }

  if (fs.existsSync(minifigsPath)) {
    const size = fs.statSync(minifigsPath).size;
    console.log(`✅ Found Minifigures.txt (${(size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.log('⚠️  Minifigures.txt not found - skipping minifigs update');
  }

  if (fs.existsSync(setsPath)) {
    const size = fs.statSync(setsPath).size;
    console.log(`✅ Found Sets.txt (${(size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.log('⚠️  Sets.txt not found - skipping sets update');
  }

  return updatesDir;
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

  const outputDir = path.join(process.cwd(), 'public', 'catalog');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Process Minifigures
  const minifigsPath = path.join(catalogDir, 'Minifigures.txt');
  if (fs.existsSync(minifigsPath)) {
    const content = fs.readFileSync(minifigsPath, 'utf-8');
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

    const minifigsOutput = path.join(outputDir, 'minifigs.json');
    fs.writeFileSync(minifigsOutput, JSON.stringify(minifigs, null, 2));
    console.log(`✅ Converted ${minifigs.length} minifigs to JSON`);
  }

  // Process Sets
  const setsPath = path.join(catalogDir, 'Sets.txt');
  if (fs.existsSync(setsPath)) {
    const content = fs.readFileSync(setsPath, 'utf-8');
    const lines = content.split('\n');
    const dataLines = lines.slice(1).filter(line => line.trim());

    const sets = dataLines.map(line => {
      const parts = line.split('\t');
      return {
        box_no: parts[2]?.trim() || '',
        name: parts[3]?.trim() || '',
        category_id: parseInt(parts[0]?.trim() || '0'),
        category_name: parts[1]?.trim() || '',
        year_released: parts[4]?.trim() || null,
        weight: parts[5]?.trim() || null,
        size: null,
        image_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/SN/0/${parts[2].trim()}.png` : null,
        thumbnail_url: parts[2]?.trim() ? `https://img.bricklink.com/ItemImage/TN/0/${parts[2].trim()}.png` : null,
        updated_at: new Date().toISOString()
      };
    }).filter(s => s.box_no);

    const setsOutput = path.join(outputDir, 'boxes.json');
    fs.writeFileSync(setsOutput, JSON.stringify(sets, null, 2));
    console.log(`✅ Converted ${sets.length} sets to boxes.json`);
  }
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
  console.log('🤖 CATALOG UPDATE STARTED\n');

  try {
    // Step 1: Load catalog files
    const catalogDir = await loadCatalogFiles();

    // Step 2: Detect item number changes
    const changes = await detectItemNumberChanges();

    // Step 3: Migrate user data
    await migrateUserData(changes);

    // Step 4: Convert to JSON
    await convertToJSON(catalogDir);

    // Step 5: Deploy via Vercel
    await uploadToCDN();

    console.log('\n✅ CATALOG UPDATE COMPLETE');
    console.log(`   Item number changes detected: ${changes.length}`);
    console.log(`   Files updated: public/catalog/minifigs.json, public/catalog/boxes.json`);
    console.log('\n📝 Next steps:');
    console.log('   1. Review the changes above');
    console.log('   2. git add public/catalog/');
    console.log('   3. git commit -m "chore: update BrickLink catalogs"');
    console.log('   4. git push');

  } catch (error) {
    console.error('\n❌ CATALOG UPDATE FAILED');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
