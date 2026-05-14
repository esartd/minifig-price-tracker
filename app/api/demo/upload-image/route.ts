import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
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

    // Compress and optimize image for article pages
    // - Max width: 1200px (article content width)
    // - WebP format (better compression than JPEG/PNG)
    // - Quality: 85 (good balance between size and quality)
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, null, {
        withoutEnlargement: true, // Don't upscale smaller images
        fit: 'inside',
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Convert optimized image to base64 data URL for demo
    const base64 = optimizedBuffer.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64}`;

    return NextResponse.json({
      success: true,
      image: {
        id: `demo-${Date.now()}`,
        url: dataUrl,
        filename: file.name.replace(/\.[^/.]+$/, '.webp'), // Change extension to .webp
      },
      optimization: {
        originalSize: file.size,
        optimizedSize: optimizedBuffer.length,
        savedBytes: file.size - optimizedBuffer.length,
        compressionRatio: Math.round((1 - optimizedBuffer.length / file.size) * 100),
      },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
