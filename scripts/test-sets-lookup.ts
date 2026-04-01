/**
 * Test script to look up which sets contain a minifigure
 *
 * Usage: npx tsx scripts/test-sets-lookup.ts sw0001
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testSetsLookup() {
  const { bricklinkAPI } = await import('../lib/bricklink.js');

  // Get minifig number from command line args or use default
  const minifigNo = process.argv[2] || 'sw0001';

  console.log(`🔍 Looking up sets containing minifig: ${minifigNo}\n`);

  // Get minifig info
  const minifig = await bricklinkAPI.getMinifigureByNumber(minifigNo);
  if (!minifig) {
    console.log(`❌ Minifigure ${minifigNo} not found`);
    return;
  }

  console.log(`✅ Found: ${minifig.name}\n`);

  // Get sets containing this minifig
  console.log(`📦 Fetching sets (this may take a moment)...\n`);

  const sets = await bricklinkAPI.getSetsContainingMinifig(minifigNo);

  if (sets.length === 0) {
    console.log(`❌ No sets found for ${minifigNo}`);
    console.log(`   This minifigure might be exclusive or not yet cataloged in sets.`);
    return;
  }

  console.log(`\n✅ Found ${sets.length} set(s):\n`);
  sets.forEach((set, index) => {
    console.log(`${index + 1}. ${set.no}: ${set.name}`);
    if (set.quantity > 1) {
      console.log(`   Quantity: ${set.quantity}x`);
    }
  });

  console.log('\n');
}

testSetsLookup().catch(console.error);
