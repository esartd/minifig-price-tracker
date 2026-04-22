import { put } from '@vercel/blob';

async function test() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN required');
  }

  console.log('Testing blob upload with public access...');

  try {
    console.log('Attempting with access: public...');
    const result = await put('test/test-public.txt', 'test content', {
      access: 'public',
      token,
    });

    console.log('✅ Upload successful:', result.url);
    console.log('URL is public?', result.url.includes('.public.'));
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

test();
