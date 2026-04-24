-- MySQL Migration: Add pricing_currency_code to set tables
-- Run this against the Hostinger MySQL database

ALTER TABLE `SetInventoryItem` ADD COLUMN `pricing_currency_code` VARCHAR(191) NULL;

ALTER TABLE `SetPersonalCollectionItem` ADD COLUMN `pricing_currency_code` VARCHAR(191) NULL;
