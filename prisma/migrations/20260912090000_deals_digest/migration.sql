-- Daily Walmart deals digest (Premium).
--
-- `dealsDigest` is opt-IN and defaults false: nobody is enrolled without
-- asking, and it is deliberately separate from `emailSubscribed` so that
-- leaving one does not silently stop the other.
--
-- `previousPrice` and `firstSeenAt` exist so the digest can report what
-- CHANGED. Sending the same list of deals every morning is how a daily email
-- teaches people to ignore it, and then to unsubscribe.
--
-- firstSeenAt defaults to now() for existing rows, which means nothing looks
-- "new" on the first run after this migration. That is the correct direction
-- to be wrong: a quiet first digest beats mailing everyone the whole catalogue.

ALTER TABLE `User`
  ADD COLUMN `dealsDigest` BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE `WalmartDeal`
  ADD COLUMN `previousPrice` DOUBLE NULL,
  ADD COLUMN `firstSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
