import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDefaultDisplayName } from '@/lib/leaderboards'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [allPublicUsers, newestMembers, spotlightCandidates] = await prisma.$transaction([
      prisma.user.findMany({
        where: { profilePublic: true },
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
        where: { profilePublic: true },
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
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      // Spotlight: users with at least 1 item
      prisma.user.findMany({
        where: {
          profilePublic: true,
          OR: [
            { CollectionItem: { some: {} } },
            { PersonalCollectionItem: { some: {} } },
            { SetInventoryItem: { some: {} } },
            { SetPersonalCollectionItem: { some: {} } },
          ],
        },
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
        take: 30,
      }),
    ])

    // Theme counts (reused for theme leaders + specialists)
    // UNION both inventory + personal collection, SUM quantity, strip sub-themes
    const rawThemeCounts = await prisma.$queryRaw<{ userId: string; category_name: string; cnt: bigint }[]>`
      SELECT userId, SUBSTRING_INDEX(category_name, ' / ', 1) AS category_name, SUM(qty) AS cnt
      FROM (
        SELECT ci.userId, mc.category_name, ci.quantity AS qty
        FROM CollectionItem ci
        INNER JOIN MinifigCatalog mc ON mc.minifigure_no = ci.minifigure_no
        INNER JOIN User u ON u.id = ci.userId
        WHERE mc.category_name IS NOT NULL AND mc.category_name != ''
          AND u.profilePublic = true
        UNION ALL
        SELECT pci.userId, mc.category_name, pci.quantity AS qty
        FROM PersonalCollectionItem pci
        INNER JOIN MinifigCatalog mc ON mc.minifigure_no = pci.minifigure_no
        INNER JOIN User u ON u.id = pci.userId
        WHERE mc.category_name IS NOT NULL AND mc.category_name != ''
          AND u.profilePublic = true
      ) combined
      GROUP BY userId, SUBSTRING_INDEX(category_name, ' / ', 1)
      ORDER BY cnt DESC
    `

    // Recent activity: last 20 items added across all public collectors
    const recentActivityRaw = await prisma.$queryRaw<{
      minifigure_no: string;
      minifigure_name: string | null;
      image_url: string | null;
      date_added: Date | null;
      userId: string;
    }[]>`
      SELECT ci.minifigure_no, ci.minifigure_name, ci.image_url, ci.date_added, ci.userId
      FROM CollectionItem ci
      INNER JOIN User u ON u.id = ci.userId
      WHERE u.profilePublic = true
        AND ci.minifigure_name IS NOT NULL
        AND ci.date_added IS NOT NULL
      ORDER BY ci.date_added DESC
      LIMIT 20
    `

    function toCard(u: (typeof allPublicUsers)[0]) {
      const totalMinifigs = u._count.CollectionItem + u._count.PersonalCollectionItem
      const totalSets = u._count.SetInventoryItem + u._count.SetPersonalCollectionItem
      return {
        profileSlug: u.username || u.id,
        username: u.username,
        displayName: u.leaderboardDisplayName || generateDefaultDisplayName(u.name),
        image: u.image ?? null,
        memberSince: u.createdAt.toISOString(),
        stats: { totalMinifigs, totalSets, totalItems: totalMinifigs + totalSets },
      }
    }

    const userById = new Map(allPublicUsers.map(u => [u.id, u]))

    // Build per-user theme map (for specialists) and global theme top map (for theme leaders)
    const userThemeMap = new Map<string, Map<string, number>>()
    const themeTopMap = new Map<string, { userId: string; count: number }>()

    for (const row of rawThemeCounts) {
      const theme = row.category_name
      if (!theme) continue
      const count = Number(row.cnt)

      // Theme leaders: track top user per theme
      const existing = themeTopMap.get(theme)
      if (!existing || count > existing.count) {
        themeTopMap.set(theme, { userId: row.userId, count })
      }

      // Specialists: accumulate per-user theme counts
      if (!userThemeMap.has(row.userId)) userThemeMap.set(row.userId, new Map())
      userThemeMap.get(row.userId)!.set(theme, count)
    }

    // Exact top-level category names as stored in MinifigCatalog
    const POPULAR_THEMES = [
      'Star Wars', 'Harry Potter', 'Super Heroes', 'NINJAGO', 'Town', 'Technic',
      'Disney', 'Jurassic World', 'SPEED CHAMPIONS', 'Minecraft', 'Indiana Jones',
      'Pirates', 'Castle', 'Space', 'Collectible Minifigures', 'Friends',
      'The Hobbit and The Lord of the Rings', 'Avatar', 'Batman I',
    ]

    const themeLeaders: { theme: string; user: ReturnType<typeof toCard>; count: number }[] = []
    for (const [theme, { userId, count }] of themeTopMap.entries()) {
      if (count < 3) continue
      if (!POPULAR_THEMES.includes(theme)) continue
      const u = userById.get(userId)
      if (!u) continue
      themeLeaders.push({ theme, user: toCard(u), count })
    }
    themeLeaders.sort((a, b) => {
      const aP = POPULAR_THEMES.indexOf(a.theme)
      const bP = POPULAR_THEMES.indexOf(b.theme)
      if (aP !== -1 && bP !== -1) return aP - bP
      if (aP !== -1) return -1
      if (bP !== -1) return 1
      return b.count - a.count
    })

    // Specialists: collectors where 80%+ of their catalogued minifigs are one theme
    const specialists: { user: ReturnType<typeof toCard>; theme: string; pct: number }[] = []
    for (const [userId, themeMap] of userThemeMap.entries()) {
      const u = userById.get(userId)
      if (!u) continue
      let total = 0
      let topTheme = ''
      let topCount = 0
      for (const [theme, count] of themeMap.entries()) {
        total += count
        if (count > topCount) { topCount = count; topTheme = theme }
      }
      if (total < 10) continue
      const pct = Math.round((topCount / total) * 100)
      if (pct < 80) continue
      specialists.push({ user: toCard(u), theme: topTheme, pct })
    }
    specialists.sort((a, b) => b.pct - a.pct)

    // Rising stars: joined in last 60 days, already have 10+ items
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    const risingStars = allPublicUsers
      .filter(u => {
        const total = u._count.CollectionItem + u._count.PersonalCollectionItem
          + u._count.SetInventoryItem + u._count.SetPersonalCollectionItem
        return u.createdAt >= sixtyDaysAgo && total >= 10
      })
      .sort((a, b) => {
        const tA = a._count.CollectionItem + a._count.PersonalCollectionItem
          + a._count.SetInventoryItem + a._count.SetPersonalCollectionItem
        const tB = b._count.CollectionItem + b._count.PersonalCollectionItem
          + b._count.SetInventoryItem + b._count.SetPersonalCollectionItem
        return tB - tA
      })
      .slice(0, 5)
      .map(toCard)

    // Recent activity: up to 5 items, max 2 per user for variety
    const seenUserCounts = new Map<string, number>()
    const recentActivity: {
      minifigureNo: string;
      name: string;
      imageUrl: string | null;
      addedAt: string;
      user: { profileSlug: string; displayName: string; image: string | null };
    }[] = []
    for (const row of recentActivityRaw) {
      const userCount = seenUserCounts.get(row.userId) ?? 0
      if (userCount >= 2) continue
      const u = userById.get(row.userId)
      if (!u) continue
      seenUserCounts.set(row.userId, userCount + 1)
      recentActivity.push({
        minifigureNo: row.minifigure_no,
        name: row.minifigure_name!,
        imageUrl: row.image_url,
        addedAt: row.date_added!.toISOString(),
        user: {
          profileSlug: u.username || u.id,
          displayName: u.leaderboardDisplayName || generateDefaultDisplayName(u.name),
          image: u.image ?? null,
        },
      })
      if (recentActivity.length >= 5) break
    }

    const longestTenured = allPublicUsers.slice(0, 5).map(toCard)

    const biggestCollections = [...allPublicUsers]
      .map(u => ({ ...u, total: u._count.CollectionItem + u._count.PersonalCollectionItem + u._count.SetInventoryItem + u._count.SetPersonalCollectionItem }))
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

    // Shuffle spotlight using id chars for variation
    const shuffled = [...spotlightCandidates].sort((a, b) =>
      (a.id.charCodeAt(3) || 0) % 11 - (b.id.charCodeAt(3) || 0) % 11
    )
    const spotlight = shuffled.slice(0, 4).map(toCard)

    const payload = {
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
        risingStars,
        specialists: specialists.slice(0, 6),
        recentActivity,
      },
    }
    // Use manual JSON.stringify with BigInt replacer — NextResponse.json() throws on BigInt
    return new Response(JSON.stringify(payload, (_k, v) => typeof v === 'bigint' ? Number(v) : v), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('community-stats error:', error)
    return NextResponse.json({ error: 'Failed to load community stats' }, { status: 500 })
  }
}
