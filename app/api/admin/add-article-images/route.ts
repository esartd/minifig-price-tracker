import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';


export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const slug = 'figtracker-vs-brickeconomy';

    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const contentBlocks = JSON.parse(article.contentBlocks as string);

    // Free-to-use Unsplash images
    const images = [
      {
        id: `block-hero-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'hero-1',
          imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80',
          alt: 'LEGO minifigures collection organization',
          caption: 'Managing your LEGO collection with accurate pricing data',
        }],
        columns: 1,
      },
      {
        id: `block-data-${Date.now() + 1}`,
        type: 'image',
        images: [{
          imageId: 'data-1',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
          alt: 'Data analysis charts and graphs',
          caption: 'Real marketplace data vs inflated listing prices',
        }],
        columns: 1,
      },
      {
        id: `block-mobile-${Date.now() + 2}`,
        type: 'image',
        images: [{
          imageId: 'mobile-1',
          imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
          alt: 'Modern mobile interface',
          caption: 'Mobile-first design for pricing on the go',
        }],
        columns: 1,
      }
    ];

    // Insert images at strategic positions
    const updatedBlocks: any[] = [];
    let addedCount = 0;
    const addedPositions: string[] = [];

    for (let i = 0; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];

      // Add hero after introduction (after block 2)
      if (i === 2) {
        const nextBlock = contentBlocks[i + 1];
        if (!nextBlock || nextBlock.type !== 'image') {
          updatedBlocks.push(images[0]);
          addedCount++;
          addedPositions.push('Hero image after introduction');
        }
      }

      // Add data image before comparison heading
      if (block.type === 'heading' && block.text?.includes('Side-by-Side Comparison')) {
        updatedBlocks.push(images[1]);
        addedCount++;
        addedPositions.push('Data visualization before comparison');
      }

      // Add mobile image before mobile heading
      if (block.type === 'heading' && block.text?.includes('Clean, Modern Mobile')) {
        updatedBlocks.push(images[2]);
        addedCount++;
        addedPositions.push('Mobile interface image');
      }

      updatedBlocks.push(block);
    }

    if (addedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new images added (may already exist)',
        addedCount: 0,
      });
    }

    // Update article
    await prisma.article.update({
      where: { slug },
      data: {
        contentBlocks: JSON.stringify(updatedBlocks)
      }
    });

    return NextResponse.json({
      success: true,
      message: `Added ${addedCount} images to article`,
      addedCount,
      addedPositions,
      viewUrl: `/articles/${slug}`,
    });
  } catch (error) {
    console.error('Failed to add images:', error);
    return NextResponse.json({
      error: 'Failed to add images',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
