import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testPadding() {
  const { bricklinkAPI } = await import('../lib/bricklink.js');

  console.log('Testing 4-digit format: hp0001');
  const test4 = await bricklinkAPI.getMinifigureByNumber('hp0001');
  console.log('Result:', test4 ? `FOUND - ${test4.name}` : 'NOT FOUND');

  await new Promise(r => setTimeout(r, 200));

  console.log('\nTesting 3-digit format: hp001');
  const test3 = await bricklinkAPI.getMinifigureByNumber('hp001');
  console.log('Result:', test3 ? `FOUND - ${test3.name}` : 'NOT FOUND');
}

testPadding();
