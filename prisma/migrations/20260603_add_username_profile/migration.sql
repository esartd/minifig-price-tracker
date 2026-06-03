-- Add username and profileEnabled fields to User table
-- SAFE: Both fields are optional/defaulted, won't affect existing users

-- Add username field (optional, unique)
ALTER TABLE `User` ADD COLUMN `username` VARCHAR(191) NULL UNIQUE;

-- Add profileEnabled field (default false - opt-in only)
ALTER TABLE `User` ADD COLUMN `profileEnabled` BOOLEAN NOT NULL DEFAULT false;

-- Add index for performance
CREATE INDEX `User_username_idx` ON `User`(`username`);
