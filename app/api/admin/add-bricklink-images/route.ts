import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const slug = 'figtracker-vs-bricklink';

    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const contentBlocks = JSON.parse(article.contentBlocks as string);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';

    // Adobe Stock images for BrickLink article
    const images = [
      {
        id: `block-hero-bricklink-${Date.now()}`,
        type: 'image',
        images: [{
          imageId: 'bricklink-hero',
          imageUrl: `${baseUrl}/uploads/articles/lego-sorting-hero.jpg`,
          alt: 'Organized LEGO bricks in sorting containers',
          caption: 'Managing your LEGO collection with the right tools',
        }],
        columns: 1,
      },
      {
        id: `block-mobile-happy-${Date.now() + 1}`,
        type: 'image',
        images: [{
          imageId: 'mobile-happy',
          imageUrl: `${baseUrl}/uploads/articles/happy-mobile-user.jpg`,
          alt: 'Happy user using mobile pricing app',
          caption: 'FigTracker\'s mobile-first approach for quick pricing',
        }],
        columns: 1,
      },
      {
        id: `block-desktop-${Date.now() + 2}`,
        type: 'image',
        images: [{
          imageId: 'desktop-bricklink',
          imageUrl: `${baseUrl}/uploads/articles/bricklink-desktop-user.jpg`,
          alt: 'User browsing BrickLink marketplace on laptop',
          caption: 'BrickLink\'s comprehensive marketplace and catalog',
        }],
        columns: 1,
      },
      {
        id: `block-decision-${Date.now() + 3}`,
        type: 'image',
        images: [{
          imageId: 'decision-making',
          imageUrl: `${baseUrl}/uploads/articles/decision-making-woman.jpg`,
          alt: 'Choosing between pricing tools',
          caption: 'Deciding which tool fits your collection needs',
        }],
        columns: 1,
      },
      {
        id: `block-mobile-kitchen-${Date.now() + 4}`,
        type: 'image',
        images: [{
          imageId: 'mobile-kitchen',
          imageUrl: `${baseUrl}/uploads/articles/mobile-kitchen-woman.jpg`,
          alt: 'Casual mobile app usage',
          caption: 'Price your collection anytime, anywhere',
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

      // Add LEGO sorting hero after introduction (after block 2)
      if (i === 2) {
        const nextBlock = contentBlocks[i + 1];
        if (!nextBlock || nextBlock.type !== 'image') {
          updatedBlocks.push(images[0]);
          addedCount++;
          addedPositions.push('LEGO sorting hero after introduction');
        }
      }

      // Add mobile happy before "FigTracker's Advantages"
      if (block.type === 'heading' && block.text?.includes('FigTracker') && block.text?.includes('Advantages')) {
        updatedBlocks.push(images[1]);
        addedCount++;
        addedPositions.push('Happy mobile user before FigTracker advantages');
      }

      // Add desktop before "BrickLink's Strengths"
      if (block.type === 'heading' && block.text?.includes('BrickLink') && block.text?.includes('Strengths')) {
        updatedBlocks.push(images[2]);
        addedCount++;
        addedPositions.push('Desktop BrickLink user before strengths section');
      }

      // Add decision before "Which Should You Use?"
      if (block.type === 'heading' && (block.text?.includes('Which Should You Use') || block.text?.includes('Bottom Line'))) {
        updatedBlocks.push(images[3]);
        addedCount++;
        addedPositions.push('Decision making before conclusion');
      }

      // Add mobile kitchen before FAQ if exists
      if (block.type === 'heading' && block.text?.includes('Frequently Asked')) {
        updatedBlocks.push(images[4]);
        addedCount++;
        addedPositions.push('Casual mobile usage before FAQ');
      }

      updatedBlocks.push(block);
    }

    if (addedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new images added (may already exist or headings not found)',
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
      message: `Added ${addedCount} images to BrickLink article`,
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
