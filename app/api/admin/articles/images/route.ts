import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAdmin } from '@/lib/admin-auth';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'edge';


export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress and optimize image
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Generate filename with .webp extension
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalName}.webp`;

    let imageUrl: string;
    let storageMethod: string;

    // Check if we're in production with Blob storage
    // Support both token names (Vercel generates different names)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN_2_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
    const hasBlobToken = !!blobToken;
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

    if (!hasBlobToken && isProduction) {
      // ERROR: Production without Blob token
      return NextResponse.json({
        error: 'Image storage not configured',
        details: 'BLOB_READ_WRITE_TOKEN is required in production. Please add it in Vercel Dashboard → Settings → Environment Variables',
        instructions: [
          '1. Go to https://vercel.com/dashboard',
          '2. Select your project → Settings → Storage',
          '3. Create or connect Blob Storage',
          '4. Copy BLOB_READ_WRITE_TOKEN',
          '5. Add it to Environment Variables',
          '6. Redeploy'
        ]
      }, { status: 500 });
    }

    if (hasBlobToken) {
      // Production: Use Vercel Blob Storage
      console.log('Using Vercel Blob Storage');
      const blob = await put(`articles/${filename}`, optimizedBuffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/webp',
        token: blobToken,
      });
      imageUrl = blob.url;
      storageMethod = 'vercel-blob';
    } else {
      // Development: Save to local public folder
      console.log('Using local filesystem storage');
      const publicDir = path.join(process.cwd(), 'public', 'uploads', 'articles');

      try {
        // Ensure directory exists
        await mkdir(publicDir, { recursive: true });

        // Save file
        const filePath = path.join(publicDir, filename);
        await writeFile(filePath, optimizedBuffer);

        // Return local URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        imageUrl = `${baseUrl}/uploads/articles/${filename}`;
        storageMethod = 'local-filesystem';
      } catch (fsError) {
        console.error('Filesystem write error:', fsError);
        return NextResponse.json({
          error: 'Failed to save image to filesystem',
          details: fsError instanceof Error ? fsError.message : String(fsError),
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      image: {
        id: `img-${timestamp}`,
        url: imageUrl,
        filename: filename,
      },
      optimization: {
        originalSize: file.size,
        optimizedSize: optimizedBuffer.length,
        savedBytes: file.size - optimizedBuffer.length,
        compressionRatio: Math.round((1 - optimizedBuffer.length / file.size) * 100),
      },
      storage: storageMethod,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
