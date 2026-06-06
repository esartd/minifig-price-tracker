-- CreateTable
CREATE TABLE `VisitorEvent` (
    `id` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `userAgent` TEXT NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `referer` TEXT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `metadata` TEXT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VisitorEvent_country_createdAt_idx`(`country`, `createdAt`),
    INDEX `VisitorEvent_ip_createdAt_idx`(`ip`, `createdAt`),
    INDEX `VisitorEvent_eventType_idx`(`eventType`),
    INDEX `VisitorEvent_path_idx`(`path`),
    INDEX `VisitorEvent_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
