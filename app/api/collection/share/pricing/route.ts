import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

type CollectionType = 'inventory' | 'collection' | 'sets-inventory' | 'sets-collection';

const getPricingField = (type: CollectionType) => {
  switch (type) {
    case 'inventory':
      return 'sharePricingInventory';
    case 'collection':
      return 'sharePricingCollection';
    case 'sets-inventory':
      return 'sharePricingSetsInventory';
    case 'sets-collection':
      return 'sharePricingSetsCollection';
  }
};

// Toggle pricing visibility
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const type = (url.searchParams.get('type') || 'inventory') as CollectionType;
    const pricingField = getPricingField(type);

    const { sharePricing } = await request.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        [pricingField]: sharePricing
      }
    });

    return NextResponse.json({
      success: true,
      sharePricing
    });
  } catch (error) {
    console.error('Error toggling pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle pricing' },
      { status: 500 }
    );
  }
}
