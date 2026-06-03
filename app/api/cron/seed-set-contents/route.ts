import { NextResponse } from 'next/server';
import { fetchSetContents, getSetContentsStats } from '@/lib/set-contents';
import { loadAllBoxes } from '@/lib/boxes-data';

/**
 * Cron job to pre-seed popular sets with their minifig contents
 *
 * Strategy:
 * - Runs daily at 3am
 * - Fetches 200 sets per day
 * - Prioritizes by theme: Star Wars > Marvel > Harry Potter > Architecture > Other
 * - Stops after ~1,000 most popular sets seeded
 * - Respects BrickLink API 3-second delay (built into fetchSetContents)
 * - Budget: 200 calls/day = 28% of 5,000 daily limit
 *
 * Usage:
 * curl https://figtracker.ericksu.com/api/cron/seed-set-contents \
 *   -H "Authorization: Bearer $CRON_SECRET"
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes (200 sets × 3 seconds = 10 minutes, but allow timeout)

// Theme priorities (higher = more important)
const THEME_PRIORITIES: Record<string, number> = {
  'Star Wars': 100,
  'Marvel Super Heroes': 90,
  'DC Super Heroes': 85,
  'Harry Potter': 80,
  'Lord of the Rings': 75,
  'Disney': 70,
  'Ninjago': 65,
  'Architecture': 60,
  'Creator Expert': 55,
  'City': 50,
  'Friends': 45,
};

const SETS_PER_RUN = 200; // Budget: 200 API calls per day
const MAX_TOTAL_SETS = 1000; // Stop after seeding 1,000 sets

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[CRON] Starting set contents seeding...');

    // Check current stats
    const stats = await getSetContentsStats();
    const totalFetched = stats.totalSetsFetched || 0;
    const cronSeeded = stats.bySource?.cron_seed || 0;

    console.log(`[CRON] Current stats: ${totalFetched} total sets, ${cronSeeded} via cron`);

    // Stop if we've reached the target
    if (cronSeeded >= MAX_TOTAL_SETS) {
      console.log(`[CRON] Target reached: ${cronSeeded}/${MAX_TOTAL_SETS} sets seeded`);
      return NextResponse.json({
        success: true,
        message: 'Target reached',
        stats: {
          totalSeeded: cronSeeded,
          target: MAX_TOTAL_SETS,
          setsThisRun: 0
        }
      });
    }

    // Load all sets and prioritize
    const allBoxes = loadAllBoxes();

    // Get already-fetched set numbers
    const { PrismaClient } = await import('@prisma/client-hostinger');
    const prisma = new PrismaClient();

    const alreadyFetched = await prisma.setContentsFetched.findMany({
      select: { set_no: true }
    });
    const fetchedSetNos = new Set(alreadyFetched.map(f => f.set_no));

    await prisma.$disconnect();

    // Filter unfetched sets
    const unfetchedSets = allBoxes.filter(box => !fetchedSetNos.has(box.box_no));

    console.log(`[CRON] ${unfetchedSets.length} sets remaining to seed`);

    if (unfetchedSets.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All sets already seeded',
        stats: {
          totalSeeded: cronSeeded,
          target: MAX_TOTAL_SETS,
          setsThisRun: 0
        }
      });
    }

    // Prioritize by theme
    const prioritizedSets = unfetchedSets
      .map(box => {
        const parentTheme = box.category_name.split(' / ')[0].trim();
        const priority = THEME_PRIORITIES[parentTheme] || 0;
        return { box, priority };
      })
      .sort((a, b) => {
        // Sort by priority (high to low), then by year (new to old)
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        const yearA = parseInt(a.box.year_released) || 0;
        const yearB = parseInt(b.box.year_released) || 0;
        return yearB - yearA;
      })
      .map(item => item.box);

    // Take top N sets
    const setsToFetch = prioritizedSets.slice(0, Math.min(SETS_PER_RUN, MAX_TOTAL_SETS - cronSeeded));

    console.log(`[CRON] Fetching ${setsToFetch.length} sets this run`);

    // Fetch each set (respects 3-second delay automatically)
    const results = {
      success: 0,
      failed: 0,
      empty: 0,
      errors: [] as Array<{ set_no: string; error: string }>
    };

    for (const set of setsToFetch) {
      try {
        console.log(`[CRON] Fetching ${set.box_no} (${set.name})...`);
        const result = await fetchSetContents(set.box_no, 'cron_seed');

        if (result.minifigs.length === 0) {
          results.empty++;
          console.log(`[CRON] ✓ ${set.box_no}: 0 minifigs (set has no minifigs)`);
        } else {
          results.success++;
          console.log(`[CRON] ✓ ${set.box_no}: ${result.minifigs.length} minifigs`);
        }
      } catch (error: any) {
        results.failed++;
        const errorMsg = error?.message || 'Unknown error';
        results.errors.push({ set_no: set.box_no, error: errorMsg });
        console.error(`[CRON] ✗ ${set.box_no}: ${errorMsg}`);
      }
    }

    // Get updated stats
    const finalStats = await getSetContentsStats();

    console.log(`[CRON] Seeding complete: ${results.success} success, ${results.empty} empty, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Seeding complete',
      stats: {
        totalSeeded: finalStats.bySource?.cron_seed || 0,
        target: MAX_TOTAL_SETS,
        setsThisRun: results.success + results.empty,
        successCount: results.success,
        emptyCount: results.empty,
        failedCount: results.failed
      },
      errors: results.errors.length > 0 ? results.errors : undefined
    });

  } catch (error: any) {
    console.error('[CRON] Fatal error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Internal server error'
    }, { status: 500 });
  }
}
