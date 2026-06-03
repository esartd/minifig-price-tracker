const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  const totalUsers = await prisma.user.count();
  console.log(`Total users: ${totalUsers}`);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log('\nRecent users:');
  users.slice(0, 10).forEach((user, i) => {
    console.log(`${i + 1}. ${user.email} - ${user.name || 'No name'} - ${user.createdAt.toISOString().split('T')[0]}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
