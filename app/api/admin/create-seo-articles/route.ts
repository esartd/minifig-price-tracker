import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { ArticleBlock } from '@/types/article';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const { article } = await request.json();

    if (!article || !['pricing', 'selling'].includes(article)) {
      return NextResponse.json({
        error: 'Invalid article type. Use "pricing" or "selling"'
      }, { status: 400 });
    }

    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'ericksu0c@gmail.com' },
          { email: { contains: 'admin' } }
        ]
      }
    });

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 500 });
    }

    if (article === 'pricing') {
      return await createPricingGuide(adminUser.id);
    } else {
      return await createSellingGuide(adminUser.id);
    }
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json({
      error: 'Failed to create article',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function createPricingGuide(authorId: string) {
  const slug = 'how-to-price-lego-minifigures';

  // Check if exists
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({
      success: false,
      message: 'Article already exists',
      url: `/articles/${slug}`
    });
  }

  // Import content from the script file
  const { contentBlocksEN, translations } = await import('@/scripts/create-pricing-guide-data');

  // Create article
  const article = await prisma.article.create({
    data: {
      slug,
      status: 'published',
      featured: true,
      authorId,
      publishedAt: new Date(),
      contentBlocks: JSON.stringify(contentBlocksEN),
      readTimeMinutes: 12,
      category: 'Guide',
    },
  });

  // Create translations
  for (const translation of translations) {
    await prisma.articleTranslation.create({
      data: {
        articleId: article.id,
        locale: translation.locale,
        title: translation.title,
        description: translation.description,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
        metaKeywords: translation.metaKeywords,
      },
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Pricing guide created successfully',
    articleId: article.id,
    url: `/articles/${slug}`
  });
}

async function createSellingGuide(authorId: string) {
  const slug = 'selling-lego-on-bricklink';

  // Check if exists
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({
      success: false,
      message: 'Article already exists',
      url: `/articles/${slug}`
    });
  }

  // Import content from the script file
  const { contentBlocksEN, translations } = await import('@/scripts/create-selling-guide-data');

  // Create article
  const article = await prisma.article.create({
    data: {
      slug,
      status: 'published',
      featured: true,
      authorId,
      publishedAt: new Date(),
      contentBlocks: JSON.stringify(contentBlocksEN),
      readTimeMinutes: 15,
      category: 'Guide',
    },
  });

  // Create translations
  for (const translation of translations) {
    await prisma.articleTranslation.create({
      data: {
        articleId: article.id,
        locale: translation.locale,
        title: translation.title,
        description: translation.description,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
        metaKeywords: translation.metaKeywords,
      },
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Selling guide created successfully',
    articleId: article.id,
    url: `/articles/${slug}`
  });
}
