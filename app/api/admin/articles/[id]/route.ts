import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { ArticleData } from '@/types/article';
import { gunzipSync } from 'zlib';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const { id } = await params;

    let data: ArticleData;
    const contentEncoding = request.headers.get('content-encoding');
    if (contentEncoding === 'gzip') {
      const arrayBuffer = await request.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const decompressed = gunzipSync(buffer);
      data = JSON.parse(decompressed.toString('utf-8'));
    } else {
      data = await request.json();
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        slug: data.slug,
        status: data.status,
        featured: data.featured,
        contentBlocks: JSON.stringify(data.contentBlocks),
        translations: JSON.stringify(data.translations),
        readTimeMinutes: data.readTimeMinutes,
        category: data.category,
        publishedAt: data.status === 'published' ? new Date() : null,
      },
    });

    return NextResponse.json({
      ...article,
      contentBlocks: JSON.parse(article.contentBlocks as string),
      translations: JSON.parse(article.translations as string),
    });
  } catch (error: any) {
    console.error('Article update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const { id } = await params;

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Article delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
