import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items to migrate' }, { status: 400 });
    }

    const userId = session.user.id;
    let migratedCount = 0;
    let failedCount = 0;

    // Process each item from guest collection
    for (const item of items) {
      try {
        const { itemNo, itemType, action, quantity, condition, price } = item;

        if (itemType === 'minifig') {
          // Add to minifig collection
          if (action === 'sell') {
            // Add to inventory (to sell)
            await prisma.collectionItem.create({
              data: {
                user_id: userId,
                minifigure_no: itemNo,
                quantity: quantity || 1,
                condition: condition || 'new',
              },
            });
          } else {
            // Add to personal collection (to keep)
            await prisma.personalCollectionItem.create({
              data: {
                user_id: userId,
                minifigure_no: itemNo,
                quantity: quantity || 1,
                condition: condition || 'new',
              },
            });
          }
        } else if (itemType === 'set') {
          // Add to set collection
          if (action === 'sell') {
            // Add to set inventory (to sell)
            await prisma.setsInventoryItem.create({
              data: {
                user_id: userId,
                box_no: itemNo,
                quantity: quantity || 1,
                condition: condition || 'new',
              },
            });
          } else {
            // Add to set personal collection (to keep)
            await prisma.setsCollectionItem.create({
              data: {
                user_id: userId,
                box_no: itemNo,
                quantity: quantity || 1,
                condition: condition || 'new',
              },
            });
          }
        }

        migratedCount++;
      } catch (error: any) {
        console.error(`Failed to migrate item ${item.itemNo}:`, error);
        failedCount++;
        // Continue with other items even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      migratedCount,
      failedCount,
      message: `Successfully migrated ${migratedCount} items${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to migrate collection', details: error.message },
      { status: 500 }
    );
  }
}
