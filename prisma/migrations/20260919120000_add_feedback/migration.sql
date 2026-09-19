-- Feedback from the site-wide widget: bug reports, feature requests, anything
-- else. Hand-written rather than generated because DATABASE_URL points at the
-- production database and `prisma migrate dev` would run against it.
--
-- Entirely additive, so it is safe to apply before the code that reads it.

-- CreateTable
CREATE TABLE `Feedback` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `email` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `pageUrl` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `locale` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `clusterId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `readAt` DATETIME(3) NULL,

    INDEX `Feedback_status_idx`(`status`),
    INDEX `Feedback_createdAt_idx`(`createdAt`),
    INDEX `Feedback_clusterId_idx`(`clusterId`),
    INDEX `Feedback_readAt_idx`(`readAt`),
    INDEX `Feedback_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
-- SET NULL, not CASCADE: a bug report should outlive the account that filed it.
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
