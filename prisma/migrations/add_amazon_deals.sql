-- CreateTable
CREATE TABLE IF NOT EXISTS `AmazonDeal` (
    `id` VARCHAR(191) NOT NULL,
    `boxNo` VARCHAR(191) NOT NULL,
    `asin` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `currentPrice` DOUBLE NOT NULL,
    `listPrice` DOUBLE NOT NULL,
    `discountPercent` INTEGER NOT NULL,
    `isPrime` BOOLEAN NOT NULL DEFAULT false,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `productUrl` TEXT NOT NULL,
    `imageUrl` TEXT NULL,
    `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AmazonDeal_boxNo_key`(`boxNo`),
    INDEX `AmazonDeal_discountPercent_idx`(`discountPercent`),
    INDEX `AmazonDeal_lastUpdated_idx`(`lastUpdated`),
    INDEX `AmazonDeal_boxNo_idx`(`boxNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
