-- Two kinds of price alert.
--
-- "market"  = our own blended suggested price. Free, and what every alert
--             meant before this migration -- hence the default, which leaves
--             existing rows saying exactly what they already said.
-- "walmart" = the current Walmart shelf price. Premium, sets only.
--
-- The unique key gains `source` so one user can hold both kinds on the same
-- set at once. Dropping and recreating a unique index is the risky half of
-- this migration; PriceAlert held 0 rows when it was written, so there is
-- nothing to collide.

ALTER TABLE `PriceAlert`
  ADD COLUMN `source` VARCHAR(191) NOT NULL DEFAULT 'market';

DROP INDEX `PriceAlert_userId_item_no_item_type_condition_key` ON `PriceAlert`;

CREATE UNIQUE INDEX `PriceAlert_userId_item_no_item_type_condition_source_key`
  ON `PriceAlert`(`userId`, `item_no`, `item_type`, `condition`, `source`);
