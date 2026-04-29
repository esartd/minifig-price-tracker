import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

type CollectionType = 'inventory' | 'collection' | 'sets-inventory' | 'sets-collection';

const getFieldNames = (type: CollectionType) => {
  switch (type) {
    case 'inventory':
      return { tokenField: 'shareTokenInventory', enabledField: 'shareEnabledInventory', pricingField: 'sharePricingInventory' };
    case 'collection':
      return { tokenField: 'shareTokenCollection', enabledField: 'shareEnabledCollection', pricingField: 'sharePricingCollection' };
    case 'sets-inventory':
      return { tokenField: 'shareTokenSetsInventory', enabledField: 'shareEnabledSetsInventory', pricingField: 'sharePricingSetsInventory' };
    case 'sets-collection':
      return { tokenField: 'shareTokenSetsCollection', enabledField: 'shareEnabledSetsCollection', pricingField: 'sharePricingSetsCollection' };
  }
};

// Generate a unique share token
export async function POST(request: Request) {
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

    // Generate a random token
    const shareToken = randomBytes(16).toString('hex');

    // Update user with share token and enable sharing
    switch (type) {
      case 'inventory':
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            shareTokenInventory: shareToken,
            shareEnabledInventory: true
          }
        });
        break;
      case 'collection':
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            shareTokenCollection: shareToken,
            shareEnabledCollection: true
          }
        });
        break;
      case 'sets-inventory':
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            shareTokenSetsInventory: shareToken,
            shareEnabledSetsInventory: true
          }
        });
        break;
      case 'sets-collection':
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            shareTokenSetsCollection: shareToken,
            shareEnabledSetsCollection: true
          }
        });
        break;
    }

    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken}?type=${type}`
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate share link' },
      { status: 500 }
    );
  }
}

// Toggle sharing on/off
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
    const { tokenField, enabledField, pricingField } = getFieldNames(type);

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        shareTokenInventory: true,
        shareEnabledInventory: true,
        sharePricingInventory: true,
        shareTokenCollection: true,
        shareEnabledCollection: true,
        sharePricingCollection: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        sharePricingSetsInventory: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
        sharePricingSetsCollection: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get current values based on type
    let currentEnabled: boolean;
    let currentToken: string | null;
    let currentPricing: boolean;

    switch (type) {
      case 'inventory':
        currentEnabled = user.shareEnabledInventory;
        currentToken = user.shareTokenInventory;
        currentPricing = user.sharePricingInventory;
        break;
      case 'collection':
        currentEnabled = user.shareEnabledCollection;
        currentToken = user.shareTokenCollection;
        currentPricing = user.sharePricingCollection;
        break;
      case 'sets-inventory':
        currentEnabled = user.shareEnabledSetsInventory;
        currentToken = user.shareTokenSetsInventory;
        currentPricing = user.sharePricingSetsInventory;
        break;
      case 'sets-collection':
        currentEnabled = user.shareEnabledSetsCollection;
        currentToken = user.shareTokenSetsCollection;
        currentPricing = user.sharePricingSetsCollection;
        break;
    }

    // Toggle sharing
    const newShareEnabled = !currentEnabled;

    // If enabling and no token exists, generate one
    let shareToken = currentToken;
    if (newShareEnabled && !shareToken) {
      shareToken = randomBytes(16).toString('hex');
    }

    // Update database with explicit conditionals
    switch (type) {
      case 'inventory':
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            shareEnabledInventory: newShareEnabled,
            ...(shareToken && { shareTokenInventory: shareToken })
          }
        });
        break;
      case 'collection':
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            shareEnabledCollection: newShareEnabled,
            ...(shareToken && { shareTokenCollection: shareToken })
          }
        });
        break;
      case 'sets-inventory':
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            shareEnabledSetsInventory: newShareEnabled,
            ...(shareToken && { shareTokenSetsInventory: shareToken })
          }
        });
        break;
      case 'sets-collection':
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            shareEnabledSetsCollection: newShareEnabled,
            ...(shareToken && { shareTokenSetsCollection: shareToken })
          }
        });
        break;
    }

    return NextResponse.json({
      success: true,
      shareEnabled: newShareEnabled,
      sharePricing: currentPricing,
      shareToken,
      shareUrl: shareToken ? `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken}?type=${type}` : null
    });
  } catch (error) {
    console.error('Error toggling share:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle sharing' },
      { status: 500 }
    );
  }
}

// Get current share status
export async function GET(request: Request) {
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        shareTokenInventory: true,
        shareEnabledInventory: true,
        sharePricingInventory: true,
        shareTokenCollection: true,
        shareEnabledCollection: true,
        sharePricingCollection: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        sharePricingSetsInventory: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
        sharePricingSetsCollection: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    let shareEnabled: boolean;
    let shareToken: string | null;
    let sharePricing: boolean;

    switch (type) {
      case 'inventory':
        shareEnabled = user.shareEnabledInventory;
        shareToken = user.shareTokenInventory;
        sharePricing = user.sharePricingInventory;
        break;
      case 'collection':
        shareEnabled = user.shareEnabledCollection;
        shareToken = user.shareTokenCollection;
        sharePricing = user.sharePricingCollection;
        break;
      case 'sets-inventory':
        shareEnabled = user.shareEnabledSetsInventory;
        shareToken = user.shareTokenSetsInventory;
        sharePricing = user.sharePricingSetsInventory;
        break;
      case 'sets-collection':
        shareEnabled = user.shareEnabledSetsCollection;
        shareToken = user.shareTokenSetsCollection;
        sharePricing = user.sharePricingSetsCollection;
        break;
    }

    return NextResponse.json({
      success: true,
      shareEnabled,
      sharePricing,
      shareToken,
      shareUrl: shareToken ? `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken}?type=${type}` : null
    });
  } catch (error) {
    console.error('Error getting share status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get share status' },
      { status: 500 }
    );
  }
}
