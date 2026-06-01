import { prisma } from '@/lib/prisma'

export async function wasAccountJustLinked(userId: string): Promise<boolean> {
  const googleAccount = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'google'
    },
    orderBy: { createdAt: 'desc' }
  })

  if (!googleAccount) return false

  // Check if Google account was created in the last 10 seconds
  const tenSecondsAgo = new Date(Date.now() - 10000)
  const wasJustCreated = googleAccount.createdAt > tenSecondsAgo

  if (!wasJustCreated) return false

  // Check if user also has credentials account (indicates linking, not new user)
  const credentialsAccount = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'credentials'
    }
  })

  return !!credentialsAccount
}
