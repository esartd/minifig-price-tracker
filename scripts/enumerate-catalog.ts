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

  // Define all LEGO themes to enumerate
  // Max values determined by testing actual BrickLink ranges
  // padding: number of digits for ID (e.g., 4 for sw0001, 3 for hp001)
  const themes = [
    { prefix: 'sw', name: 'Star Wars', max: 2500, padding: 4 },
    { prefix: 'sh', name: 'Super Heroes', max: 1500, padding: 4 },
    { prefix: 'njo', name: 'Ninjago', max: 1000, padding: 4 },
    { prefix: 'cty', name: 'City', max: 1500, padding: 4 },
    { prefix: 'frnd', name: 'Friends', max: 500, padding: 4 },
    { prefix: 'hp', name: 'Harry Potter', max: 500, padding: 3 },
    { prefix: 'cas', name: 'Castle', max: 500, padding: 3 },
    { prefix: 'col', name: 'Collectible Minifigures', max: 472, padding: 3 },
    { prefix: 'trn', name: 'Train', max: 254, padding: 3 },
    { prefix: 'dp', name: 'Disney Princess', max: 240, padding: 3 },
    { prefix: 'mar', name: 'Marvel Super Heroes', max: 230, padding: 4 },
    { prefix: 'tlm', name: 'The LEGO Movie', max: 209, padding: 3 },
    { prefix: 'pi', name: 'Pirates', max: 199, padding: 3 },
    { prefix: 'dis', name: 'Disney', max: 192, padding: 3 },
    { prefix: 'lor', name: 'Lord of the Rings', max: 153, padding: 3 },
    { prefix: 'nex', name: 'Nexo Knights', max: 152, padding: 3 },
    { prefix: 'sp', name: 'Space', max: 148, padding: 3 },
    { prefix: 'jw', name: 'Jurassic World', max: 142, padding: 3 },
    { prefix: 'rac', name: 'Racers', max: 61, padding: 3 },
    { prefix: 'elf', name: 'Elves', max: 59, padding: 3 },
    { prefix: 'dim', name: 'Dimensions', max: 54, padding: 3 },
    { prefix: 'poc', name: 'Pirates of the Caribbean', max: 52, padding: 3 },
    { prefix: 'sim', name: 'The Simpsons', max: 48, padding: 3 },
    { prefix: 'ovr', name: 'Overwatch', max: 41, padding: 3 },
    { prefix: 'spd', name: 'Spider-Man', max: 31, padding: 3 },
    { prefix: 'atl', name: 'Atlantis', max: 24, padding: 3 },
    { prefix: 'gb', name: 'Ghostbusters', max: 20, padding: 3 },
    { prefix: 'hrf', name: 'Hidden Side', max: 12, padding: 3 },
  ];

  console.log(`📋 Enumerating ALL LEGO themes:`);
  themes.forEach(theme => {
    const start = '1'.padStart(theme.padding, '0');
    const end = theme.max.toString().padStart(theme.padding, '0');
    console.log(`   - ${theme.name} (${theme.prefix}): ${theme.prefix}${start}-${theme.prefix}${end}`);
  });
  if (resumeFrom) {
    console.log(`\n⏭️  Resuming from: ${resumeFrom}`);
  }
  console.log(`\n⏱️  Estimated time: ~30-40 minutes (checking ${themes.reduce((sum, t) => sum + t.max, 0)} IDs)\n`);

  const validEntries: CatalogEntry[] = [];
  let checked = 0;
  let found = 0;
  let notFound = 0;

  // Enumerate all themes
  for (const theme of themes) {
    console.log(`\n🔍 Checking ${theme.name} (${theme.prefix})...`);

    for (let i = 1; i <= theme.max; i++) {
      const itemNo = `${theme.prefix}${i.toString().padStart(theme.padding, '0')}`;

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

          await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds - safe rate limit
        }
      } else {
        notFound++;
      }
    } catch (error) {
      // Item doesn't exist or API error - skip
      notFound++;
    }

      checked++;

      // Delay to respect API rate limits (BrickLink ToS: 5,000 calls/day max)
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds - safe rate limit

      // Save progress every 100 items
      if (checked % 100 === 0) {
        saveProgress(validEntries, itemNo);
      }
    }

    console.log(`\n✅ ${theme.name} complete! Found: ${found} total`);
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
 * LEGO Minifigure Catalog - All Themes
 *
 * Complete catalog enumerated from BrickLink API.
 * Includes: Star Wars, Harry Potter, Super Heroes, Ninjago, City, and more!
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
