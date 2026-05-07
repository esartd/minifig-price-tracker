import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // Allow either admin session OR cron secret
  const cronSecret = request.headers.get('x-cron-secret');
  const session = await auth();

  const isAuthorized =
    cronSecret === process.env.CRON_SECRET ||
    (session?.user?.email === 'erickkosysu@gmail.com');

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Update all the pricing-related blocks
    const updatedBlocks = contentBlocks.map((block: any) => {
      // 1. Change "Completely Free" heading to "Free to Use"
      if (block.type === 'heading' && block.text === 'Completely Free') {
        return { ...block, text: 'Free to Use' };
      }

      // 2. Update the 100% free paragraph
      if (block.type === 'paragraph' && block.text.includes('100% free')) {
        return {
          ...block,
          text: 'FigTracker is currently free to use with no subscription required. While BrickEconomy requires a paid subscription to access full features, FigTracker provides honest, transparent LEGO pricing data without paywalls.'
        };
      }

      // 3. Update comparison block
      if (block.type === 'comparison') {
        return {
          ...block,
          items: block.items.map((item: any) => {
            if (item.title === 'FigTracker') {
              return {
                ...item,
                pros: item.pros.map((pro: string) => {
                  if (pro.includes('Free - no subscription required')) {
                    return 'Currently free to use';
                  }
                  return pro;
                })
              };
            }
            if (item.title === 'BrickEconomy') {
              return {
                ...item,
                cons: item.cons.map((con: string) => {
                  if (con === 'Subscription required for full features') {
                    return 'Paid subscription required for full features';
                  }
                  return con;
                })
              };
            }
            return item;
          })
        };
      }

      // 4. Update "When to Use FigTracker" list
      if (block.type === 'list' && block.items && block.items.some((item: string) => item.includes('free tool'))) {
        return {
          ...block,
          items: block.items.map((item: string) => {
            if (item.includes('free tool')) {
              return 'You want a tool **without subscription paywalls**';
            }
            return item;
          })
        };
      }

      // 5. Update FAQ heading
      if (block.type === 'heading' && block.text === 'Is FigTracker really free?') {
        return { ...block, text: 'Is FigTracker free to use?' };
      }

      // 6. Update FAQ answer
      if (block.type === 'paragraph' && block.text.includes('FigTracker is 100% free with no subscription required')) {
        return {
          ...block,
          text: 'Yes! FigTracker is currently free to use with no subscription required. We believe accurate LEGO pricing should be accessible to everyone.'
        };
      }

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
      message: 'Article updated successfully. All language versions will show the updated content.'
    });
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}
