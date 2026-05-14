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

    console.log('Starting sets schema migration...');

    // Run the migration SQL commands one by one
    const migrations = [
      // Rename SetCollectionItem to SetInventoryItem
      'ALTER TABLE `SetCollectionItem` RENAME TO `SetInventoryItem`',

      // Add category_name to SetInventoryItem
      'ALTER TABLE `SetInventoryItem` ADD COLUMN `category_name` VARCHAR(191) NULL AFTER `set_name`',

      // Rename set_no to box_no in SetInventoryItem
      'ALTER TABLE `SetInventoryItem` CHANGE COLUMN `set_no` `box_no` VARCHAR(191) NOT NULL',

      // Remove pricing_currency_code from SetInventoryItem
      'ALTER TABLE `SetInventoryItem` DROP COLUMN `pricing_currency_code`',

      // Update unique constraint for SetInventoryItem
      'ALTER TABLE `SetInventoryItem` DROP INDEX `SetInventoryItem_userId_set_no_condition_key`',
      'ALTER TABLE `SetInventoryItem` ADD UNIQUE INDEX `SetInventoryItem_userId_box_no_condition_key` (`userId`, `box_no`, `condition`)',

      // Update indexes for SetInventoryItem
      'ALTER TABLE `SetInventoryItem` DROP INDEX `SetInventoryItem_set_no_idx`',
      'ALTER TABLE `SetInventoryItem` ADD INDEX `SetInventoryItem_box_no_idx` (`box_no`)',
      'ALTER TABLE `SetInventoryItem` ADD INDEX `SetInventoryItem_category_name_idx` (`category_name`)',

      // Add category_name to SetPersonalCollectionItem
      'ALTER TABLE `SetPersonalCollectionItem` ADD COLUMN `category_name` VARCHAR(191) NULL AFTER `set_name`',

      // Rename set_no to box_no in SetPersonalCollectionItem
      'ALTER TABLE `SetPersonalCollectionItem` CHANGE COLUMN `set_no` `box_no` VARCHAR(191) NOT NULL',

      // Remove pricing_currency_code from SetPersonalCollectionItem
      'ALTER TABLE `SetPersonalCollectionItem` DROP COLUMN `pricing_currency_code`',

      // Update unique constraint for SetPersonalCollectionItem
      'ALTER TABLE `SetPersonalCollectionItem` DROP INDEX `SetPersonalCollectionItem_userId_set_no_condition_key`',
      'ALTER TABLE `SetPersonalCollectionItem` ADD UNIQUE INDEX `SetPersonalCollectionItem_userId_box_no_condition_key` (`userId`, `box_no`, `condition`)',

      // Add index for SetPersonalCollectionItem
      'ALTER TABLE `SetPersonalCollectionItem` ADD INDEX `SetPersonalCollectionItem_category_name_idx` (`category_name`)',

      // Update PriceCache
      'ALTER TABLE `PriceCache` CHANGE COLUMN `minifigure_no` `item_no` VARCHAR(191) NOT NULL',
      'ALTER TABLE `PriceCache` ADD COLUMN `item_type` VARCHAR(191) NOT NULL DEFAULT "MINIFIG" AFTER `item_no`',

      // Update PriceCache unique constraint
      'ALTER TABLE `PriceCache` DROP INDEX `PriceCache_minifigure_no_condition_country_code_region_key`',
      'ALTER TABLE `PriceCache` ADD UNIQUE INDEX `PriceCache_item_no_item_type_condition_country_code_region_key` (`item_no`, `item_type`, `condition`, `country_code`, `region`)',

      // Update PriceCache indexes
      'ALTER TABLE `PriceCache` DROP INDEX `PriceCache_minifigure_no_idx`',
      'ALTER TABLE `PriceCache` ADD INDEX `PriceCache_item_no_item_type_idx` (`item_no`, `item_type`)',

      // Drop old tables
      'DROP TABLE IF EXISTS `SetPriceCache`',
      'DROP TABLE IF EXISTS `SetPriceHistory`'
    ];

    const results = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < migrations.length; i++) {
      const sql = migrations[i];
      try {
        console.log(`[${i + 1}/${migrations.length}] Executing: ${sql.substring(0, 100)}...`);
        await prisma.$executeRawUnsafe(sql);
        results.push({ sql, status: 'success' });
        successful++;
      } catch (error: any) {
        console.error(`Failed to execute: ${sql}`, error);
        // Some errors are acceptable (e.g., table already renamed, column already exists)
        if (error.code === 'ER_BAD_TABLE_ERROR' ||
            error.code === 'ER_CANT_DROP_FIELD_OR_KEY' ||
            error.code === 'ER_DUP_FIELDNAME') {
          console.log('Acceptable error (already migrated), continuing...');
          results.push({ sql, status: 'skipped', error: error.message });
        } else {
          results.push({ sql, status: 'error', error: error.message });
          failed++;
        }
      }
    }

    console.log(`Migration complete: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      success: failed === 0,
      message: `Migration complete: ${successful} successful, ${failed} failed`,
      results
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}
