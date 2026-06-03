import { NextRequest, NextResponse } from 'next/server';
import { prismaHostinger } from '@/lib/prisma-hostinger';

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get columns from SetInventoryItem table
    const columns = await prismaHostinger.$queryRawUnsafe(`
      DESCRIBE SetInventoryItem
    `) as any[];

    return NextResponse.json({
      success: true,
      columns: columns.map((col: any) => ({
        field: col.Field,
        type: col.Type,
        null: col.Null,
        default: col.Default
      }))
    });
  } catch (error: any) {
    console.error('Schema check error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
