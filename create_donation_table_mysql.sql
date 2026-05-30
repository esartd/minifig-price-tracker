-- Create Donation table for PayPal donation tracking (MySQL/Hostinger version)
-- Run this in Hostinger phpMyAdmin SQL tab

CREATE TABLE IF NOT EXISTS `Donation` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `paypalTxnId` VARCHAR(191) NOT NULL UNIQUE,
  `amount` DOUBLE NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
  `donorEmail` VARCHAR(191) NOT NULL,
  `donorName` VARCHAR(191) NULL,
  `displayName` VARCHAR(191) NULL,
  `showOnLeaderboard` BOOLEAN NOT NULL DEFAULT 0,
  `season` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'completed',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create indexes for performance
CREATE INDEX `Donation_season_idx` ON `Donation`(`season`);
CREATE INDEX `Donation_showOnLeaderboard_season_idx` ON `Donation`(`showOnLeaderboard`, `season`);

-- Verify table was created
SHOW TABLES LIKE 'Donation';
