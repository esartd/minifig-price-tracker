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
        const { itemNo, itemType, action, quantity, condition, price, name, imageUrl } = item;

        if (itemType === 'minifig') {
          // Add to minifig collection
          if (action === 'sell') {
            // Add to inventory (to sell)
            await prisma.collectionItem.create({
              data: {
                userId: userId,
                minifigure_no: itemNo,
                minifigure_name: name || '',
                quantity: quantity || 1,
                condition: condition || 'new',
                image_url: imageUrl || null,
              },
            });
          } else {
            // Add to personal collection (to keep)
            await prisma.personalCollectionItem.create({
              data: {
                userId: userId,
                minifigure_no: itemNo,
                minifigure_name: name || '',
                quantity: quantity || 1,
                condition: condition || 'new',
                image_url: imageUrl || null,
              },
            });
          }
        } else if (itemType === 'set') {
          // Add to set collection
          if (action === 'sell') {
            // Add to set inventory (to sell)
            await prisma.setInventoryItem.create({
              data: {
                userId: userId,
                box_no: itemNo,
                set_name: name || '',
                quantity: quantity || 1,
                condition: condition || 'new',
                image_url: imageUrl || null,
              },
            });
          } else {
            // Add to set personal collection (to keep)
            await prisma.setCollectionItem.create({
              data: {
                userId: userId,
                box_no: itemNo,
                set_name: name || '',
                quantity: quantity || 1,
                condition: condition || 'new',
                image_url: imageUrl || null,
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
