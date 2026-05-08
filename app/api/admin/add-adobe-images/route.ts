import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';

    // Adobe Stock images (licensed)
    const images = [
      {
        id: `block-hero-adobe-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'adobe-hero',
          imageUrl: `${baseUrl}/uploads/articles/lego-builder-hero.jpg`,
          alt: 'LEGO collector building and organizing LEGO sets',
          caption: 'Managing your LEGO collection with accurate pricing',
        }],
        columns: 1,
      },
      {
        id: `block-mobile-adobe-${Date.now() + 1}`,
        type: 'image',
        images: [{
          imageId: 'adobe-mobile-1',
          imageUrl: `${baseUrl}/uploads/articles/mobile-pricing-woman.jpg`,
          alt: 'Using mobile app for LEGO pricing',
          caption: 'Price your collection on the go with mobile-first design',
        }],
        columns: 1,
      },
      {
        id: `block-data-adobe-${Date.now() + 2}`,
        type: 'image',
        images: [{
          imageId: 'adobe-data',
          imageUrl: `${baseUrl}/uploads/articles/laptop-data-man.jpg`,
          alt: 'Analyzing LEGO pricing data',
          caption: 'Real marketplace data for informed decisions',
        }],
        columns: 1,
      },
      {
        id: `block-mobile-2-adobe-${Date.now() + 3}`,
        type: 'image',
        images: [{
          imageId: 'adobe-mobile-2',
          imageUrl: `${baseUrl}/uploads/articles/mobile-couch-woman.jpg`,
          alt: 'Relaxed mobile pricing experience',
          caption: 'Accessible pricing tools without paywalls',
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

      // Remove any existing Unsplash images to avoid duplicates
      if (block.type === 'image' && block.images?.[0]?.imageUrl?.includes('unsplash.com')) {
        console.log('Removing old Unsplash image');
        continue;
      }

      // Add LEGO builder hero after introduction (after block 2)
      if (i === 2) {
        const nextBlock = contentBlocks[i + 1];
        if (!nextBlock || nextBlock.type !== 'image') {
          updatedBlocks.push(images[0]);
          addedCount++;
          addedPositions.push('LEGO builder hero after introduction');
        }
      }

      // Add data image before comparison
      if (block.type === 'heading' && block.text?.includes('Side-by-Side Comparison')) {
        updatedBlocks.push(images[2]);
        addedCount++;
        addedPositions.push('Data analysis before comparison');
      }

      // Add mobile image before mobile heading
      if (block.type === 'heading' && block.text?.includes('Clean, Modern Mobile')) {
        updatedBlocks.push(images[1]);
        addedCount++;
        addedPositions.push('Mobile pricing (yellow) before mobile section');
      }

      // Add accessible image before FAQ
      if (block.type === 'heading' && block.text?.includes('Frequently Asked Questions')) {
        updatedBlocks.push(images[3]);
        addedCount++;
        addedPositions.push('Mobile on couch before FAQ');
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
      message: `Added ${addedCount} Adobe Stock images to article`,
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
