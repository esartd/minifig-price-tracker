import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDefaultDisplayName } from '@/lib/leaderboards'

export const revalidate = 60

const COLLECTION_FIELDS = {
  id: true,
  minifigure_no: true,
  minifigure_name: true,
  quantity: true,
  condition: true,
  image_url: true,
  date_added: true,
} as const

const SET_FIELDS = {
  id: true,
  box_no: true,
  set_name: true,
  category_name: true,
  quantity: true,
  condition: true,
  image_url: true,
  date_added: true,
} as const

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    if (!username) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const lower = username.toLowerCase()

    const user = await prisma.user.findUnique({
      where: { username: lower },
      select: {
        id: true,
        name: true,
        leaderboardDisplayName: true,
        image: true,
        createdAt: true,
        profilePublic: true,
        _count: {
          select: {
            CollectionItem: true,
            PersonalCollectionItem: true,
            SetInventoryItem: true,
            SetPersonalCollectionItem: true,
          },
        },
      },
    })

    if (!user) return NextResponse.json({ error: 'Collector not found' }, { status: 404 })
    if (!user.profilePublic) {
      return NextResponse.json({ error: 'This profile is private' }, { status: 403 })
    }

    const [minifigInventory, minifigPersonal, setInventory, setPersonal] =
      await prisma.$transaction([
        prisma.collectionItem.findMany({
          where: { userId: user.id },
          select: COLLECTION_FIELDS,
          orderBy: { date_added: 'desc' },
        }),
        prisma.personalCollectionItem.findMany({
          where: { userId: user.id },
          select: COLLECTION_FIELDS,
          orderBy: { date_added: 'desc' },
        }),
        prisma.setInventoryItem.findMany({
          where: { userId: user.id },
          select: SET_FIELDS,
          orderBy: { date_added: 'desc' },
        }),
        prisma.setPersonalCollectionItem.findMany({
          where: { userId: user.id },
          select: SET_FIELDS,
          orderBy: { date_added: 'desc' },
        }),
      ])

    const totalMinifigs = user._count.CollectionItem + user._count.PersonalCollectionItem
    const totalSets = user._count.SetInventoryItem + user._count.SetPersonalCollectionItem

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          username: lower,
          displayName: user.leaderboardDisplayName || generateDefaultDisplayName(user.name),
          image: user.image,
          memberSince: user.createdAt.toISOString(),
          stats: {
            totalMinifigs,
            totalSets,
            totalItems: totalMinifigs + totalSets,
          },
        },
        collections: {
          minifigInventory,
          minifigPersonal,
          setInventory,
          setPersonal,
        },
      },
    })
  } catch (error) {
    console.error('collector profile error:', error)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}
