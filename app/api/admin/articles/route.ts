import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { PrismaClient } from '../../../../../node_modules/.prisma/client-hostinger/index.js';
import { ArticleData } from '@/types/article';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const data: ArticleData = await request.json();

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

    const articles = await prisma.article.findMany({
      where: {
        ...(status && { status }),
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
