/**
 * Comprehensive Theme Discovery Script
 * Tests for popular known LEGO themes not in current catalog
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function discoverMoreThemes() {
  console.log('🔍 Searching for popular LEGO themes...\n');

  const { bricklinkAPI } = await import('../lib/bricklink.js');

  // Known LEGO themes not in current list
  const knownThemes = [
    { prefix: 'mar', name: 'Marvel Super Heroes', padding: 4 },
    { prefix: 'jw', name: 'Jurassic World', padding: 3 },
    { prefix: 'tlb', name: 'The LEGO Batman Movie', padding: 3 },
    { prefix: 'tln', name: 'The LEGO Ninjago Movie', padding: 3 },
    { prefix: 'hob', name: 'The Hobbit', padding: 3 },
    { prefix: 'spd', name: 'Spider-Man', padding: 3 },
    { prefix: 'sim', name: 'The Simpsons', padding: 3 },
    { prefix: 'gb', name: 'Ghostbusters', padding: 3 },
    { prefix: 'scb', name: 'Scooby-Doo', padding: 3 },
    { prefix: 'bat', name: 'Batman', padding: 4 },
    { prefix: 'sp', name: 'Space', padding: 3 },
    { prefix: 'trn', name: 'Train', padding: 3 },
    { prefix: 'rac', name: 'Racers', padding: 3 },
    { prefix: 'cc', name: 'Creator', padding: 4 },
    { prefix: 'hrf', name: 'Hidden Side', padding: 3 },
    { prefix: 'ovr', name: 'Overwatch', padding: 3 },
    { prefix: 'vip', name: 'VIP', padding: 3 },
    { prefix: 'idea', name: 'Ideas', padding: 4 },
    { prefix: 'min', name: 'Minecraft', padding: 4 },
  ];

  const foundThemes: Array<{prefix: string, name: string, sample: string, sampleName: string, padding: number}> = [];

  for (const theme of knownThemes) {
    const testId = `${theme.prefix}${'1'.padStart(theme.padding, '0')}`;
    process.stdout.write(`\r   Testing: ${theme.name.padEnd(30)} (${testId.padEnd(10)}) | Found: ${foundThemes.length}`);

    try {
      const minifig = await bricklinkAPI.getMinifigureByNumber(testId);

      if (minifig) {
        foundThemes.push({
          prefix: theme.prefix,
          name: theme.name,
          sample: minifig.no,
          sampleName: minifig.name,
          padding: theme.padding
        });
        console.log(`\n   ✅ ${theme.name.padEnd(30)} → ${minifig.no}: ${minifig.name}`);
      }
    } catch (error) {
      // Not found
    }

    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds - safe rate limit
  }

  console.log(`\n\n📊 Discovery complete!\n`);
  console.log(`Found ${foundThemes.length} themes:\n`);

  foundThemes.forEach(theme => {
    console.log(`   ✓ ${theme.name.padEnd(30)} (${theme.prefix})`);
  });

  console.log('\n\n📝 To add to enumerate-catalog.ts:\n');
  foundThemes.forEach(theme => {
    console.log(`    { prefix: '${theme.prefix}', name: '${theme.name}', max: 500, padding: ${theme.padding} },`);
  });
  console.log('');
}

discoverMoreThemes().catch(console.error);
