import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { bricklinkAPI } from '@/lib/bricklink';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { newCondition } = await request.json();

    if (!newCondition || (newCondition !== 'new' && newCondition !== 'used')) {
      return NextResponse.json(
        { success: false, error: 'Invalid condition' },
        { status: 400 }
      );
    }

    // Get the current item
    const currentItem = await prisma.collectionItem.findUnique({
      where: { id, userId: session.user.id }
    });

    if (!currentItem) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // If condition is the same, do nothing
    if (currentItem.condition === newCondition) {
      return NextResponse.json({ success: true, data: currentItem });
    }

    // Check if user already has this minifig in the target condition
    const existingTargetItem = await prisma.collectionItem.findUnique({
      where: {
        userId_minifigure_no_condition: {
          userId: session.user.id,
          minifigure_no: currentItem.minifigure_no,
          condition: newCondition
        }
      }
    });

    // Get fresh pricing for the new condition
    const pricing = await bricklinkAPI.calculatePricingData(
      currentItem.minifigure_no,
      newCondition as 'new' | 'used'
    );

    if (existingTargetItem) {
      // Merge: Add current quantity to existing target item
      const mergedItem = await prisma.collectionItem.update({
        where: { id: existingTargetItem.id },
        data: {
          quantity: existingTargetItem.quantity + currentItem.quantity,
          pricing_six_month_avg: pricing.sixMonthAverage,
          pricing_current_avg: pricing.currentAverage,
          pricing_current_lowest: pricing.currentLowest,
          pricing_suggested_price: pricing.suggestedPrice
        }
      });

      // Delete the current item
      await prisma.collectionItem.delete({
        where: { id: currentItem.id }
      });

      return NextResponse.json({ success: true, data: mergedItem });
    } else {
      // No conflict: just update the condition
      const updatedItem = await prisma.collectionItem.update({
        where: { id: currentItem.id },
        data: {
          condition: newCondition,
          pricing_six_month_avg: pricing.sixMonthAverage,
          pricing_current_avg: pricing.currentAverage,
          pricing_current_lowest: pricing.currentLowest,
          pricing_suggested_price: pricing.suggestedPrice
        }
      });

      return NextResponse.json({ success: true, data: updatedItem });
    }
  } catch (error) {
    console.error('Error changing condition:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change condition' },
      { status: 500 }
    );
  }
}
