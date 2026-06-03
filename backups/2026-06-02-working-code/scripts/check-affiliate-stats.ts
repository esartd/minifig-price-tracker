import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getClickStats() {
  try {
    const totalClicks = await prisma.affiliateClick.count();
    const myClicks = await prisma.affiliateClick.count({
      where: { userId: 'erickkosysu@gmail.com' }
    });
    const realClicks = totalClicks - myClicks;

    const clicksByPlatform = await prisma.affiliateClick.groupBy({
      by: ['platform'],
      _count: true,
      where: { userId: { not: 'erickkosysu@gmail.com' } }
    });

    const clicksByProduct = await prisma.affiliateClick.groupBy({
      by: ['productType'],
      _count: true,
      where: { userId: { not: 'erickkosysu@gmail.com' } }
    });

    const allRealClicks = await prisma.affiliateClick.findMany({
      orderBy: { clickedAt: 'desc' },
      where: { userId: { not: 'erickkosysu@gmail.com' } },
      select: {
        platform: true,
        productType: true,
        productId: true,
        productName: true,
        clickedAt: true,
        userId: true
      }
    });

    console.log('=== AFFILIATE CLICK STATS (EXCLUDING YOUR CLICKS) ===');
    console.log('Total Clicks:', totalClicks);
    console.log('Your Test Clicks:', myClicks);
    console.log('Real User Clicks:', realClicks);
    console.log('\nBy Platform:');
    let platformTotal = 0;
    clicksByPlatform.forEach(p => {
      console.log(`  ${p.platform}: ${p._count} clicks`);
      platformTotal += p._count;
    });
    console.log(`  Platform Total: ${platformTotal}`);

    console.log('\nBy Product Type:');
    let productTotal = 0;
    clicksByProduct.forEach(p => {
      console.log(`  ${p.productType}: ${p._count} clicks`);
      productTotal += p._count;
    });
    console.log(`  Product Total: ${productTotal}`);

    console.log(`\nAll Real User Clicks (${allRealClicks.length} total):`);
    allRealClicks.forEach(c => {
      console.log(`  ${c.clickedAt.toISOString().split('T')[0]} - ${c.platform} - ${c.productType} - ${c.productId}${c.userId ? ' (logged in)' : ' (guest)'}`);
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getClickStats();
