import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

type CollectionType = 'inventory' | 'collection' | 'sets-inventory' | 'sets-collection';

const getFieldNames = (type: CollectionType) => {
  switch (type) {
    case 'inventory':
      return { tokenField: 'shareTokenInventory', enabledField: 'shareEnabledInventory' };
    case 'collection':
      return { tokenField: 'shareTokenCollection', enabledField: 'shareEnabledCollection' };
    case 'sets-inventory':
      return { tokenField: 'shareTokenSetsInventory', enabledField: 'shareEnabledSetsInventory' };
    case 'sets-collection':
      return { tokenField: 'shareTokenSetsCollection', enabledField: 'shareEnabledSetsCollection' };
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
    const { tokenField, enabledField } = getFieldNames(type);

    // Generate a random token
    const shareToken = randomBytes(16).toString('hex');

    // Update user with share token and enable sharing
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        [tokenField]: shareToken,
        [enabledField]: true
      }
    });

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
    const { tokenField, enabledField } = getFieldNames(type);

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        shareTokenInventory: true,
        shareEnabledInventory: true,
        shareTokenCollection: true,
        shareEnabledCollection: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
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

    switch (type) {
      case 'inventory':
        currentEnabled = user.shareEnabledInventory;
        currentToken = user.shareTokenInventory;
        break;
      case 'collection':
        currentEnabled = user.shareEnabledCollection;
        currentToken = user.shareTokenCollection;
        break;
      case 'sets-inventory':
        currentEnabled = user.shareEnabledSetsInventory;
        currentToken = user.shareTokenSetsInventory;
        break;
      case 'sets-collection':
        currentEnabled = user.shareEnabledSetsCollection;
        currentToken = user.shareTokenSetsCollection;
        break;
    }

    // Toggle sharing
    const newShareEnabled = !currentEnabled;

    // If enabling and no token exists, generate one
    let shareToken = currentToken;
    if (newShareEnabled && !shareToken) {
      shareToken = randomBytes(16).toString('hex');
    }

    // Build update data
    const updateData: any = {
      [enabledField]: newShareEnabled,
    };
    if (shareToken) {
      updateData[tokenField] = shareToken;
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
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
        shareTokenCollection: true,
        shareEnabledCollection: true,
        shareTokenSetsInventory: true,
        shareEnabledSetsInventory: true,
        shareTokenSetsCollection: true,
        shareEnabledSetsCollection: true,
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

    switch (type) {
      case 'inventory':
        shareEnabled = user.shareEnabledInventory;
        shareToken = user.shareTokenInventory;
        break;
      case 'collection':
        shareEnabled = user.shareEnabledCollection;
        shareToken = user.shareTokenCollection;
        break;
      case 'sets-inventory':
        shareEnabled = user.shareEnabledSetsInventory;
        shareToken = user.shareTokenSetsInventory;
        break;
      case 'sets-collection':
        shareEnabled = user.shareEnabledSetsCollection;
        shareToken = user.shareTokenSetsCollection;
        break;
    }

    return NextResponse.json({
      success: true,
      shareEnabled,
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
