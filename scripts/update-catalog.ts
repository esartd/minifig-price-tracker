/**
 * Catalog Update Script
 *
 * Fetches all Star Wars minifigures from Rebrickable, validates them against BrickLink,
 * and updates the local catalog file with validated entries.
 *
 * Run: npm run update-catalog
 * Test mode (10 results): npm run update-catalog -- --test
 */

import * as dotenv from 'dotenv';
import { rebrickableAPI } from '../lib/rebrickable';
import { bricklinkAPI } from '../lib/bricklink';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local (where API keys are stored)
dotenv.config({ path: path.join(__dirname, '../.env.local') });

interface CatalogEntry {
  no: string;
  name: string;
  keywords: string[];
}

async function updateCatalog() {
  console.log('🚀 Starting Star Wars minifigure catalog update...\n');

  // Check if running in test mode (limit to 10 results)
  const testMode = process.argv.includes('--test');

  try {
    // Fetch all Star Wars minifigures from Rebrickable
    console.log('📡 Fetching Star Wars minifigures from Rebrickable...');
    const rebrickableMinifigs = await rebrickableAPI.searchMinifigures('star wars');

    if (rebrickableMinifigs.length === 0) {
      console.log('❌ No minifigures found from Rebrickable');
      return;
    }

    console.log(`📊 Found ${rebrickableMinifigs.length} minifigures from Rebrickable`);

    if (testMode) {
      console.log('⚠️  TEST MODE: Only processing first 10 results\n');
      rebrickableMinifigs.splice(10);
    } else {
      console.log('');
    }

    // Validate each minifig against BrickLink API
    console.log('🔍 Validating against BrickLink API...');
    console.log('   (This checks if Rebrickable IDs actually work with BrickLink pricing)\n');
    const validatedEntries: CatalogEntry[] = [];
    const failedIds: string[] = [];
    let validated = 0;
    let failed = 0;

    for (const minifig of rebrickableMinifigs) {
      process.stdout.write(`\r   Progress: ${validated + failed}/${rebrickableMinifigs.length} (${validated} valid, ${failed} failed)`);

      const bricklinkMinifig = await bricklinkAPI.getMinifigureByNumber(minifig.no);

      if (bricklinkMinifig) {
        // Successfully validated - add to catalog
        const keywords = extractKeywords(bricklinkMinifig.name);
        validatedEntries.push({
          no: bricklinkMinifig.no,
          name: bricklinkMinifig.name,
          keywords: keywords
        });
        validated++;
      } else {
        failed++;
        failedIds.push(minifig.no);
      }

      // Add delay to respect API rate limits (BrickLink ToS: 5,000 calls/day max)
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds - safe rate limit
    }

    console.log(`\n\n✅ Validation complete: ${validated} valid, ${failed} failed`);
    console.log(`   Success rate: ${((validated / rebrickableMinifigs.length) * 100).toFixed(1)}%\n`);

    if (testMode && failedIds.length > 0) {
      console.log('❌ Failed IDs:');
      failedIds.forEach(id => console.log(`   - ${id}`));
      console.log('');
    }

    if (validatedEntries.length === 0) {
      console.log('❌ No valid minifigures to add to catalog');
      return;
    }

    // Sort by item number
    validatedEntries.sort((a, b) => a.no.localeCompare(b.no));

    // Generate the catalog file content
    const catalogContent = generateCatalogFile(validatedEntries);

    // Write to file
    const catalogPath = path.join(__dirname, '../lib/minifig-catalog.ts');
    fs.writeFileSync(catalogPath, catalogContent, 'utf-8');

    console.log(`💾 Updated catalog file: ${catalogPath}`);
    console.log(`📦 Total entries: ${validatedEntries.length}`);
    console.log(`🎉 Catalog update complete!\n`);

    // Print summary statistics
    printSummary(validatedEntries);

  } catch (error) {
    console.error('\n❌ Error updating catalog:', error);
    process.exit(1);
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
 * Auto-generated catalog of Star Wars minifigures validated against BrickLink API.
 * Last updated: ${timestamp}
 * Total entries: ${entries.length}
 *
 * DO NOT EDIT MANUALLY - Run 'npx tsx scripts/update-catalog.ts' to update
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
}

// Run the update
updateCatalog();
