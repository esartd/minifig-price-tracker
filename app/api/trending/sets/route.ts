import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { detectAvailabilityByYear } from '@/lib/set-availability';

// Minimum sets a user needs before we personalize
const MIN_SETS_FOR_PERSONALIZATION = 3;
// Sets per year cutoff — only recommend in-production sets
const MIN_YEAR = 2024;
// How many candidates to pull before distributing to 8
const CANDIDATE_POOL = 30;

export interface RecommendedSet {
  box_no: string;
  name: string;
  category_name: string;
  year_released: string | null;
  imageUrl: string;
  availability: 'available' | 'retiring_soon';
  userCount?: number;
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      // Personalized path: check if user has enough sets
      const [inventoryCount, collectionCount] = await Promise.all([
        prisma.setInventoryItem.count({ where: { userId } }),
        prisma.setPersonalCollectionItem.count({ where: { userId } }),
      ]);

      const totalSets = inventoryCount + collectionCount;

      if (totalSets >= MIN_SETS_FOR_PERSONALIZATION) {
        const personalized = await getPersonalizedSets(userId);
        if (personalized.length >= 4) {
          return NextResponse.json(
            { success: true, data: personalized, personalized: true },
            {
              headers: { 'Cache-Control': 'private, max-age=3600' },
            }
          );
        }
      }
    }

    // Popular fallback (anonymous or insufficient data)
    const popular = await getPopularSets();
    return NextResponse.json(
      { success: true, data: popular, personalized: false },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800',
        },
      }
    );
  } catch (error) {
    console.error('[TRENDING SETS API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommended sets' },
      { status: 500 }
    );
  }
}

async function getPersonalizedSets(userId: string): Promise<RecommendedSet[]> {
  // Get theme affinity from both collection tables
  const [inventoryThemes, collectionThemes] = await Promise.all([
    prisma.setInventoryItem.groupBy({
      by: ['category_name'],
      where: { userId, category_name: { not: null } },
      _count: { category_name: true },
      orderBy: { _count: { category_name: 'desc' } },
      take: 5,
    }),
    prisma.setPersonalCollectionItem.groupBy({
      by: ['category_name'],
      where: { userId, category_name: { not: null } },
      _count: { category_name: true },
      orderBy: { _count: { category_name: 'desc' } },
      take: 5,
    }),
  ]);

  // Merge and rank themes by combined count
  const themeMap = new Map<string, number>();
  for (const t of inventoryThemes) {
    if (t.category_name) {
      themeMap.set(t.category_name, (themeMap.get(t.category_name) || 0) + Number(t._count.category_name));
    }
  }
  for (const t of collectionThemes) {
    if (t.category_name) {
      themeMap.set(t.category_name, (themeMap.get(t.category_name) || 0) + Number(t._count.category_name));
    }
  }

  const topThemes = Array.from(themeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme);

  if (topThemes.length === 0) return [];

  // Get sets the user already owns (to exclude)
  const [ownedInventory, ownedCollection] = await Promise.all([
    prisma.setInventoryItem.findMany({ where: { userId }, select: { box_no: true } }),
    prisma.setPersonalCollectionItem.findMany({ where: { userId }, select: { box_no: true } }),
  ]);
  const ownedBoxNos = new Set([
    ...ownedInventory.map((s) => s.box_no),
    ...ownedCollection.map((s) => s.box_no),
  ]);

  // Find in-production sets matching user themes
  const candidates = await prisma.setsCatalog.findMany({
    where: {
      category_name: { in: topThemes },
      year_released: { gte: String(MIN_YEAR) },
      box_no: { notIn: Array.from(ownedBoxNos) },
    },
    select: {
      box_no: true,
      name: true,
      category_name: true,
      year_released: true,
    },
    orderBy: { year_released: 'desc' },
    take: CANDIDATE_POOL,
  });

  // Filter to available/retiring_soon only
  const eligible = candidates.filter((s) => {
    const status = detectAvailabilityByYear(s.year_released, s.category_name);
    return status === 'available' || status === 'retiring_soon';
  });

  // Distribute 8 slots proportionally across top themes
  const selected = distributeSets(eligible, topThemes, 8);

  return selected.map((s) => ({
    box_no: s.box_no,
    name: s.name,
    category_name: s.category_name,
    year_released: s.year_released,
    imageUrl: `https://img.bricklink.com/ItemImage/SN/0/${s.box_no}.png`,
    availability: (detectAvailabilityByYear(s.year_released) as 'available' | 'retiring_soon'),
  }));
}

function distributeSets(
  sets: { box_no: string; name: string; category_name: string; year_released: string | null }[],
  rankedThemes: string[],
  limit: number
): typeof sets {
  const result: typeof sets = [];
  const used = new Set<string>();
  const byTheme = new Map<string, typeof sets>();

  for (const theme of rankedThemes) {
    byTheme.set(theme, sets.filter((s) => s.category_name === theme));
  }

  // Round-robin through themes proportionally
  let round = 0;
  while (result.length < limit) {
    let added = false;
    for (const theme of rankedThemes) {
      if (result.length >= limit) break;
      const pool = byTheme.get(theme) || [];
      if (round < pool.length && !used.has(pool[round].box_no)) {
        used.add(pool[round].box_no);
        result.push(pool[round]);
        added = true;
      }
    }
    round++;
    if (!added) break;
  }

  return result;
}

async function getPopularSets(): Promise<RecommendedSet[]> {
  // Most-collected sets globally across all users
  const trending = await prisma.setPersonalCollectionItem.groupBy({
    by: ['box_no'],
    _count: { box_no: true },
    orderBy: { _count: { box_no: 'desc' } },
    take: 30,
  });

  const boxNos = trending.map((t) => t.box_no);

  const sets = await prisma.setsCatalog.findMany({
    where: {
      box_no: { in: boxNos },
      year_released: { gte: String(MIN_YEAR) },
    },
    select: {
      box_no: true,
      name: true,
      category_name: true,
      year_released: true,
    },
  });

  // Preserve trending order and filter to in-production
  const setMap = new Map(sets.map((s) => [s.box_no, s]));
  const result: RecommendedSet[] = [];

  for (const t of trending) {
    if (result.length >= 8) break;
    const set = setMap.get(t.box_no);
    if (!set) continue;
    const status = detectAvailabilityByYear(set.year_released, set.category_name);
    if (status !== 'available' && status !== 'retiring_soon') continue;

    result.push({
      box_no: set.box_no,
      name: set.name,
      category_name: set.category_name,
      year_released: set.year_released,
      imageUrl: `https://img.bricklink.com/ItemImage/SN/0/${set.box_no}.png`,
      availability: status,
      userCount: Number(t._count.box_no),
    });
  }

  return result;
}
