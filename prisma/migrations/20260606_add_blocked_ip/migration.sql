-- CreateTable for BlockedIP
CREATE TABLE `BlockedIP` (
    `id` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `reason` TEXT NOT NULL,
    `firstSeen` DATETIME(3) NOT NULL,
    `lastSeen` DATETIME(3) NOT NULL,
    `totalRequests` INTEGER NOT NULL,
    `blockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `BlockedIP_ip_key`(`ip`),
    INDEX `BlockedIP_ip_active_idx`(`ip`, `active`),
    INDEX `BlockedIP_active_expiresAt_idx`(`active`, `expiresAt`),
    INDEX `BlockedIP_country_idx`(`country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
