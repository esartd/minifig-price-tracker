/**
 * Theme Discovery Script
 *
 * Automatically discovers new LEGO themes by checking common prefixes.
 * Suggests new themes to add to enumeration scripts.
 *
 * Run: npx tsx scripts/discover-new-themes.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function discoverNewThemes() {
  console.log('🔍 Discovering new LEGO themes from BrickLink...\n');

  const { bricklinkAPI } = await import('../lib/bricklink.js');

  // Common theme prefixes to try (2-5 letters)
  const potentialPrefixes = [
    // Common patterns
    'mar', 'dc', 'jw', 'fb', 'spd', 'bat', 'sup', 'inc', 'toy',
    'fro', 'moana', 'cars', 'min', 'scb', 'tlr', 'ucs',
    // Variations
    'colmar', 'coldc', 'coljw', 'coldp', 'colfb',
    // New potential themes
    'avt', 'ww', 'aqua', 'jl', 'gg', 'mn', 'drm',
  ];

  const foundThemes: Array<{prefix: string, sample: string, name: string}> = [];

  console.log(`Testing ${potentialPrefixes.length} potential theme prefixes...\n`);

  for (const prefix of potentialPrefixes) {
    process.stdout.write(`\r   Testing: ${prefix.padEnd(10)} | Found: ${foundThemes.length}`);

    try {
      // Try prefix0001
      const itemNo = `${prefix}0001`;
      const minifig = await bricklinkAPI.getMinifigureByNumber(itemNo);

      if (minifig) {
        foundThemes.push({
          prefix: prefix,
          sample: minifig.no,
          name: minifig.name
        });
        console.log(`\r   ✨ Found new theme: ${prefix} (${minifig.no}: ${minifig.name})`);
      }
    } catch (error) {
      // Not found, continue
    }

    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds - safe rate limit
  }

  console.log(`\n\n📊 Discovery complete!\n`);

  if (foundThemes.length === 0) {
    console.log('No new themes discovered.');
    return;
  }

  console.log(`Found ${foundThemes.length} potential new themes:\n`);
  foundThemes.forEach(theme => {
    console.log(`   ${theme.prefix.padEnd(8)} → ${theme.sample}: ${theme.name}`);
  });

  console.log('\n💡 To add these themes to your enumeration:');
  console.log('   1. Open scripts/enumerate-catalog.ts');
  console.log('   2. Add to the themes array:');
  console.log('');
  foundThemes.forEach(theme => {
    const maxGuess = estimateMax(theme.prefix);
    console.log(`   { prefix: '${theme.prefix}', name: 'New Theme', max: ${maxGuess} },`);
  });
  console.log('');
}

function estimateMax(prefix: string): number {
  // Guess reasonable max based on prefix length and type
  if (prefix.startsWith('col')) return 50; // Collectible series
  if (prefix.length >= 5) return 100; // Long prefixes = smaller themes
  if (prefix.length === 2) return 1500; // Short prefixes = major themes
  return 500; // Default guess
}

discoverNewThemes();
