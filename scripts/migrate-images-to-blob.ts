/**
 * Migrate all images from Bricklink to Vercel Blob storage
 * This will:
 * 1. Download all minifig and set images from Bricklink
 * 2. Upload to Vercel Blob
 * 3. Update catalog JSON files with Blob URLs
 * 4. Update theme-images-cache.json with Blob URLs
 *
 * IMPORTANT: Blob store must be configured as PUBLIC
 * See BLOB_STORAGE_SETUP.md for setup instructions
 *
 * Run: BLOB_READ_WRITE_TOKEN=xxx npx tsx scripts/migrate-images-to-blob.ts [minifigs|sets|themes]
 */

import { put, head } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

interface MinifigItem {
  minifigure_no: string;
  image_url: string;
  [key: string]: any;
}

interface SetItem {
  box_no: string;
  image_url: string;
  [key: string]: any;
}

interface ThemeCache {
  themes: Record<string, {
    representativeImage: string;
    fallbackImages: string[];
    [key: string]: any;
  }>;
  [key: string]: any;
}

const BRICKLINK_BASE = 'https://img.bricklink.com/ItemImage';

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch (err) {
    return null;
  }
}

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN!;

async function uploadToBlob(buffer: Buffer, pathname: string): Promise<string> {
  // Try public access first (for public stores)
  // Falls back to private if store is not public
  let access: 'public' | 'private' = 'public';

  try {
    const blob = await put(pathname, buffer, {
      access,
      token: BLOB_TOKEN,
      addRandomSuffix: false,
    });
    return blob.url;
  } catch (error: any) {
    // If public fails because store is private, retry with private access
    if (error?.message?.includes('Cannot use public access on a private store')) {
      console.warn('⚠️  Store is configured as PRIVATE. Images will not be publicly accessible!');
      console.warn('   See BLOB_STORAGE_SETUP.md to fix this.\n');

      const blob = await put(pathname, buffer, {
        access: 'private',
        token: BLOB_TOKEN,
        addRandomSuffix: false,
      });
      return blob.url;
    }
    throw error;
  }
}

async function checkBlobExists(pathname: string): Promise<string | null> {
  try {
    const blobInfo = await head(pathname, { token: BLOB_TOKEN });
    return blobInfo ? blobInfo.url : null;
  } catch (err) {
    return null;
  }
}

