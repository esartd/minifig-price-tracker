/**
 * Check BrickLink API Usage
 *
 * Shows how many API calls have been made today.
 * Helps ensure you stay under the 5,000 calls/day limit.
 *
 * Run: npx tsx scripts/check-api-usage.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkAPIUsage() {
  const { prisma } = await import('../lib/prisma.js');

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  console.log('📊 BrickLink API Usage Report');
  console.log('─────────────────────────────\n');

  // Get today's usage
  const todayTracker = await prisma.apiCallTracker.findUnique({
    where: { date: today }
  });

  if (todayTracker) {
    const percentage = ((todayTracker.call_count / 5000) * 100).toFixed(1);
    const remaining = 5000 - todayTracker.call_count;

    console.log(`📅 Date: ${today}`);
    console.log(`📞 Calls Made: ${todayTracker.call_count} / 5,000`);
    console.log(`📈 Usage: ${percentage}%`);
    console.log(`✅ Remaining: ${remaining} calls`);
    console.log(`🕐 Last Call: ${todayTracker.last_call_at.toLocaleString()}\n`);

    if (todayTracker.call_count >= 4500) {
      console.log('⚠️  WARNING: Approaching daily limit!\n');
    } else if (todayTracker.call_count >= 5000) {
      console.log('🚫 LIMIT REACHED: No more calls allowed today.\n');
    } else {
      console.log('✅ You are within safe limits.\n');
    }
  } else {
    console.log(`📅 Date: ${today}`);
    console.log(`📞 Calls Made: 0 / 5,000`);
    console.log(`✅ No API calls made today.\n`);
  }

  // Get recent history (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const history = await prisma.apiCallTracker.findMany({
    where: {
      date: {
        gte: sevenDaysAgoStr
      }
    },
    orderBy: {
      date: 'desc'
    }
  });

  if (history.length > 1) {
    console.log('📊 Last 7 Days History:');
    console.log('─────────────────────────────');
    history.forEach(record => {
      const bar = '█'.repeat(Math.floor(record.call_count / 100));
      console.log(`${record.date}  ${record.call_count.toString().padStart(4)} calls  ${bar}`);
    });
    console.log('');
  }

  console.log('💡 Tips:');
  console.log('  • Daily limit resets at midnight');
  console.log('  • All API calls are automatically rate-limited');
  console.log('  • The system will prevent you from exceeding 5,000 calls\n');

  await prisma.$disconnect();
}

checkAPIUsage().catch(console.error);
