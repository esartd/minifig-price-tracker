-- Migration: Add pricing visibility toggles for each collection type
-- Run this on Hostinger MySQL database

ALTER TABLE `User`
ADD COLUMN `sharePricingInventory` BOOLEAN NOT NULL DEFAULT true AFTER `shareEnabledInventory`,
ADD COLUMN `sharePricingCollection` BOOLEAN NOT NULL DEFAULT false AFTER `shareEnabledCollection`,
ADD COLUMN `sharePricingSetsInventory` BOOLEAN NOT NULL DEFAULT true AFTER `shareEnabledSetsInventory`,
ADD COLUMN `sharePricingSetsCollection` BOOLEAN NOT NULL DEFAULT false AFTER `shareEnabledSetsCollection`;
