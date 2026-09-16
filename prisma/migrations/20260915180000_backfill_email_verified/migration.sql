-- Grandfather every account that existed before verification was introduced.
--
-- `emailVerified` has been on the User model since the beginning and nothing
-- ever wrote to it: all 66 rows read NULL. Verification is now enforced for new
-- signups, and unverified accounts lose access to the two features that send
-- mail (price alerts, deals digest).
--
-- Without this backfill that rule applies retroactively to people who joined
-- before it existed -- including the account with 574 items -- and takes away
-- features they are already using. That is hostile for no gain: the point of
-- verification is to stop mail going to addresses nobody confirmed, and these
-- addresses have been receiving mail successfully for months.
--
-- Backdated to createdAt rather than NOW() so the column keeps meaning roughly
-- "when this address was confirmed" instead of "when we ran this migration".
--
-- Data-only; no schema change. Safe to apply before the code that reads it,
-- and it must be, or existing users are locked out of alerts between the
-- migration and the deploy.
UPDATE `User`
SET `emailVerified` = COALESCE(`createdAt`, NOW(3))
WHERE `emailVerified` IS NULL;
