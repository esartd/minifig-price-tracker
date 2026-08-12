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

    // Theme counts, minifigs only - used for Theme Leaders ("who has the
    // most minifigs per theme", explicitly minifig-scoped by its own label).
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

    // Theme counts across minifigs AND sets - used for Specialists ("80%+ of
    // their collection is one theme", which unlike Theme Leaders is labeled
    // as the whole collection, not minifigs specifically). Sets already
    // carry their own denormalized category_name, no catalog join needed.
    const rawThemeCountsAll = await prisma.$queryRaw<{ userId: string; category_name: string; cnt: bigint }[]>`
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
        UNION ALL
        SELECT si.userId, si.category_name, si.quantity AS qty
        FROM SetInventoryItem si
        INNER JOIN User u ON u.id = si.userId
        WHERE si.category_name IS NOT NULL AND si.category_name != ''
          AND u.profilePublic = true
        UNION ALL
        SELECT spci.userId, spci.category_name, spci.quantity AS qty
        FROM SetPersonalCollectionItem spci
        INNER JOIN User u ON u.id = spci.userId
        WHERE spci.category_name IS NOT NULL AND spci.category_name != ''
          AND u.profilePublic = true
      ) combined
      GROUP BY userId, SUBSTRING_INDEX(category_name, ' / ', 1)
      ORDER BY cnt DESC
    `

    // Per-user quantity totals (minifigs + sets, inventory + personal)
    const rawQtyTotals = await prisma.$queryRaw<{
      userId: string; minifigQty: bigint; setQty: bigint
    }[]>`
      SELECT userId, SUM(minifigQty) AS minifigQty, SUM(setQty) AS setQty
      FROM (
        SELECT userId, SUM(quantity) AS minifigQty, 0 AS setQty
        FROM CollectionItem ci
        INNER JOIN User u ON u.id = ci.userId
        WHERE u.profilePublic = true
        GROUP BY userId
        UNION ALL
        SELECT userId, SUM(quantity) AS minifigQty, 0 AS setQty
        FROM PersonalCollectionItem pci
        INNER JOIN User u ON u.id = pci.userId
        WHERE u.profilePublic = true
        GROUP BY userId
        UNION ALL
        SELECT userId, 0 AS minifigQty, SUM(quantity) AS setQty
        FROM SetInventoryItem si
        INNER JOIN User u ON u.id = si.userId
        WHERE u.profilePublic = true
        GROUP BY userId
        UNION ALL
        SELECT userId, 0 AS minifigQty, SUM(quantity) AS setQty
        FROM SetPersonalCollectionItem spci
        INNER JOIN User u ON u.id = spci.userId
        WHERE u.profilePublic = true
        GROUP BY userId
      ) combined
      GROUP BY userId
    `

    const qtyByUser = new Map<string, { minifigs: number; sets: number }>()
    for (const row of rawQtyTotals) {
      qtyByUser.set(row.userId, {
        minifigs: Number(row.minifigQty),
        sets: Number(row.setQty),
      })
    }

    // Recent activity: last 40 items added across all public collectors.
    // This used to only query CollectionItem (minifigs "for sale"), missing
    // PersonalCollectionItem ("to keep") and both set tables entirely - so
    // if most community activity was people adding to their personal
    // collection or adding sets rather than sell inventory specifically,
    // this feed surfaced only sparse, increasingly old "for sale" additions
    // (reported: entries showing as 48-64 days old on a "right now" feed).
    // Union all 4 sources, same pattern already used for rawQtyTotals above.
    const recentActivityRaw = await prisma.$queryRaw<{
      item_no: string;
      item_name: string | null;
      image_url: string | null;
      date_added: Date | null;
      userId: string;
    }[]>`
      SELECT item_no, item_name, image_url, date_added, userId
      FROM (
        SELECT ci.minifigure_no AS item_no, ci.minifigure_name AS item_name, ci.image_url, ci.date_added, ci.userId
        FROM CollectionItem ci
        INNER JOIN User u ON u.id = ci.userId
        WHERE u.profilePublic = true AND ci.minifigure_name IS NOT NULL AND ci.date_added IS NOT NULL
        UNION ALL
        SELECT pci.minifigure_no AS item_no, pci.minifigure_name AS item_name, pci.image_url, pci.date_added, pci.userId
        FROM PersonalCollectionItem pci
        INNER JOIN User u ON u.id = pci.userId
        WHERE u.profilePublic = true AND pci.minifigure_name IS NOT NULL AND pci.date_added IS NOT NULL
        UNION ALL
        SELECT si.box_no AS item_no, si.set_name AS item_name, si.image_url, si.date_added, si.userId
        FROM SetInventoryItem si
        INNER JOIN User u ON u.id = si.userId
        WHERE u.profilePublic = true AND si.set_name IS NOT NULL AND si.date_added IS NOT NULL
        UNION ALL
        SELECT spci.box_no AS item_no, spci.set_name AS item_name, spci.image_url, spci.date_added, spci.userId
        FROM SetPersonalCollectionItem spci
        INNER JOIN User u ON u.id = spci.userId
        WHERE u.profilePublic = true AND spci.set_name IS NOT NULL AND spci.date_added IS NOT NULL
      ) combined
      ORDER BY date_added DESC
      LIMIT 40
    `

    function toCard(u: (typeof allPublicUsers)[0]) {
      const qty = qtyByUser.get(u.id)
      const totalMinifigs = qty?.minifigs ?? 0
      const totalSets = qty?.sets ?? 0
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

    // Global theme top map (for Theme Leaders - minifigs only)
    const themeTopMap = new Map<string, { userId: string; count: number }>()

    for (const row of rawThemeCounts) {
      const theme = row.category_name
      if (!theme) continue
      const count = Number(row.cnt)

      const existing = themeTopMap.get(theme)
      if (!existing || count > existing.count) {
        themeTopMap.set(theme, { userId: row.userId, count })
      }
    }

    // Per-user theme map across minifigs AND sets (for Specialists)
    const userThemeMapAll = new Map<string, Map<string, number>>()
    for (const row of rawThemeCountsAll) {
      const theme = row.category_name
      if (!theme) continue
      const count = Number(row.cnt)
      if (!userThemeMapAll.has(row.userId)) userThemeMapAll.set(row.userId, new Map())
      userThemeMapAll.get(row.userId)!.set(theme, count)
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

    // Specialists: collectors where 80%+ of their collection (minifigs + sets) is one theme
    const specialists: { user: ReturnType<typeof toCard>; theme: string; pct: number }[] = []
    for (const [userId, themeMap] of userThemeMapAll.entries()) {
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
        const qty = qtyByUser.get(u.id)
        const total = (qty?.minifigs ?? 0) + (qty?.sets ?? 0)
        return u.createdAt >= sixtyDaysAgo && total >= 10
      })
      .sort((a, b) => {
        const tA = (qtyByUser.get(a.id)?.minifigs ?? 0) + (qtyByUser.get(a.id)?.sets ?? 0)
        const tB = (qtyByUser.get(b.id)?.minifigs ?? 0) + (qtyByUser.get(b.id)?.sets ?? 0)
        return tB - tA
      })
      .slice(0, 5)
      .map(toCard)

    // Recent activity: up to 5 items, max 2 per user for variety
    const seenUserCounts = new Map<string, number>()
    const recentActivity: {
      itemNo: string;
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
        itemNo: row.item_no,
        name: row.item_name!,
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
      .map(u => ({ ...u, total: (qtyByUser.get(u.id)?.minifigs ?? 0) + (qtyByUser.get(u.id)?.sets ?? 0) }))
      .filter(u => u.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(toCard)

    // Most diverse: collectors who have both minifigs AND sets, sorted by total quantity
    const mostDiverse = [...allPublicUsers]
      .map(u => ({
        ...u,
        minifigs: qtyByUser.get(u.id)?.minifigs ?? 0,
        sets: qtyByUser.get(u.id)?.sets ?? 0,
      }))
      .filter(u => u.minifigs > 0 && u.sets > 0)
      .sort((a, b) => (b.minifigs + b.sets) - (a.minifigs + a.sets))
      .slice(0, 5)
      .map(toCard)

    let totalItemsTracked = 0
    for (const [, qty] of qtyByUser) {
      totalItemsTracked += qty.minifigs + qty.sets
    }

    // Shuffle spotlight candidates for genuine per-request variety (the UI
    // subtitle promises "Changes each visit"). The previous sort compared a
    // fixed character of each user's database id - since ids never change,
    // that produced the exact same 4 people on every single call. Verified
    // live: 3 consecutive requests returned an identical list. Fisher-Yates
    // with Math.random() actually varies per request.
    const shuffled = [...spotlightCandidates]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
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
