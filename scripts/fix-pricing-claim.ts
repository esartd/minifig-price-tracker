import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

async function main() {
  console.log('📝 Updating pricing claim in BrickEconomy article...\n');

  const slug = 'figtracker-vs-brickeconomy';

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    console.error('❌ Article not found');
    process.exit(1);
  }

  const contentBlocks = JSON.parse(article.contentBlocks as string);

  // Find and update the "Completely Free" section
  const updatedBlocks = contentBlocks.map((block: any) => {
    // Find the heading
    if (block.type === 'heading' && block.text === 'Completely Free') {
      return {
        ...block,
        text: 'Free to Use'
      };
    }

    // Find the paragraph that talks about 100% free
    if (block.type === 'paragraph' && block.text.includes('100% free')) {
      return {
        ...block,
        text: 'FigTracker is currently free to use with no subscription required. While BrickEconomy requires a paid subscription to access full features, FigTracker provides honest, transparent LEGO pricing data without paywalls or hidden pricing tiers.'
      };
    }

    return block;
  });

  // Also update the comparison block
  const finalBlocks = updatedBlocks.map((block: any) => {
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
    return block;
  });

  await prisma.article.update({
    where: { slug },
    data: {
      contentBlocks: JSON.stringify(finalBlocks)
    }
  });

  console.log('✅ Article updated successfully');
  console.log('   - Changed "Completely Free" heading to "Free to Use"');
  console.log('   - Removed absolute claims about always being free');
  console.log('   - Updated comparison table pros/cons');
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
