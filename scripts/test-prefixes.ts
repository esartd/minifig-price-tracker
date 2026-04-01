import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testPrefixes() {
  // Dynamic import AFTER dotenv has loaded
  const { bricklinkAPI } = await import('../lib/bricklink.js');

  console.log('🔍 Testing BrickLink prefix formats...\n');

  // Try different prefix formats for popular themes
  const tests = [
    // Harry Potter attempts
    { id: 'hp001', theme: 'Harry Potter' },
    { id: 'hp0001', theme: 'Harry Potter' },
    { id: 'hp1', theme: 'Harry Potter' },
    { id: 'hp01', theme: 'Harry Potter' },
    { id: 'hp101', theme: 'Harry Potter' },

    // Disney attempts
    { id: 'dis001', theme: 'Disney' },
    { id: 'dis0001', theme: 'Disney' },
    { id: 'dis1', theme: 'Disney' },
    { id: 'dp001', theme: 'Disney Princess' },
    { id: 'dp0001', theme: 'Disney Princess' },
    { id: 'dp1', theme: 'Disney Princess' },

    // LOTR attempts
    { id: 'lor001', theme: 'LOTR' },
    { id: 'lor0001', theme: 'LOTR' },
    { id: 'lor1', theme: 'LOTR' },

    // Hobbit attempts
    { id: 'hob001', theme: 'Hobbit' },
    { id: 'hob0001', theme: 'Hobbit' },
    { id: 'hob1', theme: 'Hobbit' },
  ];

  for (const test of tests) {
    try {
      const result = await bricklinkAPI.getMinifigureByNumber(test.id);
      if (result) {
        console.log(`✅ FOUND: ${test.id} (${test.theme}) - ${result.name}`);
      }
    } catch (error) {
      // Ignore errors, just means not found
    }

    // Delay to respect API limits (BrickLink ToS: 5,000 calls/day max)
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds - safe rate limit
  }

  console.log('\n✅ Prefix test complete!');
}

testPrefixes().catch(console.error);
