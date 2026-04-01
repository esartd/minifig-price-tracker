import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function findNewThemeRanges() {
  // Dynamic import AFTER dotenv has loaded
  const { bricklinkAPI } = await import('../lib/bricklink.js');

  console.log('🔍 Finding actual ranges for new LEGO themes...\n');

  const themes = [
    { prefix: 'mar', name: 'Marvel Super Heroes', padding: 4 },
    { prefix: 'jw', name: 'Jurassic World', padding: 3 },
    { prefix: 'spd', name: 'Spider-Man', padding: 3 },
    { prefix: 'sim', name: 'The Simpsons', padding: 3 },
    { prefix: 'gb', name: 'Ghostbusters', padding: 3 },
    { prefix: 'sp', name: 'Space', padding: 3 },
    { prefix: 'trn', name: 'Train', padding: 3 },
    { prefix: 'rac', name: 'Racers', padding: 3 },
    { prefix: 'hrf', name: 'Hidden Side', padding: 3 },
    { prefix: 'ovr', name: 'Overwatch', padding: 3 },
  ];

  for (const theme of themes) {
    console.log(`\n📋 ${theme.name} (${theme.prefix}):`);

    // Binary search to find the max
    let low = 1;
    let high = 1000;
    let lastFound = 0;

    // First, quickly check if any exist
    const firstId = `${theme.prefix}${'1'.padStart(theme.padding, '0')}`;
    const first = await bricklinkAPI.getMinifigureByNumber(firstId);
    if (!first) {
      console.log(`   ❌ No minifigs found (checked ${firstId})`);
      await new Promise(r => setTimeout(r, 100));
      continue;
    }

    lastFound = 1;
    console.log(`   ✅ Found: ${firstId} - ${first.name}`);

    // Now find the highest number
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const id = `${theme.prefix}${mid.toString().padStart(theme.padding, '0')}`;

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

    console.log(`   📊 Range: ${theme.prefix}${'1'.padStart(theme.padding, '0')} - ${theme.prefix}${lastFound.toString().padStart(theme.padding, '0')} (max: ${lastFound})`);
  }

  console.log('\n\n✅ Range finding complete!');
}

findNewThemeRanges().catch(console.error);
