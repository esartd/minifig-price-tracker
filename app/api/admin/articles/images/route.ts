import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

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

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`articles/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Save metadata to database
    const image = await prisma.articleImage.create({
      data: {
        filename: file.name,
        blobUrl: blob.url,
        uploadedBy: auth.userId!,
      },
    });

    return NextResponse.json({
      success: true,
      image: {
        id: image.id,
        url: blob.url,
        filename: file.name,
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
