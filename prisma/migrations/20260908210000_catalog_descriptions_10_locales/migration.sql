-- Catalog descriptions for the six locales that never had them.
--
-- MinifigCatalog and SetsCatalog carried description_en/de/fr/es only -- the
-- schema comment said "all 4 languages", written when the site had four. Six
-- locales were added later and nothing extended this, so it/ja/nl/pl/pt/sv
-- have been serving the ENGLISH meta description on every minifig and set
-- page since.
--
-- Additive and nullable, so this is safe to apply before the code that reads
-- it ships: already-running code ignores columns it does not know about.

ALTER TABLE `MinifigCatalog`
  ADD COLUMN `description_it` TEXT NULL,
  ADD COLUMN `description_ja` TEXT NULL,
  ADD COLUMN `description_nl` TEXT NULL,
  ADD COLUMN `description_pl` TEXT NULL,
  ADD COLUMN `description_pt` TEXT NULL,
  ADD COLUMN `description_sv` TEXT NULL;

ALTER TABLE `SetsCatalog`
  ADD COLUMN `description_it` TEXT NULL,
  ADD COLUMN `description_ja` TEXT NULL,
  ADD COLUMN `description_nl` TEXT NULL,
  ADD COLUMN `description_pl` TEXT NULL,
  ADD COLUMN `description_pt` TEXT NULL,
  ADD COLUMN `description_sv` TEXT NULL;
