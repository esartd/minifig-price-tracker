const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding test donations...');

  await prisma.donation.createMany({
    data: [
      {
        id: 'test1',
        paypalTxnId: 'TXN001',
        amount: 150.00,
        currency: 'USD',
        donorEmail: 'test1@example.com',
        donorName: 'John Doe',
        displayName: 'LEGO Master',
        showOnLeaderboard: true,
        season: '2026-Q2',
        status: 'completed',
      },
      {
        id: 'test2',
        paypalTxnId: 'TXN002',
        amount: 100.00,
        currency: 'USD',
        donorEmail: 'test2@example.com',
        donorName: 'Jane Smith',
        displayName: 'Brick Builder',
        showOnLeaderboard: true,
        season: '2026-Q2',
        status: 'completed',
      },
      {
        id: 'test3',
        paypalTxnId: 'TXN003',
        amount: 75.50,
        currency: 'USD',
        donorEmail: 'test3@example.com',
        donorName: 'Bob Wilson',
        displayName: 'Minifig Collector',
        showOnLeaderboard: true,
        season: '2026-Q2',
        status: 'completed',
      },
      {
        id: 'test4',
        paypalTxnId: 'TXN004',
        amount: 50.00,
        currency: 'USD',
        donorEmail: 'test4@example.com',
        donorName: 'Alice Brown',
        displayName: 'Star Wars Fan',
        showOnLeaderboard: true,
        season: '2026-Q2',
        status: 'completed',
      },
      {
        id: 'test5',
        paypalTxnId: 'TXN005',
        amount: 25.00,
        currency: 'USD',
        donorEmail: 'test5@example.com',
        donorName: 'Mike Johnson',
        displayName: 'Castle Enthusiast',
        showOnLeaderboard: true,
        season: '2026-Q2',
        status: 'completed',
      },
    ],
  });

  console.log('✅ Test donations added!');

  const donations = await prisma.donation.findMany({
    where: { season: '2026-Q2', showOnLeaderboard: true }
  });

  console.log(`Found ${donations.length} donations for Q2 2026`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
