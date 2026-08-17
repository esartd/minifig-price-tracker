-- Extend the previously-dormant ScanHistory table (existed with no callers)
-- to support the new AI photo minifig identifier premium feature: a
-- mixed/custom-figure flag plus user feedback on the AI's guess.
ALTER TABLE `ScanHistory` ADD COLUMN `isMixed` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `ScanHistory` ADD COLUMN `wasCorrect` BOOLEAN NULL;
ALTER TABLE `ScanHistory` ADD COLUMN `correctedItemNo` VARCHAR(191) NULL;
ALTER TABLE `ScanHistory` ADD COLUMN `partFeedback` JSON NULL;
ALTER TABLE `ScanHistory` ADD COLUMN `feedbackAt` DATETIME(3) NULL;
