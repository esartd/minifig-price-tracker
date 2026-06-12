import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDefaultDisplayName } from '@/lib/leaderboards'

export const revalidate = 300 // cache 5 minutes

export async function GET() {
  try {
    const [
      totalCollectors,
      allMinifigCounts,
      allSetCounts,
      longestTenured,
      newestMembers,
    ] = await prisma.$transaction([
      prisma.user.count({
        where: { profilePublic: true, username: { not: null } },
      }),
      prisma.user.findMany({
        where: { profilePublic: true, username: { not: null } },
        select: {
          username: true,
          name: true,
          leaderboardDisplayName: true,
          _count: {
            select: {
              CollectionItem: true,
              PersonalCollectionItem: true,
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
          leaderboardDisplayName: true,
          _count: {
            select: {
              SetInventoryItem: true,
              SetPersonalCollectionItem: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.findFirst({
        where: { profilePublic: true, username: { not: null } },
        select: {
          username: true,
          name: true,
          leaderboardDisplayName: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.findMany({
        where: { profilePublic: true, username: { not: null } },
        select: {
          username: true,
          name: true,
          leaderboardDisplayName: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    // Compute totals per user for minifigs
    let totalItemsTracked = 0
    let largestMinifigUser = { username: '', displayName: '', count: 0 }
    for (const u of allMinifigCounts) {
      const count = u._count.CollectionItem + u._count.PersonalCollectionItem
      totalItemsTracked += count
      if (count > largestMinifigUser.count) {
        largestMinifigUser = {
          username: u.username!,
          displayName: u.leaderboardDisplayName || generateDefaultDisplayName(u.name),
          count,
        }
      }
    }

    let largestSetUser = { username: '', displayName: '', count: 0 }
    for (const u of allSetCounts) {
      const count = u._count.SetInventoryItem + u._count.SetPersonalCollectionItem
      totalItemsTracked += count
      if (count > largestSetUser.count) {
        largestSetUser = {
          username: u.username!,
          displayName: u.leaderboardDisplayName || generateDefaultDisplayName(u.name),
          count,
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCollectors,
        totalItemsTracked,
        longestTenured: longestTenured
          ? {
              displayName: longestTenured.leaderboardDisplayName || generateDefaultDisplayName(longestTenured.name),
              username: longestTenured.username!,
              memberSince: longestTenured.createdAt.toISOString(),
            }
          : null,
        largestMinifigCollection: largestMinifigUser.count > 0 ? largestMinifigUser : null,
        largestSetCollection: largestSetUser.count > 0 ? largestSetUser : null,
        newestMembers: newestMembers.map((u) => ({
          displayName: u.leaderboardDisplayName || generateDefaultDisplayName(u.name),
          username: u.username!,
          memberSince: u.createdAt.toISOString(),
        })),
      },
    })
  } catch (error) {
    console.error('community-stats error:', error)
    return NextResponse.json({ error: 'Failed to load community stats' }, { status: 500 })
  }
}
