import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function findThemeRanges() {
  // Dynamic import AFTER dotenv has loaded
  const { bricklinkAPI } = await import('../lib/bricklink.js');

  console.log('🔍 Finding actual ranges for BrickLink themes...\n');

  const themes = [
    { prefix: 'hp', name: 'Harry Potter' },
    { prefix: 'dis', name: 'Disney' },
    { prefix: 'dp', name: 'Disney Princess' },
    { prefix: 'lor', name: 'Lord of the Rings' },
    { prefix: 'hob', name: 'The Hobbit' },
    { prefix: 'tlm', name: 'The LEGO Movie' },
    { prefix: 'col', name: 'Collectible Minifigures' },
    { prefix: 'cas', name: 'Castle' },
    { prefix: 'pi', name: 'Pirates' },
    { prefix: 'poc', name: 'Pirates Caribbean' },
    { prefix: 'atl', name: 'Atlantis' },
    { prefix: 'dim', name: 'Dimensions' },
    { prefix: 'tlb', name: 'LEGO Batman Movie' },
    { prefix: 'tln', name: 'LEGO Ninjago Movie' },
    { prefix: 'elf', name: 'Elves' },
    { prefix: 'nex', name: 'Nexo Knights' },
  ];

  for (const theme of themes) {
    console.log(`\n📋 ${theme.name} (${theme.prefix}):`);

    // Binary search to find the max
    let low = 1;
    let high = 500;
    let lastFound = 0;

    // First, quickly check if any exist
    const first = await bricklinkAPI.getMinifigureByNumber(`${theme.prefix}001`);
    if (!first) {
      console.log(`   ❌ No minifigs found (checked ${theme.prefix}001)`);
      await new Promise(r => setTimeout(r, 100));
      continue;
    }

    lastFound = 1;
    console.log(`   ✅ Found: ${theme.prefix}001 - ${first.name}`);

    // Now find the highest number
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const id = `${theme.prefix}${mid.toString().padStart(3, '0')}`;

      const result = await bricklinkAPI.getMinifigureByNumber(id);

      if (result) {
        lastFound = mid;
        console.log(`   ✅ Found: ${id}`);
        low = mid + 1;
      } else {
        high = mid - 1;
      }

      await new Promise(r => setTimeout(r, 100));
    }

    console.log(`   📊 Range: ${theme.prefix}001 - ${theme.prefix}${lastFound.toString().padStart(3, '0')} (${lastFound} total)`);
  }

  console.log('\n\n✅ Range finding complete!');
}

findThemeRanges().catch(console.error);
