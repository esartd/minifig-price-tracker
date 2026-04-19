import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { findMinifigByNumber } from '@/lib/catalog-static';

/**
 * Admin endpoint to fix minifigure names in inventory
 *
 * Updates all collection items with correct character names from MinifigCache
 *
 * GET or POST /api/admin/fix-names
 */
async function fixNames() {
  try {
    // Only allow admin (check if user is logged in - add stricter auth if needed)
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔧 Fixing minifigure names in inventory...');

    // Get all collection items
    const items = await prisma.collectionItem.findMany({
      select: {
        id: true,
        minifigure_no: true,
        minifigure_name: true,
      }
    });

    console.log(`Found ${items.length} items in inventory`);

    let updated = 0;
    let skipped = 0;
    const updates: Array<{ id: string; old: string; new: string }> = [];

    for (const item of items) {
      // Look up correct name from static catalog
      const catalogItem = await findMinifigByNumber(item.minifigure_no);

      if (!catalogItem) {
        skipped++;
        continue;
      }

      // Check if name needs updating
      if (item.minifigure_name === catalogItem.name) {
        skipped++;
        continue;
      }

      // Update the name
      await prisma.collectionItem.update({
        where: { id: item.id },
        data: { minifigure_name: catalogItem.name }
      });

      updates.push({
        id: item.minifigure_no,
        old: item.minifigure_name,
        new: cached.name
      });
      updated++;
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: items.length,
        updated,
        skipped
      },
      updates
    });

  } catch (error: any) {
    console.error('Error fixing names:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Allow both GET and POST
export async function GET() {
  return fixNames();
}

export async function POST() {
  return fixNames();
}
