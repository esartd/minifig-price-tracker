import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';


/**
 * Claude-accessible article editor
 *
 * Allows programmatic article updates by finding and replacing content blocks
 * No authentication required - Claude can call this directly
 */
export async function POST(request: NextRequest) {
  try {
    const { slug, updates } = await request.json();

    if (!slug || !updates || !Array.isArray(updates)) {
      return NextResponse.json({
        error: 'Invalid request. Need: { slug: string, updates: Array<{find, replace}> }'
      }, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      return NextResponse.json({ error: `Article '${slug}' not found` }, { status: 404 });
    }

    const contentBlocks = JSON.parse(article.contentBlocks as string);
    let updatedCount = 0;

    // Apply each update
    const updatedBlocks = contentBlocks.map((block: any) => {
      let updated = false;

      updates.forEach((update: any) => {
        const { find, replace } = update;

        // Match by heading text
        if (find.heading && block.type === 'heading' && block.text === find.heading) {
          if (replace.text) {
            block.text = replace.text;
            updated = true;
          }
        }

        // Match by paragraph text (partial match)
        if (find.paragraphContains && block.type === 'paragraph' && block.text.includes(find.paragraphContains)) {
          if (replace.text) {
            block.text = replace.text;
            updated = true;
          }
        }

        // Match comparison item
        if (find.comparisonTitle && block.type === 'comparison') {
          block.items = block.items.map((item: any) => {
            if (item.title === find.comparisonTitle) {
              if (replace.pros) {
                item.pros = item.pros.map((pro: string, idx: number) =>
                  replace.pros[idx] !== undefined ? replace.pros[idx] : pro
                );
                updated = true;
              }
              if (replace.cons) {
                item.cons = item.cons.map((con: string, idx: number) =>
                  replace.cons[idx] !== undefined ? replace.cons[idx] : con
                );
                updated = true;
              }
            }
            return item;
          });
        }

        // Match list items
        if (find.listItemContains && block.type === 'list') {
          block.items = block.items.map((item: string) => {
            if (item.includes(find.listItemContains)) {
              updated = true;
              return replace.text || item;
            }
            return item;
          });
        }
      });

      if (updated) updatedCount++;
      return block;
    });

    await prisma.article.update({
      where: { slug },
      data: {
        contentBlocks: JSON.stringify(updatedBlocks)
      }
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} blocks in article '${slug}'`,
      updatedCount
    });
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({
      error: 'Failed to update article',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
