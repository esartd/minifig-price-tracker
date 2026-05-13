-- Add PriceFetchFailure table for tracking API failures
CREATE TABLE IF NOT EXISTS `PriceFetchFailure` (
  `id` VARCHAR(191) NOT NULL,
  `item_no` VARCHAR(191) NOT NULL,
  `item_type` VARCHAR(191) NOT NULL DEFAULT 'MINIFIG',
  `condition` VARCHAR(191) NOT NULL,
  `country_code` VARCHAR(191) NOT NULL,
  `error_message` TEXT NOT NULL,
  `error_type` VARCHAR(191) NOT NULL,
  `attempt_count` INTEGER NOT NULL DEFAULT 1,
  `last_attempt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `first_failed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `resolved` BOOLEAN NOT NULL DEFAULT false,
  `resolved_at` DATETIME(3) NULL,

  UNIQUE INDEX `PriceFetchFailure_item_no_item_type_condition_country_code_key`(`item_no`, `item_type`, `condition`, `country_code`),
  INDEX `PriceFetchFailure_item_no_idx`(`item_no`),
  INDEX `PriceFetchFailure_last_attempt_idx`(`last_attempt`),
  INDEX `PriceFetchFailure_resolved_idx`(`resolved`),
  INDEX `PriceFetchFailure_error_type_idx`(`error_type`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
