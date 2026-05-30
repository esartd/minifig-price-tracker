import { prisma } from '../lib/prisma';

async function countUsers() {
  try {
    const totalUsers = await prisma.user.count({
      where: { email: { not: 'erickkosysu@gmail.com' } }
    });

    const allUsers = await prisma.user.count();

    console.log(`Total registered users (excluding admin): ${totalUsers}`);
    console.log(`Total users (including admin): ${allUsers}`);

    // Get some additional stats
    const recentUsers = await prisma.user.findMany({
      where: { email: { not: 'erickkosysu@gmail.com' } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        email: true,
        name: true,
        createdAt: true,
      }
    });

    console.log('\nMost recent signups:');
    recentUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.name || 'Anonymous'} (${user.email}) - ${user.createdAt.toLocaleDateString()}`);
    });

  } catch (error) {
    console.error('Error counting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countUsers();
