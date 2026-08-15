-- Add subscription-cancellation flag for premium billing UI messaging
ALTER TABLE `User` ADD COLUMN `subscriptionCancelAtPeriodEnd` BOOLEAN NOT NULL DEFAULT false;

-- stripeCustomerId/stripeSubscriptionId already exist from a prior `db push`
-- (all currently NULL, confirmed no duplicates); this migration adds the
-- uniqueness/index constraints that were missing.
CREATE UNIQUE INDEX `User_stripeCustomerId_key` ON `User`(`stripeCustomerId`);
CREATE UNIQUE INDEX `User_stripeSubscriptionId_key` ON `User`(`stripeSubscriptionId`);
CREATE INDEX `User_subscriptionStatus_idx` ON `User`(`subscriptionStatus`);
