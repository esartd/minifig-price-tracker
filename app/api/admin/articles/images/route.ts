import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAdmin } from '@/lib/admin-auth';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Check if we're in production with Blob storage
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (hasBlobToken) {
      // Production: Use Vercel Blob Storage
      const blob = await put(`articles/${filename}`, optimizedBuffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/webp',
      });
      imageUrl = blob.url;
    } else {
      // Development: Save to local public folder
      const publicDir = path.join(process.cwd(), 'public', 'uploads', 'articles');

      // Ensure directory exists
      await mkdir(publicDir, { recursive: true });

      // Save file
      const filePath = path.join(publicDir, filename);
      await writeFile(filePath, optimizedBuffer);

      // Return local URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      imageUrl = `${baseUrl}/uploads/articles/${filename}`;
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
      storage: hasBlobToken ? 'vercel-blob' : 'local-filesystem',
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
