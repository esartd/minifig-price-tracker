-- Add username and profilePublic fields to User model
ALTER TABLE `User` ADD COLUMN `username` VARCHAR(30) NULL;
ALTER TABLE `User` ADD COLUMN `profilePublic` BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
CREATE INDEX `User_username_idx` ON `User`(`username`);
CREATE INDEX `User_profilePublic_idx` ON `User`(`profilePublic`);
