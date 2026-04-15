/**
 * Test Script: BrickLink Sets API
 *
 * Tests the /supersets endpoint to fetch which sets contain a minifigure.
 * Usage: npx tsx scripts/test-sets-api.ts
 */

import { bricklinkAPI } from '../lib/bricklink';

async function testSetsAPI() {
  console.log('🧪 Testing BrickLink Sets API...\n');

  // Test with popular Star Wars minifig: Luke Skywalker
  const testMinifigs = [
    'sw0001a', // Luke Skywalker (X-Wing Pilot)
    'sw0105',  // Darth Vader
    'hp001',   // Harry Potter (if you want to test HP too)
  ];

  for (const minifigNo of testMinifigs) {
    console.log(`\n📦 Fetching sets for ${minifigNo}...`);

    try {
      const sets = await bricklinkAPI.getSetsContainingMinifig(minifigNo);

      if (sets.length === 0) {
        console.log(`   ⚠️  No sets found (might be on localhost - API is blocked)`);
      } else {
        console.log(`   ✅ Found ${sets.length} sets:`);
        sets.slice(0, 5).forEach(set => {
          console.log(`      - ${set.no}: ${set.name} (×${set.quantity})`);
        });

        if (sets.length > 5) {
          console.log(`      ... and ${sets.length - 5} more`);
        }
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Add delay between requests to respect rate limits
    if (minifigNo !== testMinifigs[testMinifigs.length - 1]) {
      console.log('   ⏳ Waiting 3 seconds (rate limit)...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n✨ Test complete!\n');
}

testSetsAPI().catch(console.error);
