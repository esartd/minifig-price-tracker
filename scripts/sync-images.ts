/**
 * Download all minifig and set images from Bricklink and upload to Vercel Blob
 * Run with: npx tsx scripts/sync-images.ts
 */

import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ImageToSync {
  id: string;
  itemNo: string;
  currentUrl: string;
  type: 'minifig' | 'set';
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadToBlob(buffer: Buffer, filename: string): Promise<string> {
  const blob = await put(filename, buffer, {
    access: 'public',
    addRandomSuffix: false,
  });
  return blob.url;
}

async function syncMinifigImages() {
  console.log('🔍 Finding minifig images to sync...');

  // Get all unique minifig numbers from catalog
  const minifigs = await prisma.$queryRaw<Array<{ minifigure_no: string }>>`
    SELECT DISTINCT minifigure_no
    FROM minifigure_catalog
    WHERE minifigure_no IS NOT NULL
    ORDER BY minifigure_no
  `;

  console.log(`📊 Found ${minifigs.length} unique minifigs`);

  let synced = 0;
  let failed = 0;
  let skipped = 0;

  for (const minifig of minifigs) {
    const itemNo = minifig.minifigure_no;

    try {
      // Try ON (Original New) first, then SN (Standard New)
      const urls = [
        `https://img.bricklink.com/ItemImage/MN/0/${itemNo}.png`,
        `https://img.bricklink.com/ItemImage/MN/0/${itemNo}.png`.replace('/MN/', '/SN/'),
      ];

      let imageBuffer: Buffer | null = null;
      let successUrl = '';

      for (const url of urls) {
        try {
          imageBuffer = await downloadImage(url);
          successUrl = url;
          break;
        } catch (err) {
          continue;
        }
      }

      if (!imageBuffer) {
        console.log(`❌ ${itemNo}: No image available`);
        failed++;
        continue;
      }

      // Upload to Vercel Blob
      const filename = `minifigs/${itemNo}.png`;
      const blobUrl = await uploadToBlob(imageBuffer, filename);

      console.log(`✅ ${itemNo}: ${blobUrl}`);
      synced++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ ${itemNo}: ${error}`);
      failed++;
    }
  }

  console.log(`\n✨ Minifigs complete: ${synced} synced, ${failed} failed, ${skipped} skipped`);
}

async function syncSetImages() {
  console.log('\n🔍 Finding set images to sync...');

  // Get all unique set numbers from boxes
  const sets = await prisma.$queryRaw<Array<{ box_no: string }>>`
    SELECT DISTINCT box_no
    FROM lego_boxes
    WHERE box_no IS NOT NULL
    ORDER BY box_no
  `;

  console.log(`📊 Found ${sets.length} unique sets`);

  let synced = 0;
  let failed = 0;

  for (const set of sets) {
    const boxNo = set.box_no;

    try {
      // Try ON (Original New) first, then SN (Standard New)
      const urls = [
        `https://img.bricklink.com/ItemImage/ON/0/${boxNo}.png`,
        `https://img.bricklink.com/ItemImage/SN/0/${boxNo}.png`,
      ];

      let imageBuffer: Buffer | null = null;

      for (const url of urls) {
        try {
          imageBuffer = await downloadImage(url);
          break;
        } catch (err) {
          continue;
        }
      }

      if (!imageBuffer) {
        console.log(`❌ ${boxNo}: No image available`);
        failed++;
        continue;
      }

      // Upload to Vercel Blob
      const filename = `sets/${boxNo}.png`;
      const blobUrl = await uploadToBlob(imageBuffer, filename);

      console.log(`✅ ${boxNo}: ${blobUrl}`);
      synced++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ ${boxNo}: ${error}`);
      failed++;
    }
  }

  console.log(`\n✨ Sets complete: ${synced} synced, ${failed} failed`);
}

async function main() {
  console.log('🚀 Starting image sync...\n');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required');
  }

  const args = process.argv.slice(2);
  const type = args[0]; // 'minifigs', 'sets', or undefined for both

  if (!type || type === 'minifigs') {
    await syncMinifigImages();
  }

  if (!type || type === 'sets') {
    await syncSetImages();
  }

  console.log('\n🎉 Image sync complete!');
  await prisma.$disconnect();
}

main().catch(console.error);
