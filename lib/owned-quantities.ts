import { prisma } from '@/lib/prisma';

// Caps how many item numbers a single request can look up, so a malformed
// client request can't turn this into an unbounded query
const MAX_ITEMS_PER_LOOKUP = 100;

/**
 * Combined quantity (personal collection "to keep" + sell inventory "for sale")
 * that a user owns for each of the given minifig numbers.
 */
export async function getOwnedMinifigQuantities(
  userId: string,
  minifigNos: string[]
): Promise<Record<string, number>> {
  const nos = [...new Set(minifigNos)].slice(0, MAX_ITEMS_PER_LOOKUP);
  if (!userId || nos.length === 0) return {};

  const [collection, inventory] = await Promise.all([
    prisma.personalCollectionItem.findMany({
      where: { userId, minifigure_no: { in: nos } },
      select: { minifigure_no: true, quantity: true }
    }),
    prisma.collectionItem.findMany({
      where: { userId, minifigure_no: { in: nos } },
      select: { minifigure_no: true, quantity: true }
    })
  ]);

  const totals: Record<string, number> = {};
  for (const item of [...collection, ...inventory]) {
    totals[item.minifigure_no] = (totals[item.minifigure_no] || 0) + item.quantity;
  }
  return totals;
}

/**
 * Combined quantity (personal collection "to keep" + sell inventory "for sale")
 * that a user owns for each of the given set numbers (box_no).
 */
export async function getOwnedSetQuantities(
  userId: string,
  boxNos: string[]
): Promise<Record<string, number>> {
  const nos = [...new Set(boxNos)].slice(0, MAX_ITEMS_PER_LOOKUP);
  if (!userId || nos.length === 0) return {};

  const [collection, inventory] = await Promise.all([
    prisma.setPersonalCollectionItem.findMany({
      where: { userId, box_no: { in: nos } },
      select: { box_no: true, quantity: true }
    }),
    prisma.setInventoryItem.findMany({
      where: { userId, box_no: { in: nos } },
      select: { box_no: true, quantity: true }
    })
  ]);

  const totals: Record<string, number> = {};
  for (const item of [...collection, ...inventory]) {
    totals[item.box_no] = (totals[item.box_no] || 0) + item.quantity;
  }
  return totals;
}
