-- When the user last chose their own display currency.
--
-- preferredCurrency defaults to 'USD', which makes "I chose dollars" and "I
-- have never been asked" the same stored value. That is why signed-in readers
-- outside the US were quoted dollars forever: the default outranked their
-- location, and nothing could tell the two apart.
--
-- NULL means never chosen, so the display falls back to where they are.
-- Additive and nullable, so code already running ignores it.
ALTER TABLE `User` ADD COLUMN `currencyChosenAt` DATETIME(3) NULL;

-- Anyone who is not on the default pair must have chosen it themselves:
-- update-preferences is the only writer, and it always sets all three.
-- Stamped so their choice keeps winning.
UPDATE `User`
SET `currencyChosenAt` = COALESCE(`updatedAt`, NOW(3))
WHERE `preferredCurrency` IS NOT NULL
  AND `preferredCurrency` <> 'USD';
