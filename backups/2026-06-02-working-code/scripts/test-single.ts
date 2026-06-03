import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function test() {
  // Dynamic import AFTER dotenv has loaded
  const { bricklinkAPI } = await import('../lib/bricklink.js');

  console.log('Testing known minifig: sw0001a (Darth Vader)');
  const result = await bricklinkAPI.getMinifigureByNumber('sw0001a');
  console.log('Result:', JSON.stringify(result, null, 2));
}

test();
