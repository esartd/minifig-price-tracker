import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStats() {
  try {
    const userCount = await prisma.user.count();
    const collectionItems = await prisma.collectionItem.count();
    const personalItems = await prisma.personalCollectionItem.count();
    const listings = await prisma.listing.count();
    const sessions = await prisma.session.count();

    console.log('\n📊 Database Statistics');
    console.log('='.repeat(50));
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`📦 Collection Items (for selling): ${collectionItems}`);
    console.log(`🏠 Personal Collection Items: ${personalItems}`);
    console.log(`🏷️  Active Listings: ${listings}`);
    console.log(`🔐 Active Sessions: ${sessions}`);
    console.log('='.repeat(50));
    console.log(`\n💡 Total items users would lose: ${collectionItems + personalItems + listings}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStats();
