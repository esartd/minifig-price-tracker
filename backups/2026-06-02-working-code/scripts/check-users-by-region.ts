import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsersByRegion() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        preferredCurrency: true,
        preferredCountryCode: true,
        preferredRegion: true,
        _count: {
          select: {
            CollectionItem: true,
            PersonalCollectionItem: true,
          }
        }
      }
    });

    console.log('\n📊 Users by Currency/Region');
    console.log('='.repeat(70));

    const northAmerica = users.filter(u =>
      ['USD', 'CAD', 'MXN'].includes(u.preferredCurrency || 'USD') ||
      ['US', 'CA', 'MX'].includes(u.preferredCountryCode || 'US')
    );

    const international = users.filter(u =>
      !['USD', 'CAD', 'MXN'].includes(u.preferredCurrency || 'USD') &&
      !['US', 'CA', 'MX'].includes(u.preferredCountryCode || 'US')
    );

    console.log(`\n🇺🇸 North America (US/CA/MX): ${northAmerica.length} users`);
    let naItems = 0;
    northAmerica.forEach(u => {
      const items = u._count.CollectionItem + u._count.PersonalCollectionItem;
      naItems += items;
      console.log(`  - ${u.email}: ${u.preferredCurrency || 'USD'} (${items} items)`);
    });
    console.log(`  Total items: ${naItems}`);

    console.log(`\n🌍 International: ${international.length} users`);
    let intlItems = 0;
    international.forEach(u => {
      const items = u._count.CollectionItem + u._count.PersonalCollectionItem;
      intlItems += items;
      console.log(`  - ${u.email}: ${u.preferredCurrency || 'USD'} / ${u.preferredCountryCode || 'US'} (${items} items)`);
    });
    console.log(`  Total items: ${intlItems}`);

    console.log('\n' + '='.repeat(70));
    console.log(`\n💡 Summary:`);
    console.log(`  Keep on Neon: ${northAmerica.length} users, ${naItems} items`);
    console.log(`  Move to Supabase: ${international.length} users, ${intlItems} items`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsersByRegion();
