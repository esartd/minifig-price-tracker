-- Add SEO description fields to MinifigCatalog table
-- Migration: add_minifig_descriptions
-- Date: 2026-05-08

ALTER TABLE `MinifigCatalog`
  ADD COLUMN `description_en` TEXT NULL AFTER `search_name`,
  ADD COLUMN `description_de` TEXT NULL AFTER `description_en`,
  ADD COLUMN `description_fr` TEXT NULL AFTER `description_de`,
  ADD COLUMN `description_es` TEXT NULL AFTER `description_fr`,
  ADD COLUMN `description_generated_at` DATETIME NULL AFTER `description_es`,
  ADD COLUMN `description_status` VARCHAR(20) DEFAULT 'pending' AFTER `description_generated_at`,
  ADD INDEX `MinifigCatalog_description_status_idx` (`description_status`);
