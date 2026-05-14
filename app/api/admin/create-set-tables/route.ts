import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Creating set tables...');

    const createTables = [
      `CREATE TABLE IF NOT EXISTS \`SetInventoryItem\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`box_no\` VARCHAR(191) NOT NULL,
        \`set_name\` VARCHAR(191) NOT NULL,
        \`category_name\` VARCHAR(191) NULL,
        \`quantity\` INT NOT NULL,
        \`condition\` VARCHAR(191) NOT NULL,
        \`image_url\` VARCHAR(191) NULL,
        \`pricing_six_month_avg\` DOUBLE NULL,
        \`pricing_current_avg\` DOUBLE NULL,
        \`pricing_current_lowest\` DOUBLE NULL,
        \`pricing_suggested_price\` DOUBLE NULL,
        \`userId\` VARCHAR(191) NOT NULL,
        \`date_added\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`last_updated\` DATETIME(3) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`SetInventoryItem_userId_box_no_condition_key\` (\`userId\`, \`box_no\`, \`condition\`),
        INDEX \`SetInventoryItem_box_no_idx\` (\`box_no\`),
        INDEX \`SetInventoryItem_userId_idx\` (\`userId\`),
        INDEX \`SetInventoryItem_userId_condition_idx\` (\`userId\`, \`condition\`),
        INDEX \`SetInventoryItem_category_name_idx\` (\`category_name\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS \`SetPersonalCollectionItem\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`userId\` VARCHAR(191) NOT NULL,
        \`box_no\` VARCHAR(191) NOT NULL,
        \`set_name\` VARCHAR(191) NOT NULL,
        \`category_name\` VARCHAR(191) NULL,
        \`quantity\` INT NOT NULL DEFAULT 1,
        \`condition\` VARCHAR(191) NOT NULL DEFAULT 'new',
        \`image_url\` VARCHAR(191) NULL,
        \`pricing_six_month_avg\` DOUBLE NULL,
        \`pricing_current_avg\` DOUBLE NULL,
        \`pricing_current_lowest\` DOUBLE NULL,
        \`pricing_suggested_price\` DOUBLE NULL,
        \`notes\` TEXT NULL,
        \`acquisition_date\` DATETIME(3) NULL,
        \`acquisition_notes\` TEXT NULL,
        \`display_location\` VARCHAR(191) NULL,
        \`date_added\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`last_updated\` DATETIME(3) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`SetPersonalCollectionItem_userId_box_no_condition_key\` (\`userId\`, \`box_no\`, \`condition\`),
        INDEX \`SetPersonalCollectionItem_userId_idx\` (\`userId\`),
        INDEX \`SetPersonalCollectionItem_userId_condition_idx\` (\`userId\`, \`condition\`),
        INDEX \`SetPersonalCollectionItem_category_name_idx\` (\`category_name\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,

      `ALTER TABLE \`SetInventoryItem\` ADD CONSTRAINT \`SetInventoryItem_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,

      `ALTER TABLE \`SetPersonalCollectionItem\` ADD CONSTRAINT \`SetPersonalCollectionItem_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    ];

    const results = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < createTables.length; i++) {
      const sql = createTables[i];
      try {
        console.log(`[${i + 1}/${createTables.length}] Executing SQL...`);
        await prisma.$executeRawUnsafe(sql);
        results.push({ index: i + 1, status: 'success' });
        successful++;
      } catch (error: any) {
        console.error(`Failed to execute SQL ${i + 1}:`, error);
        // Foreign key constraint errors are acceptable if already exists
        if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_FK_DUP_NAME') {
          console.log('Acceptable error (constraint already exists), continuing...');
          results.push({ index: i + 1, status: 'skipped', error: error.message });
        } else {
          results.push({ index: i + 1, status: 'error', error: error.message });
          failed++;
        }
      }
    }

    console.log(`Table creation complete: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      success: failed === 0,
      message: `Table creation complete: ${successful} successful, ${failed} failed`,
      results
    });
  } catch (error: any) {
    console.error('Table creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Table creation failed' },
      { status: 500 }
    );
  }
}
