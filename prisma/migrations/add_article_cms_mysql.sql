-- MySQL Migration: Add Article CMS
-- Run this on Hostinger MySQL production database

-- Create Article table
CREATE TABLE `Article` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `contentBlocks` LONGTEXT NOT NULL,
    `readTimeMinutes` INT NULL,
    `category` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `translations` TEXT NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Article_slug_key`(`slug`),
    INDEX `Article_slug_idx`(`slug`),
    INDEX `Article_status_idx`(`status`),
    INDEX `Article_featured_idx`(`featured`),
    INDEX `Article_publishedAt_idx`(`publishedAt`),
    INDEX `Article_category_idx`(`category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
