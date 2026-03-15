/**
 * Incremental Catalog Update
 *
 * Only checks for NEW minifigures since last update.
 * Finds the highest ID for each theme and checks forward from there.
 * Much faster than full enumeration (~2-3 minutes vs 40 minutes).
 *
 * Run: npm run update-catalog
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

async function updateCatalogIncremental() {
  console.log('🔄 Starting incremental catalog update...\n');

  // Dynamic import AFTER dotenv has loaded
  const { bricklinkAPI } = await import('../lib/bricklink.js');

  // Load existing catalog
  const catalogPath = path.join(__dirname, '../lib/minifig-catalog.ts');
  const catalogContent = fs.readFileSync(catalogPath, 'utf-8');

  // Parse existing entries
  const existingEntries: CatalogEntry[] = [];
  const entryRegex = /{\s*no: '([^']+)',\s*name: '([^']+)',\s*keywords: \[([^\]]+)\]/g;
  let match;

  while ((match = entryRegex.exec(catalogContent)) !== null) {
    const keywords = match[3].split(',').map(k => k.trim().replace(/'/g, ''));
    existingEntries.push({
      no: match[1],
      name: match[2].replace(/\\'/g, "'"),
      keywords: keywords
    });
  }

  console.log(`📚 Loaded ${existingEntries.length} existing minifigures`);

  // Find highest number for each prefix
  const prefixMaxes: Record<string, number> = {};
  existingEntries.forEach(entry => {
    const prefix = entry.no.match(/^[a-z]+/i)?.[0] || '';
    const numMatch = entry.no.match(/\d+/);
    if (prefix && numMatch) {
      const num = parseInt(numMatch[0]);
      if (!prefixMaxes[prefix] || num > prefixMaxes[prefix]) {
        prefixMaxes[prefix] = num;
      }
    }
  });

  console.log('\n📊 Current highest IDs per theme:');
  Object.entries(prefixMaxes).sort((a, b) => a[0].localeCompare(b[0])).forEach(([prefix, max]) => {
    console.log(`   ${prefix}: ${prefix}${max.toString().padStart(4, '0')}`);
  });

  // Define check ranges (highest + 200 for each theme)
  const checkRanges = [
    { prefix: 'sw', name: 'Star Wars', checkAhead: 200 },
    { prefix: 'hp', name: 'Harry Potter', checkAhead: 100 },
    { prefix: 'sh', name: 'Super Heroes', checkAhead: 150 },
    { prefix: 'col', name: 'Collectible Minifigures', checkAhead: 50 },
    { prefix: 'njo', name: 'Ninjago', checkAhead: 100 },
    { prefix: 'lor', name: 'Lord of the Rings', checkAhead: 20 },
    { prefix: 'hol', name: 'The Hobbit', checkAhead: 20 },
    { prefix: 'tlm', name: 'The LEGO Movie', checkAhead: 50 },
    { prefix: 'cty', name: 'City', checkAhead: 100 },
    { prefix: 'cas', name: 'Castle', checkAhead: 50 },
    { prefix: 'pi', name: 'Pirates', checkAhead: 50 },
    { prefix: 'vik', name: 'Vikings', checkAhead: 20 },
    { prefix: 'poc', name: 'Pirates of the Caribbean', checkAhead: 20 },
    { prefix: 'atl', name: 'Atlantis', checkAhead: 20 },
    { prefix: 'phr', name: 'Pharaoh\'s Quest', checkAhead: 20 },
    { prefix: 'mon', name: 'Monster Fighters', checkAhead: 20 },
    { prefix: 'dim', name: 'Dimensions', checkAhead: 30 },
    { prefix: 'tlb', name: 'The LEGO Batman Movie', checkAhead: 30 },
    { prefix: 'tln', name: 'The LEGO Ninjago Movie', checkAhead: 30 },
    { prefix: 'elf', name: 'Elves', checkAhead: 30 },
    { prefix: 'nex', name: 'Nexo Knights', checkAhead: 50 },
    { prefix: 'coltlm', name: 'Collectible TLM', checkAhead: 20 },
    { prefix: 'colhp', name: 'Collectible Harry Potter', checkAhead: 20 },
    { prefix: 'idea', name: 'Ideas', checkAhead: 50 },
  ];

  console.log('\n🔍 Checking for new minifigures...\n');

  const newEntries: CatalogEntry[] = [];
  let checked = 0;
  let found = 0;

  for (const range of checkRanges) {
    const startNum = (prefixMaxes[range.prefix] || 0) + 1;
    const endNum = startNum + range.checkAhead - 1;

    if (startNum > endNum) continue;

    console.log(`🔎 ${range.name} (${range.prefix}): checking ${range.prefix}${startNum.toString().padStart(4, '0')} → ${range.prefix}${endNum.toString().padStart(4, '0')}`);

    for (let i = startNum; i <= endNum; i++) {
      const itemNo = `${range.prefix}${i.toString().padStart(4, '0')}`;

      process.stdout.write(`\r   Checking ${itemNo}... Found: ${found} | Checked: ${checked}`);

      try {
        const minifig = await bricklinkAPI.getMinifigureByNumber(itemNo);

        if (minifig) {
          const keywords = extractKeywords(minifig.name);
          newEntries.push({
            no: minifig.no,
            name: minifig.name,
            keywords: keywords
          });
          found++;
          console.log(`\r   ✨ Found: ${itemNo} - ${minifig.name}`);

          // Check variants
          for (const suffix of ['a', 'b', 'c', 'd']) {
            const variantNo = `${itemNo}${suffix}`;
            const variant = await bricklinkAPI.getMinifigureByNumber(variantNo);

            if (variant) {
              const variantKeywords = extractKeywords(variant.name);
              newEntries.push({
                no: variant.no,
                name: variant.name,
                keywords: variantKeywords
              });
              found++;
              console.log(`   ✨ Found: ${variantNo} - ${variant.name}`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        // Skip
      }

      checked++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n   ✅ ${range.name} complete\n`);
  }

  console.log(`\n✅ Incremental update complete!`);
  console.log(`   Checked: ${checked} new IDs`);
  console.log(`   Found: ${found} new minifigures\n`);

  if (newEntries.length === 0) {
    console.log('📋 No new minifigures found. Catalog is up to date!');
    return;
  }

  // Merge and sort
  const allEntries = [...existingEntries, ...newEntries];
  allEntries.sort((a, b) => a.no.localeCompare(b.no));

  // Generate new catalog file
  const catalogContent = generateCatalogFile(allEntries);
  fs.writeFileSync(catalogPath, catalogContent, 'utf-8');

  console.log(`💾 Updated catalog file: ${catalogPath}`);
  console.log(`📦 Total entries: ${allEntries.length} (was ${existingEntries.length})`);
  console.log(`🎉 Added ${newEntries.length} new minifigures!\n`);

  // Print new additions
  console.log('📝 New additions:');
  newEntries.slice(0, 10).forEach(entry => {
    console.log(`   ${entry.no}: ${entry.name}`);
  });
  if (newEntries.length > 10) {
    console.log(`   ... and ${newEntries.length - 10} more`);
  }
}

function extractKeywords(name: string): string[] {
  const keywords: string[] = [];

  keywords.push(name.toLowerCase());

  const characterName = name.split(',')[0].trim();
  if (characterName) {
    keywords.push(characterName.toLowerCase());
  }

  const words = name.split(/[\s,\-()]+/).filter(w => w.length > 2);
  words.forEach(word => {
    keywords.push(word.toLowerCase());
  });

  return [...new Set(keywords)];
}

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
 * DO NOT EDIT MANUALLY - Run 'npm run update-catalog' to update
 */

export const minifigCatalog = [\n`;

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    content += `  {\n`;
    content += `    no: '${entry.no}',\n`;
    content += `    name: '${entry.name.replace(/'/g, "\\'")}',\n`;
    content += `    keywords: [${entry.keywords.map(k => `'${k.replace(/'/g, "\\'")}'`).join(', ')}],\n`;
    content += `  }${isLast ? '' : ',}\n`;
  });

  content += `];\n`;

  return content;
}

// Run the incremental update
updateCatalogIncremental();
