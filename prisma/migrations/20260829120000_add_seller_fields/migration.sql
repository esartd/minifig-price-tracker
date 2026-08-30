-- Seller fields needed by the marketplace bulk export.
--
-- `completeness` (sets only): BrickLink's mass upload requires SUBCONDITION on
--   every set — Complete / Incomplete / Sealed. FigTracker only recorded
--   new/used, so there was nothing to map from. NULL means "not recorded yet"
--   and is flagged in the export preview rather than guessed at.
--
-- `cost`: what the user paid. Whatnot's "Cost Per Item" column and BrickLink's
--   MYCOST were both exporting permanently blank because no such field existed.
--
-- `notes` on the two for-sale models: these already existed on the two
--   to-keep models, and the export reads item.notes for every source — so the
--   seller-notes line silently did nothing on exactly the collections a user
--   sells from.
--
-- All additive and nullable: no backfill, no rewrite, safe on a live table.

ALTER TABLE `CollectionItem` ADD COLUMN `cost` DOUBLE NULL;
ALTER TABLE `CollectionItem` ADD COLUMN `notes` VARCHAR(191) NULL;

ALTER TABLE `SetInventoryItem` ADD COLUMN `completeness` VARCHAR(191) NULL;
ALTER TABLE `SetInventoryItem` ADD COLUMN `cost` DOUBLE NULL;
ALTER TABLE `SetInventoryItem` ADD COLUMN `notes` VARCHAR(191) NULL;

ALTER TABLE `PersonalCollectionItem` ADD COLUMN `cost` DOUBLE NULL;

ALTER TABLE `SetPersonalCollectionItem` ADD COLUMN `completeness` VARCHAR(191) NULL;
ALTER TABLE `SetPersonalCollectionItem` ADD COLUMN `cost` DOUBLE NULL;
