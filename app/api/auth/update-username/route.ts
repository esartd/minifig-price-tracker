import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { validateUsername } from '@/lib/username'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { username } = body

  if (typeof username !== 'string') {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  const lower = username.toLowerCase().trim()
  const validation = validateUsername(lower)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({
    where: { username: lower },
    select: { id: true },
  })

  if (existing && existing.id !== session.user.id) {
    return NextResponse.json({ error: 'This username is already taken' }, { status: 409 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username: lower },
  })

  return NextResponse.json({ success: true, username: lower })
}

// Check availability without saving
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('check')

  if (!username) {
    return NextResponse.json({ error: 'Missing check param' }, { status: 400 })
  }

  const lower = username.toLowerCase().trim()
  const validation = validateUsername(lower)
  if (!validation.valid) {
    return NextResponse.json({ available: false, error: validation.error })
  }

  const session = await auth()
  const existing = await prisma.user.findUnique({
    where: { username: lower },
    select: { id: true },
  })

  const available = !existing || (session?.user?.id !== undefined && existing.id === session.user.id)
  return NextResponse.json({ available })
}
