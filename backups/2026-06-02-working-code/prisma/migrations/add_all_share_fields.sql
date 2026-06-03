-- Complete migration: Add all share collection fields
-- Run this on Hostinger MySQL database

-- Check if columns already exist before adding them
-- Run each ALTER TABLE separately to avoid errors if some columns already exist

-- Add share token and enabled fields for each collection type
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `shareTokenInventory` VARCHAR(191) UNIQUE DEFAULT NULL;
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `shareEnabledInventory` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `sharePricingInventory` BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `shareTokenCollection` VARCHAR(191) UNIQUE DEFAULT NULL;
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `shareEnabledCollection` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `sharePricingCollection` BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `shareTokenSetsInventory` VARCHAR(191) UNIQUE DEFAULT NULL;
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `shareEnabledSetsInventory` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `sharePricingSetsInventory` BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `shareTokenSetsCollection` VARCHAR(191) UNIQUE DEFAULT NULL;
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `shareEnabledSetsCollection` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `User` ADD COLUMN IF NOT EXISTS `sharePricingSetsCollection` BOOLEAN NOT NULL DEFAULT false;
