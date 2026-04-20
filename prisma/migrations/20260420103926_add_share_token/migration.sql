-- Add shareToken and shareEnabled to User table
ALTER TABLE `User` ADD COLUMN `shareToken` VARCHAR(191) NULL;
ALTER TABLE `User` ADD COLUMN `shareEnabled` BOOLEAN NOT NULL DEFAULT false;

-- Create unique index on shareToken
CREATE UNIQUE INDEX `User_shareToken_key` ON `User`(`shareToken`);
