-- Rank deals against OUR suggested price, not Walmart's claimed discount.
--
-- Walmart's discount is computed from OriginalPrice, which the seller sets. On
-- retired sets they list at a multiple of value, call it "60% off", and the
-- badge is still a lie. Of 281 discounted rows measured before this change,
-- 199 (71%) were priced above our own suggested price.
--
-- Both columns are nullable: we do not have a price for every set, and a row
-- without one should be absent from the page rather than assumed good.

ALTER TABLE `WalmartDeal`
  ADD COLUMN `ourPrice` DOUBLE NULL,
  ADD COLUMN `pctBelowOurPrice` INT NULL;

CREATE INDEX `WalmartDeal_inStock_pctBelowOurPrice_idx`
  ON `WalmartDeal`(`inStock`, `pctBelowOurPrice`);
