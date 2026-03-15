/**
 * BrickLink Catalog Scraper
 *
 * Scrapes BrickLink's public catalog pages to build a comprehensive list of
 * Star Wars minifigures with their item numbers and names.
 *
 * Run: npm run scrape-catalog
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

interface CatalogEntry {
  no: string;
  name: string;
  keywords: string[];
}

// Star Wars category IDs on BrickLink
const STAR_WARS_CATEGORIES = [
  '65.65.67',  // Star Wars / Star Wars / Town
  '65.65.68',  // Star Wars / Star Wars Episode 1
  '65.65.69',  // Star Wars / Star Wars Episode 2
  '65.65.70',  // Star Wars / Star Wars Episode 3
  '65.65.71',  // Star Wars / Star Wars Episode 4/5/6
  '65.65.72',  // Star Wars / Star Wars Episode 7
  '65.65.73',  // Star Wars / Star Wars Episode 8
  '65.65.74',  // Star Wars / Star Wars Episode 9
  '65.65.240', // Star Wars / The Mandalorian
  '65.65.269', // Star Wars / The Clone Wars
  '65.65.276', // Star Wars / Rebels
  '65.65.316', // Star Wars / Other
];

async function scrapeCatalog() {
  console.log('🚀 Starting BrickLink catalog scrape...\n');

  const allEntries: CatalogEntry[] = [];
  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const category of STAR_WARS_CATEGORIES) {
      console.log(`📡 Scraping category: ${category}...`);

      const page = await browser.newPage();
      const url = `https://www.bricklink.com/catalogList.asp?catType=M&catString=${category}&pg=1&pageSize=500`;

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Extract minifig data from the page
      const minifigs = await page.evaluate(() => {
        const results: { no: string; name: string }[] = [];

        // Find all minifig links in the catalog
        const links = document.querySelectorAll('a[href*="catalogItem.asp?M="]');

        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (!href) return;

          // Extract item number from URL (e.g., catalogItem.asp?M=sw0001a)
          const match = href.match(/M=([a-z0-9]+)/i);
          if (!match) return;

          const itemNo = match[1];
          const name = link.textContent?.trim() || '';

          if (itemNo && name) {
            results.push({ no: itemNo, name });
          }
        });

        return results;
      });

      console.log(`   Found ${minifigs.length} minifigs`);

      // Add to collection
      minifigs.forEach((minifig) => {
        // Check for duplicates
        if (!allEntries.find((e) => e.no === minifig.no)) {
          allEntries.push({
            no: minifig.no,
            name: minifig.name,
            keywords: extractKeywords(minifig.name),
          });
        }
      });

      await page.close();

      // Add delay to be respectful to BrickLink's servers
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(`\n✅ Total unique minifigs found: ${allEntries.length}\n`);

    if (allEntries.length === 0) {
      console.log('❌ No minifigures found');
      return;
    }

    // Sort by item number
    allEntries.sort((a, b) => a.no.localeCompare(b.no));

    // Generate catalog file
    const catalogContent = generateCatalogFile(allEntries);
    const catalogPath = path.join(__dirname, '../lib/minifig-catalog.ts');
    fs.writeFileSync(catalogPath, catalogContent, 'utf-8');

    console.log(`💾 Updated catalog file: ${catalogPath}`);
    console.log(`📦 Total entries: ${allEntries.length}`);
    console.log(`🎉 Catalog scrape complete!\n`);

    // Print summary
    printSummary(allEntries);
  } catch (error) {
    console.error('❌ Error scraping catalog:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

/**
 * Extract searchable keywords from minifig name
 */
function extractKeywords(name: string): string[] {
  const keywords: string[] = [];

  // Add the full name
  keywords.push(name.toLowerCase());

  // Extract character names (text before first comma)
  const characterName = name.split(',')[0].trim();
  if (characterName) {
    keywords.push(characterName.toLowerCase());
  }

  // Extract individual words (longer than 2 chars)
  const words = name.split(/[\s,\-()]+/).filter((w) => w.length > 2);
  words.forEach((word) => {
    keywords.push(word.toLowerCase());
  });

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate the TypeScript catalog file content
 */
function generateCatalogFile(entries: CatalogEntry[]): string {
  const timestamp = new Date().toISOString();

  let content = `/**
 * Star Wars Minifigure Catalog
 *
 * Scraped from BrickLink's public catalog pages.
 * Last updated: ${timestamp}
 * Total entries: ${entries.length}
 *
 * DO NOT EDIT MANUALLY - Run 'npm run scrape-catalog' to update
 */

export const minifigCatalog = [\n`;

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    content += `  {\n`;
    content += `    no: '${entry.no}',\n`;
    content += `    name: '${entry.name.replace(/'/g, "\\'")}',\n`;
    content += `    keywords: [${entry.keywords.map((k) => `'${k.replace(/'/g, "\\'")}'`).join(', ')}],\n`;
    content += `  }${isLast ? '' : ','}\n`;
  });

  content += `];\n`;

  return content;
}

/**
 * Print summary statistics
 */
function printSummary(entries: CatalogEntry[]) {
  console.log('📊 Summary Statistics:');
  console.log('─────────────────────');

  // Count by prefix
  const prefixCounts: Record<string, number> = {};
  entries.forEach((entry) => {
    const prefix = entry.no.match(/^[a-z]+/i)?.[0] || 'other';
    prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
  });

  Object.entries(prefixCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([prefix, count]) => {
      console.log(`   ${prefix}: ${count} minifigures`);
    });

  console.log('');
}

// Run the scraper
scrapeCatalog();
