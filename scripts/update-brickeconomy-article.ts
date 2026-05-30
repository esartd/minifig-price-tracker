import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

async function main() {
  console.log('📝 Updating BrickEconomy article with corrected pricing claims...\n');

  const slug = 'figtracker-vs-brickeconomy';

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    console.error('❌ Article not found');
    process.exit(1);
  }

  const contentBlocks = JSON.parse(article.contentBlocks as string);

  // Update all the pricing-related blocks
  const updatedBlocks = contentBlocks.map((block: any) => {
    // 1. Change "Completely Free" heading to "Free to Use"
    if (block.type === 'heading' && block.text === 'Completely Free') {
      console.log('✓ Updated heading: "Completely Free" → "Free to Use"');
      return { ...block, text: 'Free to Use' };
    }

    // 2. Update the 100% free paragraph
    if (block.type === 'paragraph' && block.text.includes('100% free')) {
      console.log('✓ Updated "100% free" paragraph');
      return {
        ...block,
        text: 'FigTracker is currently free to use with no subscription required. While BrickEconomy requires a paid subscription to access full features, FigTracker provides honest, transparent LEGO pricing data without paywalls.'
      };
    }

    // 3. Update comparison block
    if (block.type === 'comparison') {
      console.log('✓ Updated comparison table pros/cons');
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
      console.log('✓ Updated "When to Use" list');
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
      console.log('✓ Updated FAQ heading');
      return { ...block, text: 'Is FigTracker free to use?' };
    }

    // 6. Update FAQ answer
    if (block.type === 'paragraph' && block.text.includes('FigTracker is 100% free with no subscription required')) {
      console.log('✓ Updated FAQ answer');
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

  console.log('\n✅ Article updated successfully in database!');
  console.log('   All language versions will now show the updated content.');
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
