-- CreateTable
CREATE TABLE `PriceAlert` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `item_no` VARCHAR(191) NOT NULL,
    `item_type` VARCHAR(191) NOT NULL,
    `item_name` VARCHAR(191) NOT NULL,
    `condition` VARCHAR(191) NOT NULL,
    `target_price` DOUBLE NOT NULL,
    `currency_code` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `triggered_at` DATETIME(3) NULL,
    `last_checked` DATETIME(3) NULL,

    INDEX `PriceAlert_active_last_checked_idx`(`active`, `last_checked`),
    INDEX `PriceAlert_userId_idx`(`userId`),
    INDEX `PriceAlert_item_no_item_type_idx`(`item_no`, `item_type`),
    UNIQUE INDEX `PriceAlert_userId_item_no_item_type_condition_key`(`userId`, `item_no`, `item_type`, `condition`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PriceAlert` ADD CONSTRAINT `PriceAlert_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