async function migrateMinifigImages() {
  console.log('\n📷 Migrating minifig images...');

  const catalogPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
  const content = await fs.readFile(catalogPath, 'utf-8');
  const minifigs: MinifigItem[] = JSON.parse(content);

  console.log(`Found ${minifigs.length} minifigs`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const minifig of minifigs) {
    const itemNo = minifig.minifigure_no;
    const blobPath = `minifigs/${itemNo}.png`;

    try {
      // Check if already uploaded
      const existingUrl = await checkBlobExists(blobPath);
      if (existingUrl) {
        minifig.image_url = existingUrl;
        skipped++;
        if (skipped % 100 === 0) {
          console.log(`⏭️  Skipped ${skipped} (already uploaded)`);
        }
        continue;
      }

      // Download from Bricklink (try both MN and SN)
      const urls = [
        `${BRICKLINK_BASE}/MN/0/${itemNo}.png`,
        `${BRICKLINK_BASE}/SN/0/${itemNo}.png`,
      ];

      let imageBuffer: Buffer | null = null;
      for (const url of urls) {
        imageBuffer = await downloadImage(url);
        if (imageBuffer) break;
      }

      if (!imageBuffer) {
        console.log(`❌ ${itemNo}: No image available`);
        failed++;
        continue;
      }

      // Upload to Blob
      const blobUrl = await uploadToBlob(imageBuffer, blobPath);
      minifig.image_url = blobUrl;
      uploaded++;

      if (uploaded % 50 === 0) {
        console.log(`✅ Uploaded ${uploaded}/${minifigs.length}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));

    } catch (error) {
      console.error(`❌ ${itemNo}: ${error}`);
      failed++;
    }
  }

  // Save updated catalog
  await fs.writeFile(catalogPath, JSON.stringify(minifigs, null, 2));

  console.log(`\n✨ Minifigs complete: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

async function migrateSetImages() {
  console.log('\n📦 Migrating set images...');

  const catalogPath = path.join(process.cwd(), 'public/catalog/boxes.json');
  const content = await fs.readFile(catalogPath, 'utf-8');
  const sets: SetItem[] = JSON.parse(content);

  console.log(`Found ${sets.length} sets`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const set of sets) {
    const boxNo = set.box_no;
    const blobPath = `sets/${boxNo}.png`;

    try {
      // Check if already uploaded
      const existingUrl = await checkBlobExists(blobPath);
      if (existingUrl) {
        set.image_url = existingUrl;
        skipped++;
        if (skipped % 100 === 0) {
          console.log(`⏭️  Skipped ${skipped} (already uploaded)`);
        }
        continue;
      }

      // Download from Bricklink (try both ON and SN)
      const urls = [
        `${BRICKLINK_BASE}/ON/0/${boxNo}.png`,
        `${BRICKLINK_BASE}/SN/0/${boxNo}.png`,
      ];

      let imageBuffer: Buffer | null = null;
      for (const url of urls) {
        imageBuffer = await downloadImage(url);
        if (imageBuffer) break;
      }

      if (!imageBuffer) {
        console.log(`❌ ${boxNo}: No image available`);
        failed++;
        continue;
      }

      // Upload to Blob
      const blobUrl = await uploadToBlob(imageBuffer, blobPath);
      set.image_url = blobUrl;
      uploaded++;

      if (uploaded % 50 === 0) {
        console.log(`✅ Uploaded ${uploaded}/${sets.length}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));

    } catch (error) {
      console.error(`❌ ${boxNo}: ${error}`);
      failed++;
    }
  }

  // Save updated catalog
  await fs.writeFile(catalogPath, JSON.stringify(sets, null, 2));

  console.log(`\n✨ Sets complete: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

async function migrateThemeImages() {
  console.log('\n🎨 Migrating theme images...');

  const cachePath = path.join(process.cwd(), 'lib/theme-images-cache.json');
  const content = await fs.readFile(cachePath, 'utf-8');
  const themeCache: ThemeCache = JSON.parse(content);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [themeName, themeData] of Object.entries(themeCache.themes)) {
    try {
      // Migrate representative image
      if (themeData.representativeImage?.includes('bricklink.com')) {
        const setNo = themeData.representativeImage.match(/\/([^/]+)\.png$/)?.[1];
        if (setNo) {
          const blobPath = `sets/${setNo}.png`;
          const existingUrl = await checkBlobExists(blobPath);

          if (existingUrl) {
            themeData.representativeImage = existingUrl;
            skipped++;
          } else {
            const imageBuffer = await downloadImage(themeData.representativeImage);
            if (imageBuffer) {
              const blobUrl = await uploadToBlob(imageBuffer, blobPath);
              themeData.representativeImage = blobUrl;
              uploaded++;
              console.log(`✅ ${themeName}: ${setNo}`);
              await new Promise(resolve => setTimeout(resolve, 50));
            } else {
              console.log(`❌ ${themeName}: ${setNo} (failed download)`);
              failed++;
            }
          }
        }
      }

      // Migrate fallback images
      if (themeData.fallbackImages) {
        for (let i = 0; i < themeData.fallbackImages.length; i++) {
          const fallbackUrl = themeData.fallbackImages[i];
          if (fallbackUrl?.includes('bricklink.com')) {
            const setNo = fallbackUrl.match(/\/([^/]+)\.png$/)?.[1];
            if (setNo) {
              const blobPath = `sets/${setNo}.png`;
              const existingUrl = await checkBlobExists(blobPath);

              if (existingUrl) {
                themeData.fallbackImages[i] = existingUrl;
                skipped++;
              } else {
                const imageBuffer = await downloadImage(fallbackUrl);
                if (imageBuffer) {
                  const blobUrl = await uploadToBlob(imageBuffer, blobPath);
                  themeData.fallbackImages[i] = blobUrl;
                  uploaded++;
                  await new Promise(resolve => setTimeout(resolve, 50));
                }
              }
            }
          }
        }
      }

    } catch (error) {
      console.error(`❌ ${themeName}: ${error}`);
      failed++;
    }
  }

  // Save updated cache
  themeCache._lastUpdated = new Date().toISOString();
  await fs.writeFile(cachePath, JSON.stringify(themeCache, null, 2));

  console.log(`\n✨ Theme images complete: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

async function main() {
  console.log('🚀 Starting image migration to Vercel Blob...\n');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required');
  }

  const args = process.argv.slice(2);
  const type = args[0]; // 'minifigs', 'sets', 'themes', or undefined for all

  const startTime = Date.now();

  if (!type || type === 'minifigs') {
    await migrateMinifigImages();
  }

  if (!type || type === 'sets') {
    await migrateSetImages();
  }

  if (!type || type === 'themes') {
    await migrateThemeImages();
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
  console.log(`\n🎉 Migration complete! Total time: ${duration} minutes`);
}

main().catch(console.error);
