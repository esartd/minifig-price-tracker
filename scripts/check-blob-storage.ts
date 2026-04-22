import { list } from '@vercel/blob';

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    console.log('❌ No BLOB_READ_WRITE_TOKEN found');
    process.exit(1);
  }

  console.log('🔍 Checking Vercel Blob Storage...\n');

  const { blobs } = await list({ token });

  console.log(`📊 Total blobs: ${blobs.length}\n`);

  if (blobs.length === 0) {
    console.log('⚠️  No blobs found in storage\n');
    return;
  }

  const byPrefix = blobs.reduce((acc, blob) => {
    const prefix = blob.pathname.split('/')[0];
    acc[prefix] = (acc[prefix] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('Blobs by directory:');
  Object.entries(byPrefix)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([prefix, count]) => {
      console.log(`  ${prefix}/: ${count} files`);
    });

  const totalSize = blobs.reduce((sum, blob) => sum + blob.size, 0);
  console.log(`\n💾 Total storage used: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
