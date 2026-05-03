import { PrismaClient } from '../node_modules/.prisma/client-hostinger';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://root@localhost:3306/figtracker_dev'
    }
  }
});

async function main() {
  console.log('🌱 Seeding local development database...\n');

  // Create test user
  console.log('👤 Creating test user...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@figtracker.com' },
    update: {},
    create: {
      email: 'test@figtracker.com',
      name: 'Test User',
      password: hashedPassword,
      emailVerified: new Date(),
      showOnMinifigLeaderboard: true,
      showOnSetLeaderboard: true,
      leaderboardDisplayName: 'TestCollector',
      preferredCurrency: 'USD',
      preferredCountryCode: 'US',
      preferredRegion: 'north_america',
      currencySymbol: '$',
      locale: 'en-US',
    },
  });
  console.log(`✅ Created user: ${testUser.email}`);

  // Create additional leaderboard users
  console.log('\n👥 Creating leaderboard users...');
  const leaderboardUsers = [];

  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `collector${i}@example.com` },
      update: {},
      create: {
        email: `collector${i}@example.com`,
        name: `Collector ${i}`,
        password: hashedPassword,
        emailVerified: new Date(),
        showOnMinifigLeaderboard: true,
        showOnSetLeaderboard: true,
        leaderboardDisplayName: `TopCollector${i}`,
        preferredCurrency: 'USD',
        preferredCountryCode: 'US',
        preferredRegion: 'north_america',
        currencySymbol: '$',
        locale: 'en-US',
      },
    });
    leaderboardUsers.push(user);
  }
  console.log(`✅ Created ${leaderboardUsers.length} leaderboard users`);

  // Sample minifigures data
  const sampleMinifigs = [
    { no: 'sw0001', name: 'Luke Skywalker (Tatooine)', image: 'https://img.bricklink.com/ItemImage/MN/0/sw0001.png' },
    { no: 'sw0105', name: 'Lando Calrissian (Cloud City)', image: 'https://img.bricklink.com/ItemImage/MN/0/sw0105.png' },
    { no: 'sw0218', name: 'Chrome Darth Vader', image: 'https://img.bricklink.com/ItemImage/MN/0/sw0218.png' },
    { no: 'hp001', name: 'Harry Potter', image: 'https://img.bricklink.com/ItemImage/MN/0/hp001.png' },
    { no: 'hp033', name: 'Hermione Granger', image: 'https://img.bricklink.com/ItemImage/MN/0/hp033.png' },
    { no: 'bat001', name: 'Batman', image: 'https://img.bricklink.com/ItemImage/MN/0/bat001.png' },
    { no: 'sh001', name: 'Spider-Man', image: 'https://img.bricklink.com/ItemImage/MN/0/sh001.png' },
    { no: 'col001', name: 'Caveman - Series 1', image: 'https://img.bricklink.com/ItemImage/MN/0/col001.png' },
  ];

  // Add inventory items for test user
  console.log('\n📦 Adding inventory items for test user...');
  for (const fig of sampleMinifigs.slice(0, 4)) {
    await prisma.collectionItem.upsert({
      where: {
        userId_minifigure_no_condition: {
          userId: testUser.id,
          minifigure_no: fig.no,
          condition: 'new',
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        minifigure_no: fig.no,
        minifigure_name: fig.name,
        quantity: Math.floor(Math.random() * 5) + 1,
        condition: 'new',
        image_url: fig.image,
      },
    });
  }
  console.log(`✅ Added ${sampleMinifigs.slice(0, 4).length} inventory items`);

  // Add personal collection items for test user
  console.log('\n🏠 Adding personal collection items for test user...');
  for (const fig of sampleMinifigs.slice(4)) {
    await prisma.personalCollectionItem.upsert({
      where: {
        userId_minifigure_no_condition: {
          userId: testUser.id,
          minifigure_no: fig.no,
          condition: 'new',
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        minifigure_no: fig.no,
        minifigure_name: fig.name,
        quantity: Math.floor(Math.random() * 3) + 1,
        condition: 'new',
        image_url: fig.image,
        notes: 'Part of my personal collection',
        display_location: 'Display Shelf A',
      },
    });
  }
  console.log(`✅ Added ${sampleMinifigs.slice(4).length} personal collection items`);

  // Add collections for leaderboard users (to populate leaderboards)
  console.log('\n🏆 Adding collections for leaderboard users...');
  let totalAdded = 0;
  for (const [index, user] of leaderboardUsers.entries()) {
    const itemCount = 10 - index * 2; // Descending quantity for ranking
    for (let i = 0; i < itemCount; i++) {
      const fig = sampleMinifigs[i % sampleMinifigs.length];
      await prisma.collectionItem.upsert({
        where: {
          userId_minifigure_no_condition: {
            userId: user.id,
            minifigure_no: `${fig.no}_${i}`,
            condition: 'new',
          },
        },
        update: {},
        create: {
          userId: user.id,
          minifigure_no: `${fig.no}_${i}`,
          minifigure_name: `${fig.name} #${i}`,
          quantity: 1,
          condition: 'new',
          image_url: fig.image,
        },
      });
      totalAdded++;
    }
  }
  console.log(`✅ Added ${totalAdded} items across leaderboard users`);

  // Sample sets data
  const sampleSets = [
    { no: '75192-1', name: 'Millennium Falcon', category: 'Star Wars' },
    { no: '10294-1', name: 'Titanic', category: 'Icons' },
    { no: '76405-1', name: 'Hogwarts Express', category: 'Harry Potter' },
  ];

  // Add set inventory items
  console.log('\n📦 Adding set inventory items...');
  for (const set of sampleSets.slice(0, 2)) {
    await prisma.setInventoryItem.upsert({
      where: {
        userId_box_no_condition: {
          userId: testUser.id,
          box_no: set.no,
          condition: 'new',
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        box_no: set.no,
        set_name: set.name,
        category_name: set.category,
        quantity: 1,
        condition: 'new',
        image_url: `https://img.bricklink.com/ItemImage/SN/0/${set.no.split('-')[0]}.png`,
      },
    });
  }
  console.log(`✅ Added ${sampleSets.slice(0, 2).length} set inventory items`);

  // Add set personal collection items
  console.log('\n🏠 Adding set personal collection items...');
  for (const set of sampleSets.slice(2)) {
    await prisma.setPersonalCollectionItem.upsert({
      where: {
        userId_box_no_condition: {
          userId: testUser.id,
          box_no: set.no,
          condition: 'new',
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        box_no: set.no,
        set_name: set.name,
        category_name: set.category,
        quantity: 1,
        condition: 'new',
        image_url: `https://img.bricklink.com/ItemImage/SN/0/${set.no.split('-')[0]}.png`,
        notes: 'Built and displayed',
        display_location: 'Living Room',
      },
    });
  }
  console.log(`✅ Added ${sampleSets.slice(2).length} set personal collection items`);

  // Skip donations for now - not essential for testing
  console.log('\n⏭️  Skipping donation records (not essential for basic testing)');

  console.log('\n✅ Seeding completed successfully!\n');
  console.log('📝 Test Account Credentials:');
  console.log('   Email: test@figtracker.com');
  console.log('   Password: password123\n');
  console.log('🌐 Visit: http://localhost:3000');
  console.log('🔐 Login at: http://localhost:3000/auth/signin\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
