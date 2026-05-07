import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { slug, category, featured, status, contentBlocks, translations } = body;

    // Validate required fields
    if (!slug || !translations || translations.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.article.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
    }

    // Create article with translations
    const article = await prisma.article.create({
      data: {
        slug,
        category,
        featured: featured || false,
        status: status || 'draft',
        contentBlocks: contentBlocks || [],
        authorId: auth.userId!,
        publishedAt: status === 'published' ? new Date() : null,
        translations: {
          create: translations.map((t: any) => ({
            locale: t.locale,
            title: t.title,
            description: t.description,
            metaTitle: t.metaTitle,
            metaDescription: t.metaDescription,
            metaKeywords: t.metaKeywords || [],
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json({
      success: true,
      article,
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
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        translations: {
          where: { locale: 'en' },
          select: {
            title: true,
            description: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Articles fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
