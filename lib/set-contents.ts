/**
 * Set Contents System
 *
 * Fetches which minifigs appear in which sets from BrickLink API
 * Stores data permanently (sets don't change after release)
 *
 * Two modes:
 * 1. On-demand: User views set → fetch contents → save forever
 * 2. Background cron: Seed 200 popular sets/day at 3am
 */

import { PrismaClient } from '@prisma/client-hostinger';

// Use Hostinger prisma client for set contents
const prisma = new PrismaClient();

interface BrickLinkSubset {
  item: {
    no: string;
    type: string; // "MINIFIG", "PART", etc.
  };
  entries: Array<{
    quantity: number;
  }>;
}

interface BrickLinkSubsetsResponse {
  data: BrickLinkSubset[];
}

/**
 * Fetch set contents from BrickLink API
 * Only calls API if not already cached in database
 */
export async function fetchSetContents(
  setNo: string,
  source: 'user_view' | 'cron_seed' = 'user_view'
): Promise<{
  minifigs: Array<{ minifig_no: string; quantity: number }>;
  cached: boolean;
}> {
  // Check if already fetched
  const existing = await prisma.setContentsFetched.findUnique({
    where: { set_no: setNo }
  });

  if (existing) {
    // Return cached data
    const contents = await prisma.setContents.findMany({
      where: { set_no: setNo },
      select: { minifig_no: true, quantity: true }
    });

    return {
      minifigs: contents,
      cached: true
    };
  }

  // Fetch from BrickLink API using existing client
  try {
    const { bricklinkAPI } = await import('@/lib/bricklink');

    const response = await bricklinkAPI.getSubsets(setNo);

    console.log(`[SET CONTENTS] Raw API response for ${setNo}:`, JSON.stringify(response).substring(0, 500));

    // BrickLink API returns { data: [...] } structure
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error(`[SET CONTENTS] Unexpected response format for ${setNo}:`, response);
      return { minifigs: [], cached: false };
    }

    // Filter to only minifigs
    const minifigs = response.data
      .filter((subset: any) => subset.item?.type === 'MINIFIG')
      .map((subset: any) => ({
        minifig_no: subset.item.no,
        quantity: subset.entries.reduce((sum: number, e: any) => sum + e.quantity, 0)
      }));

    // Save to database
    if (minifigs.length > 0) {
      await prisma.$transaction([
        // Save individual minifigs
        ...minifigs.map(m =>
          prisma.setContents.create({
            data: {
              set_no: setNo,
              minifig_no: m.minifig_no,
              quantity: m.quantity
            }
          })
        ),
        // Mark set as fetched
        prisma.setContentsFetched.create({
          data: {
            set_no: setNo,
            minifig_count: minifigs.length,
            fetched_via: source
          }
        })
      ]);
    } else {
      // Set has no minifigs, still mark as fetched to prevent re-fetching
      await prisma.setContentsFetched.create({
        data: {
          set_no: setNo,
          minifig_count: 0,
          fetched_via: source
        }
      });
    }

    console.log(`[SET CONTENTS] Fetched ${minifigs.length} minifigs for set ${setNo} (${source})`);

    return { minifigs, cached: false };
  } catch (error) {
    console.error(`[SET CONTENTS] Error fetching ${setNo}:`, error);
    return { minifigs: [], cached: false };
  }
}

/**
 * Get which sets contain a specific minifig
 * Returns cached data only (doesn't trigger API calls)
 */
export async function getSetsContainingMinifig(minifigNo: string): Promise<
  Array<{ set_no: string; quantity: number }>
> {
  const sets = await prisma.setContents.findMany({
    where: { minifig_no: minifigNo },
    select: { set_no: true, quantity: true },
    orderBy: { fetched_at: 'desc' }
  });

  return sets;
}

/**
 * Get minifigs in a set
 * Returns cached data only (doesn't trigger API calls)
 */
export async function getMinifigsInSet(setNo: string): Promise<
  Array<{ minifig_no: string; quantity: number }>
> {
  const minifigs = await prisma.setContents.findMany({
    where: { set_no: setNo },
    select: { minifig_no: true, quantity: true }
  });

  return minifigs;
}

/**
 * Check if set contents have been fetched
 */
export async function hasSetContents(setNo: string): Promise<boolean> {
  const exists = await prisma.setContentsFetched.findUnique({
    where: { set_no: setNo }
  });

  return !!exists;
}

/**
 * Get statistics about set contents coverage
 */
export async function getSetContentsStats() {
  const [totalSetsFetched, totalMinifigMappings, bySource] = await Promise.all([
    prisma.setContentsFetched.count(),
    prisma.setContents.count(),
    prisma.setContentsFetched.groupBy({
      by: ['fetched_via'],
      _count: { set_no: true }
    })
  ]);

  return {
    totalSetsFetched,
    totalMinifigMappings,
    bySource: bySource.reduce((acc, item) => {
      acc[item.fetched_via] = item._count.set_no;
      return acc;
    }, {} as Record<string, number>)
  };
}
