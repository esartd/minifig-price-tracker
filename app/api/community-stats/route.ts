import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDefaultDisplayName } from '@/lib/leaderboards'

export const revalidate = 300

export async function GET() {
  try {
    const [allPublicUsers, newestMembers, spotlightCandidates] = await prisma.$transaction([
      prisma.user.findMany({
        where: { profilePublic: true, username: { not: null } },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          leaderboardDisplayName: true,
          createdAt: true,
          _count: {
            select: {
              CollectionItem: true,
              PersonalCollectionItem: true,
              SetInventoryItem: true,
              SetPersonalCollectionItem: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.findMany({
        where: { profilePublic: true, username: { not: null } },
        select: {
          username: true,
          name: true,
          image: true,
          leaderboardDisplayName: true,
          createdAt: true,
          _count: {
            select: {
              CollectionItem: true,
              PersonalCollectionItem: true,
              SetInventoryItem: true,
              SetPersonalCollectionItem: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      // Spotlight: users with at least 1 item
      prisma.user.findMany({
        where: {
          profilePublic: true,
          username: { not: null },
          OR: [
            { CollectionItem: { some: {} } },
            { PersonalCollectionItem: { some: {} } },
            { SetInventoryItem: { some: {} } },
            { SetPersonalCollectionItem: { some: {} } },
          ],
        },
        select: {
          username: true,
          name: true,
          image: true,
          leaderboardDisplayName: true,
          createdAt: true,
          _count: {
            select: {
              CollectionItem: true,
              PersonalCollectionItem: true,
              SetInventoryItem: true,
              SetPersonalCollectionItem: true,
            },
          },
        },
        take: 30,
      }),
    ])

    // Theme leaders via raw SQL: join CollectionItem -> MinifigCatalog for category
    const themeCounts = await prisma.$queryRaw<{ userId: string; category_name: string; cnt: bigint }[]>`
      SELECT ci.userId, mc.category_name, COUNT(*) as cnt
      FROM CollectionItem ci
      INNER JOIN MinifigCatalog mc ON mc.minifigure_no = ci.minifigure_no
      INNER JOIN User u ON u.id = ci.userId
      WHERE mc.category_name IS NOT NULL AND mc.category_name != ''
        AND u.profilePublic = true AND u.username IS NOT NULL
      GROUP BY ci.userId, mc.category_name
      ORDER BY cnt DESC
    `

    function toCard(u: (typeof allPublicUsers)[0] | (typeof newestMembers)[0]) {
      const totalMinifigs = u._count.CollectionItem + u._count.PersonalCollectionItem
      const totalSets = u._count.SetInventoryItem + u._count.SetPersonalCollectionItem
      return {
        username: u.username!,
        displayName: u.leaderboardDisplayName || generateDefaultDisplayName(u.name),
        image: u.image ?? null,
        memberSince: u.createdAt.toISOString(),
        stats: { totalMinifigs, totalSets, totalItems: totalMinifigs + totalSets },
      }
    }

    // Build userId -> user lookup
    const userById = new Map(allPublicUsers.map(u => [u.id, u]))

    // Theme leaders: for each theme, find top user
    const themeTopMap = new Map<string, { userId: string; count: number }>()
    for (const row of themeCounts) {
      const theme = row.category_name
      if (!theme) continue
      const count = Number(row.cnt)
      const existing = themeTopMap.get(theme)
      if (!existing || count > existing.count) {
        themeTopMap.set(theme, { userId: row.userId, count })
      }
    }

    // Convert to array, filter to popular themes (at least 3 items), sort by count desc, take top 8
    const POPULAR_THEMES = [
      'Star Wars', 'Harry Potter', 'Super Heroes', 'Ninjago', 'City', 'Technic',
      'Creator', 'Ideas', 'Friends', 'Jurassic World', 'Speed Champions', 'Disney',
      'Minecraft', 'Marvel', 'DC', 'Indiana Jones', 'Pirates', 'Castle', 'Space',
    ]
    const themeLeaders: { theme: string; user: ReturnType<typeof toCard>; count: number }[] = []
    for (const [theme, { userId, count }] of themeTopMap.entries()) {
      if (count < 3) continue
      const u = userById.get(userId)
      if (!u) continue
      themeLeaders.push({ theme, user: toCard(u), count })
    }
    // Sort: popular themes first, then by count
    themeLeaders.sort((a, b) => {
      const aP = POPULAR_THEMES.indexOf(a.theme)
      const bP = POPULAR_THEMES.indexOf(b.theme)
      if (aP !== -1 && bP !== -1) return aP - bP
      if (aP !== -1) return -1
      if (bP !== -1) return 1
      return b.count - a.count
    })

    const longestTenured = allPublicUsers.slice(0, 5).map(toCard)

    const biggestCollections = [...allPublicUsers]
      .map(u => ({
        ...u,
        total: u._count.CollectionItem + u._count.PersonalCollectionItem + u._count.SetInventoryItem + u._count.SetPersonalCollectionItem,
      }))
      .filter(u => u.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(toCard)

    const mostDiverse = [...allPublicUsers]
      .map(u => ({
        ...u,
        minifigs: u._count.CollectionItem + u._count.PersonalCollectionItem,
        sets: u._count.SetInventoryItem + u._count.SetPersonalCollectionItem,
      }))
      .filter(u => u.minifigs > 0 && u.sets > 0)
      .sort((a, b) => (b.minifigs + b.sets) - (a.minifigs + a.sets))
      .slice(0, 5)
      .map(toCard)

    let totalItemsTracked = 0
    for (const u of allPublicUsers) {
      totalItemsTracked += u._count.CollectionItem + u._count.PersonalCollectionItem + u._count.SetInventoryItem + u._count.SetPersonalCollectionItem
    }

    // Shuffle spotlight (vary by username char to get different each deploy)
    const shuffled = [...spotlightCandidates].sort((a, b) =>
      (a.username!.charCodeAt(1) || 0) % 11 - (b.username!.charCodeAt(1) || 0) % 11
    )
    const spotlight = shuffled.slice(0, 4).map(toCard)

    return NextResponse.json({
      success: true,
      data: {
        totalCollectors: allPublicUsers.length,
        totalItemsTracked,
        longestTenured,
        biggestCollections,
        mostDiverse,
        newestMembers: newestMembers.map(toCard),
        spotlight,
        themeLeaders: themeLeaders.slice(0, 12),
      },
    })
  } catch (error) {
    console.error('community-stats error:', error)
    return NextResponse.json({ error: 'Failed to load community stats' }, { status: 500 })
  }
}
