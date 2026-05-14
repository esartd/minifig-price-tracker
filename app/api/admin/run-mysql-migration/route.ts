import { NextRequest, NextResponse } from 'next/server';
import { prismaHostinger } from '@/lib/prisma-hostinger';

const hostingerPrisma = prismaHostinger;

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();

    // Require admin secret
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Run the migration SQL
    await hostingerPrisma.$executeRawUnsafe(`
      ALTER TABLE SetInventoryItem ADD COLUMN pricing_currency_code VARCHAR(191) NULL
    `);

    await hostingerPrisma.$executeRawUnsafe(`
      ALTER TABLE SetPersonalCollectionItem ADD COLUMN pricing_currency_code VARCHAR(191) NULL
    `);

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully'
    });
  } catch (error: any) {
    console.error('Migration error:', error);

    // Check if column already exists
    if (error.message?.includes('Duplicate column name')) {
      return NextResponse.json({
        success: true,
        message: 'Columns already exist, migration not needed'
      });
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
