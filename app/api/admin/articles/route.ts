import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { ArticleData } from '@/types/article';
import { gunzipSync } from 'zlib';

export const runtime = 'edge';


// Increase payload size limit for large articles
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    let data: ArticleData;

    // Check if request is gzipped
    const contentEncoding = request.headers.get('content-encoding');
    if (contentEncoding === 'gzip') {
      // Decompress gzipped payload
      const arrayBuffer = await request.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const decompressed = gunzipSync(buffer);
      data = JSON.parse(decompressed.toString('utf-8'));
    } else {
      // Standard JSON
      data = await request.json();
    }

    const article = await prisma.article.create({
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
    console.error('Article creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create article' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const locale = searchParams.get('locale');
    const slug = searchParams.get('slug');

    const articles = await prisma.article.findMany({
      where: {
        ...(status && { status }),
        ...(slug && { slug }),
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Parse JSON fields and filter by locale if specified
    const parsed = articles.map(article => ({
      ...article,
      contentBlocks: JSON.parse(article.contentBlocks as string),
      translations: JSON.parse(article.translations as string),
    })).filter(article => {
      if (!locale) return true;
      return article.translations.some((t: any) => t.locale === locale);
    });

    return NextResponse.json({ articles: parsed });
  } catch (error: any) {
    console.error('Articles fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
