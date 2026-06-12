import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDefaultDisplayName } from '@/lib/leaderboards'

export const revalidate = 60

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const search = searchParams.get('search')?.trim() || ''

    const where = {
      profilePublic: true,
      username: { not: null as null },
      ...(search
        ? {
            OR: [
              { username: { contains: search } },
              { leaderboardDisplayName: { contains: search } },
              { name: { contains: search } },
            ],
          }
        : {}),
    }

    const [totalCount, collectors] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          username: true,
          name: true,
          leaderboardDisplayName: true,
          image: true,
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
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
    ])

    const data = collectors.map((u) => {
      const totalMinifigs = u._count.CollectionItem + u._count.PersonalCollectionItem
      const totalSets = u._count.SetInventoryItem + u._count.SetPersonalCollectionItem
      return {
        username: u.username!,
        displayName: u.leaderboardDisplayName || generateDefaultDisplayName(u.name),
        image: u.image,
        memberSince: u.createdAt.toISOString(),
        stats: {
          totalMinifigs,
          totalSets,
          totalItems: totalMinifigs + totalSets,
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        collectors: data,
        pagination: {
          page,
          totalPages: Math.ceil(totalCount / PAGE_SIZE),
          totalCount,
        },
      },
    })
  } catch (error) {
    console.error('collectors list error:', error)
    return NextResponse.json({ error: 'Failed to load collectors' }, { status: 500 })
  }
}
