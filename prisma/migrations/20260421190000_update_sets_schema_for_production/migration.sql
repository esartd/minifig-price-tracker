-- Rename SetCollectionItem to SetInventoryItem
ALTER TABLE `SetCollectionItem` RENAME TO `SetInventoryItem`;

-- Add missing category_name field to SetInventoryItem
ALTER TABLE `SetInventoryItem` ADD COLUMN `category_name` VARCHAR(191) NULL AFTER `set_name`;

-- Rename set_no to box_no in SetInventoryItem
ALTER TABLE `SetInventoryItem` CHANGE COLUMN `set_no` `box_no` VARCHAR(191) NOT NULL;

-- Remove pricing_currency_code from SetInventoryItem (not in main schema)
ALTER TABLE `SetInventoryItem` DROP COLUMN `pricing_currency_code`;

-- Update unique constraint and indexes for SetInventoryItem
ALTER TABLE `SetInventoryItem` DROP INDEX `SetInventoryItem_userId_set_no_condition_key`;
ALTER TABLE `SetInventoryItem` ADD UNIQUE INDEX `SetInventoryItem_userId_box_no_condition_key` (`userId`, `box_no`, `condition`);

ALTER TABLE `SetInventoryItem` DROP INDEX `SetInventoryItem_set_no_idx`;
ALTER TABLE `SetInventoryItem` ADD INDEX `SetInventoryItem_box_no_idx` (`box_no`);

ALTER TABLE `SetInventoryItem` ADD INDEX `SetInventoryItem_category_name_idx` (`category_name`);

-- Add missing category_name field to SetPersonalCollectionItem
ALTER TABLE `SetPersonalCollectionItem` ADD COLUMN `category_name` VARCHAR(191) NULL AFTER `set_name`;

-- Rename set_no to box_no in SetPersonalCollectionItem
ALTER TABLE `SetPersonalCollectionItem` CHANGE COLUMN `set_no` `box_no` VARCHAR(191) NOT NULL;

-- Remove pricing_currency_code from SetPersonalCollectionItem
ALTER TABLE `SetPersonalCollectionItem` DROP COLUMN `pricing_currency_code`;

-- Update unique constraint and indexes for SetPersonalCollectionItem
ALTER TABLE `SetPersonalCollectionItem` DROP INDEX `SetPersonalCollectionItem_userId_set_no_condition_key`;
ALTER TABLE `SetPersonalCollectionItem` ADD UNIQUE INDEX `SetPersonalCollectionItem_userId_box_no_condition_key` (`userId`, `box_no`, `condition`);

ALTER TABLE `SetPersonalCollectionItem` ADD INDEX `SetPersonalCollectionItem_category_name_idx` (`category_name`);

-- Update PriceCache: rename minifigure_no to item_no and add item_type
ALTER TABLE `PriceCache` CHANGE COLUMN `minifigure_no` `item_no` VARCHAR(191) NOT NULL;
ALTER TABLE `PriceCache` ADD COLUMN `item_type` VARCHAR(191) NOT NULL DEFAULT 'MINIFIG' AFTER `item_no`;

-- Update PriceCache unique constraint and indexes
ALTER TABLE `PriceCache` DROP INDEX `PriceCache_minifigure_no_condition_country_code_region_key`;
ALTER TABLE `PriceCache` ADD UNIQUE INDEX `PriceCache_item_no_item_type_condition_country_code_region_key` (`item_no`, `item_type`, `condition`, `country_code`, `region`);

ALTER TABLE `PriceCache` DROP INDEX `PriceCache_minifigure_no_idx`;
ALTER TABLE `PriceCache` ADD INDEX `PriceCache_item_no_item_type_idx` (`item_no`, `item_type`);

-- Drop SetPriceCache table if it exists (using unified PriceCache now)
DROP TABLE IF EXISTS `SetPriceCache`;

-- Drop SetPriceHistory table if it exists
DROP TABLE IF EXISTS `SetPriceHistory`;
