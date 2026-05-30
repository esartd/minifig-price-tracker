/**
 * Test if BrickLink API key is still working
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testAPIKey() {
  console.log('🔍 Testing BrickLink API key...\n');

  const { bricklinkAPI } = await import('../lib/bricklink.js');

  // Test 1: Get a single minifigure
  console.log('Test 1: Getting minifigure info (hp100)...');
  try {
    const minifig = await bricklinkAPI.getMinifigureByNumber('hp100');
    if (minifig) {
      console.log(`✅ Success: ${minifig.name}\n`);
    } else {
      console.log(`❌ Failed: No data returned\n`);
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  // Test 2: Get price guide
  console.log('Test 2: Getting price guide (hp100)...');
  try {
    const priceGuide = await bricklinkAPI.getPriceGuide('hp100', 'N');
    if (priceGuide) {
      console.log(`✅ Success: Avg price $${priceGuide.avg_price}\n`);
    } else {
      console.log(`❌ Failed: No price data returned\n`);
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  console.log('🏁 API key test complete');
}

testAPIKey().catch(console.error);
