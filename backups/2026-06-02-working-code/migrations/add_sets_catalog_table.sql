-- Migration: Add SetsCatalog table
-- Created: 2026-05-16
-- Purpose: Store LEGO set catalog data with SEO descriptions (mirrors MinifigCatalog structure)

CREATE TABLE IF NOT EXISTS `SetsCatalog` (
  `box_no` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `category_id` INTEGER NOT NULL,
  `category_name` VARCHAR(191) NOT NULL,
  `year_released` VARCHAR(191) NULL,
  `weight` VARCHAR(191) NULL,
  `search_name` VARCHAR(191) NOT NULL,
  `description_en` TEXT NULL,
  `description_de` TEXT NULL,
  `description_fr` TEXT NULL,
  `description_es` TEXT NULL,
  `description_generated_at` DATETIME(3) NULL,
  `description_status` VARCHAR(191) NULL DEFAULT 'pending',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`box_no`),
  INDEX `SetsCatalog_category_name_idx`(`category_name`),
  INDEX `SetsCatalog_search_name_idx`(`search_name`),
  INDEX `SetsCatalog_year_released_idx`(`year_released`),
  INDEX `SetsCatalog_description_status_idx`(`description_status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
