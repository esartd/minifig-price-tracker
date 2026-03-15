/**
 * BrickLink Catalog Enumerator
 *
 * Brute-force enumerates all Star Wars minifigure item numbers (sw0001-sw2500)
 * by checking each one against BrickLink API. Builds complete catalog with names.
 *
 * Run: npm run enumerate-catalog
 * Resume from ID: npm run enumerate-catalog -- --resume sw1000
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '../.env.local') });

interface CatalogEntry {
  no: string;
  name: string;
  keywords: string[];
}

async function enumerateCatalog() {
  console.log('🚀 Starting BrickLink catalog enumeration...\n');

  // Dynamic import AFTER dotenv has loaded
  const { bricklinkAPI } = await import('../lib/bricklink.js');

  // Check for resume parameter
  const resumeArg = process.argv.find(arg => arg.startsWith('--resume'));
  const resumeFrom = resumeArg ? resumeArg.split('=')[1] : null;
  const startNum = resumeFrom ? parseInt(resumeFrom.match(/\d+/)?.[0] || '1') : 1;

  console.log(`📋 Checking Star Wars minifigures: sw0001 - sw2500`);
  if (resumeFrom) {
    console.log(`⏭️  Resuming from: ${resumeFrom}`);
  }
  console.log(`⏱️  Estimated time: ~4-5 minutes\n`);

  const validEntries: CatalogEntry[] = [];
  let checked = 0;
  let found = 0;
  let notFound = 0;

  // Try sw prefix (Star Wars)
  for (let i = startNum; i <= 2500; i++) {
    const itemNo = `sw${i.toString().padStart(4, '0')}`;

    process.stdout.write(`\r   Progress: ${itemNo} | Found: ${found} | Not Found: ${notFound} | Total Checked: ${checked}`);

    try {
      const minifig = await bricklinkAPI.getMinifigureByNumber(itemNo);

      if (minifig) {
        const keywords = extractKeywords(minifig.name);
        validEntries.push({
          no: minifig.no,
          name: minifig.name,
          keywords: keywords
        });
        found++;

        // Also check for letter variants (e.g., sw0001a, sw0001b)
        for (const suffix of ['a', 'b', 'c', 'd']) {
          const variantNo = `${itemNo}${suffix}`;
          const variant = await bricklinkAPI.getMinifigureByNumber(variantNo);

          if (variant) {
            const variantKeywords = extractKeywords(variant.name);
            validEntries.push({
              no: variant.no,
              name: variant.name,
              keywords: variantKeywords
            });
            found++;
          }

          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else {
        notFound++;
      }
    } catch (error) {
      // Item doesn't exist or API error - skip
      notFound++;
    }

    checked++;

    // Small delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 100));

    // Save progress every 100 items
    if (checked % 100 === 0) {
      saveProgress(validEntries, itemNo);
    }
  }

  console.log(`\n\n✅ Enumeration complete!`);
  console.log(`   Total checked: ${checked}`);
  console.log(`   Found: ${found} minifigures`);
  console.log(`   Not found: ${notFound}\n`);

  if (validEntries.length === 0) {
    console.log('❌ No minifigures found');
    return;
  }

  // Sort by item number
  validEntries.sort((a, b) => a.no.localeCompare(b.no));

  // Generate catalog file
  const catalogContent = generateCatalogFile(validEntries);
  const catalogPath = path.join(__dirname, '../lib/minifig-catalog.ts');
  fs.writeFileSync(catalogPath, catalogContent, 'utf-8');

  console.log(`💾 Updated catalog file: ${catalogPath}`);
  console.log(`📦 Total entries: ${validEntries.length}`);
  console.log(`🎉 Catalog enumeration complete!\n`);

  // Print summary
  printSummary(validEntries);

  // Delete progress file on success
  const progressPath = path.join(__dirname, 'catalog-progress.json');
  if (fs.existsSync(progressPath)) {
    fs.unlinkSync(progressPath);
  }
}

/**
 * Save progress to file in case of interruption
 */
function saveProgress(entries: CatalogEntry[], lastChecked: string) {
  const progressPath = path.join(__dirname, 'catalog-progress.json');
  fs.writeFileSync(progressPath, JSON.stringify({
    lastChecked,
    entries,
    timestamp: new Date().toISOString()
  }, null, 2));
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
  const words = name.split(/[\s,\-()]+/).filter(w => w.length > 2);
  words.forEach(word => {
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
 * Complete catalog enumerated from BrickLink API (sw0001-sw2500).
 * Last updated: ${timestamp}
 * Total entries: ${entries.length}
 *
 * DO NOT EDIT MANUALLY - Run 'npm run enumerate-catalog' to update
 */

export const minifigCatalog = [\n`;

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    content += `  {\n`;
    content += `    no: '${entry.no}',\n`;
    content += `    name: '${entry.name.replace(/'/g, "\\'")}',\n`;
    content += `    keywords: [${entry.keywords.map(k => `'${k.replace(/'/g, "\\'")}'`).join(', ')}],\n`;
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
  entries.forEach(entry => {
    const prefix = entry.no.match(/^[a-z]+/i)?.[0] || 'other';
    prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
  });

  Object.entries(prefixCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([prefix, count]) => {
      console.log(`   ${prefix}: ${count} minifigures`);
    });

  console.log('');

  // Sample of found minifigs
  console.log('📝 Sample entries (first 10):');
  entries.slice(0, 10).forEach(entry => {
    console.log(`   ${entry.no}: ${entry.name}`);
  });

  console.log('');
}

// Run the enumerator
enumerateCatalog();
