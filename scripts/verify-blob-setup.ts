/**
 * Verify Blob Storage is properly configured for public image hosting
 */

import { put, del, list } from '@vercel/blob';

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is required');
    process.exit(1);
  }

  console.log('🔍 Verifying Blob Storage Configuration...\n');

  // Test 1: Upload with public access
  console.log('Test 1: Uploading test file with public access...');
  try {
    const testBlob = await put('test/verification-test.txt', 'test content', {
      access: 'public',
      token,
    });

    console.log('✅ Public upload successful');
    console.log(`   URL: ${testBlob.url}`);

    // Test 2: Verify URL is publicly accessible
    console.log('\nTest 2: Checking if URL is publicly accessible...');
    const response = await fetch(testBlob.url);

    if (response.ok) {
      console.log('✅ URL is publicly accessible (no authentication required)');
      console.log(`   Status: ${response.status} ${response.statusText}`);
    } else {
      console.error('❌ URL returned error:', response.status, response.statusText);
      console.error('   This means the store is configured as Private');
      console.error('   See BLOB_STORAGE_SETUP.md to fix this');
    }

    // Cleanup
    console.log('\nTest 3: Cleaning up test file...');
    await del(testBlob.url, { token });
    console.log('✅ Cleanup successful');

    // Check existing images
    console.log('\nTest 4: Checking existing images...');
    const { blobs } = await list({ token, prefix: 'minifigs/', limit: 1 });

    if (blobs.length > 0) {
      const imageUrl = blobs[0].url;
      console.log(`   Sample image: ${imageUrl}`);

      const imageResponse = await fetch(imageUrl);
      if (imageResponse.ok) {
        console.log('✅ Existing images are publicly accessible');
      } else {
        console.error('❌ Existing images return', imageResponse.status);
        console.error('   Existing images were uploaded with private access');
        console.error('   You may need to re-upload them after changing store to public');
      }
    } else {
      console.log('   No existing images found');
    }

    console.log('\n✅ Blob storage is properly configured!');
    console.log('   You can now run: npx tsx scripts/migrate-images-to-blob.ts');

  } catch (error: any) {
    console.error('\n❌ Blob storage configuration error:');
    console.error(`   ${error.message}`);

    if (error.message.includes('Cannot use public access on a private store')) {
      console.error('\n🔧 FIX REQUIRED:');
      console.error('   1. Go to: https://vercel.com/es-art-d-llc/~/stores/blob/store_MYfdAzItDm3dwfMR');
      console.error('   2. Change Access from "Private" to "Public"');
      console.error('   3. Save changes');
      console.error('   4. Run this script again to verify');
      console.error('\n   See BLOB_STORAGE_SETUP.md for detailed instructions');
    }

    process.exit(1);
  }
}

main().catch(console.error);
