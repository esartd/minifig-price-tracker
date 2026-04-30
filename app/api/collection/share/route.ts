import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

type CollectionType = 'inventory' | 'collection' | 'sets-inventory' | 'sets-collection';
type ShareMode = 'public' | 'private';

const getFieldNames = (type: CollectionType, mode: ShareMode) => {
  const suffix = mode === 'public' ? '' : 'Private';

  switch (type) {
    case 'inventory':
      return {
        tokenField: `shareTokenInventory${suffix}` as const,
        enabledField: `shareEnabledInventory${suffix}` as const
      };
    case 'collection':
      return {
        tokenField: `shareTokenCollection${suffix}` as const,
        enabledField: `shareEnabledCollection${suffix}` as const
      };
    case 'sets-inventory':
      return {
        tokenField: `shareTokenSetsInventory${suffix}` as const,
        enabledField: `shareEnabledSetsInventory${suffix}` as const
      };
    case 'sets-collection':
      return {
        tokenField: `shareTokenSetsCollection${suffix}` as const,
        enabledField: `shareEnabledSetsCollection${suffix}` as const
      };
  }
};

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
    const mode = (url.searchParams.get('mode') || 'public') as ShareMode;
    const { tokenField, enabledField } = getFieldNames(type, mode);

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        shareTokenInventory: true,
        shareEnabledInventory: true,
        shareTokenInventoryPrivate: true,
        shareEnabledInventoryPrivate: true,
        shareTokenCollection: true,
        shareEnabledCollection: true,
        shareTokenCollectionPrivate: true,
        shareEnabledCollectionPrivate: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        shareTokenSetsInventoryPrivate: true,
        shareEnabledSetsInventoryPrivate: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
        shareTokenSetsCollectionPrivate: true,
        shareEnabledSetsCollectionPrivate: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // @ts-ignore - Dynamic field access
    const currentEnabled = user[enabledField] as boolean;
    // @ts-ignore - Dynamic field access
    const currentToken = user[tokenField] as string | null;

    // Toggle sharing
    const newShareEnabled = !currentEnabled;

    // If enabling and no token exists, generate one
    let shareToken = currentToken;
    if (newShareEnabled && !shareToken) {
      shareToken = randomBytes(16).toString('hex');
    }

    // Update database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        [enabledField]: newShareEnabled,
        ...(shareToken && { [tokenField]: shareToken })
      }
    });

    return NextResponse.json({
      success: true,
      shareEnabled: newShareEnabled,
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
        shareTokenInventoryPrivate: true,
        shareEnabledInventoryPrivate: true,
        shareTokenCollection: true,
        shareEnabledCollection: true,
        shareTokenCollectionPrivate: true,
        shareEnabledCollectionPrivate: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        shareTokenSetsInventoryPrivate: true,
        shareEnabledSetsInventoryPrivate: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
        shareTokenSetsCollectionPrivate: true,
        shareEnabledSetsCollectionPrivate: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    let shareEnabledPublic: boolean;
    let shareTokenPublic: string | null;
    let shareEnabledPrivate: boolean;
    let shareTokenPrivate: string | null;

    switch (type) {
      case 'inventory':
        shareEnabledPublic = user.shareEnabledInventory;
        shareTokenPublic = user.shareTokenInventory;
        shareEnabledPrivate = user.shareEnabledInventoryPrivate;
        shareTokenPrivate = user.shareTokenInventoryPrivate;
        break;
      case 'collection':
        shareEnabledPublic = user.shareEnabledCollection;
        shareTokenPublic = user.shareTokenCollection;
        shareEnabledPrivate = user.shareEnabledCollectionPrivate;
        shareTokenPrivate = user.shareTokenCollectionPrivate;
        break;
      case 'sets-inventory':
        shareEnabledPublic = user.shareEnabledSetsInventory;
        shareTokenPublic = user.shareTokenSetsInventory;
        shareEnabledPrivate = user.shareEnabledSetsInventoryPrivate;
        shareTokenPrivate = user.shareTokenSetsInventoryPrivate;
        break;
      case 'sets-collection':
        shareEnabledPublic = user.shareEnabledSetsCollection;
        shareTokenPublic = user.shareTokenSetsCollection;
        shareEnabledPrivate = user.shareEnabledSetsCollectionPrivate;
        shareTokenPrivate = user.shareTokenSetsCollectionPrivate;
        break;
    }

    return NextResponse.json({
      success: true,
      shareEnabledPublic,
      shareUrlPublic: shareTokenPublic ? `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareTokenPublic}?type=${type}` : null,
      shareEnabledPrivate,
      shareUrlPrivate: shareTokenPrivate ? `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareTokenPrivate}?type=${type}` : null,
    });
  } catch (error) {
    console.error('Error getting share status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get share status' },
      { status: 500 }
    );
  }
}
