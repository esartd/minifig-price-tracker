-- Announcement email: per-user opt-out plus a token for one-click unsubscribe.
--
-- `emailSubscribed` defaults to true. These users already receive
-- transactional mail from us, and the first announcement is the rename notice
-- they actually need — starting everyone at false would mean nobody gets it.
--
-- `unsubscribeToken` is nullable and filled in lazily the first time a user is
-- emailed. It exists because someone clicking "unsubscribe" in an email is not
-- signed in: requiring a login to leave a mailing list is what turns an
-- unsubscribe into a spam complaint, which costs the sending domain far more.
--
-- Both additive and nullable/defaulted: safe to apply to the live table before
-- the code that reads them ships. Running code ignores columns it does not
-- know about.

ALTER TABLE `User` ADD COLUMN `emailSubscribed` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `User` ADD COLUMN `unsubscribeToken` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `User_unsubscribeToken_key` ON `User`(`unsubscribeToken`);
