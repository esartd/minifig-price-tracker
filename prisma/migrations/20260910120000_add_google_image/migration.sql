-- Keep the Google profile picture URL where choosing a LEGO avatar cannot
-- destroy it.
--
-- `User.image` holds whichever avatar is currently shown, and it has always
-- held two different kinds of thing: a Google photo URL for OAuth users, or a
-- LEGO avatar id like "ninja-purple" for everyone else. One column, two
-- meanings, and no second copy anywhere.
--
-- The consequence was a one-way door. A user who signed in with Google and
-- then picked a LEGO avatar had their photo URL overwritten in the only place
-- it was stored, with no way back short of unlinking and re-linking the
-- account. This column is that second copy, so the choice becomes reversible.
--
-- Additive and nullable, so it is safe to apply before the code that reads it
-- ships: running code simply ignores a column it does not know about.
-- Backfilled below from the rows where `image` is already a Google URL, which
-- is every Google user who has not yet switched away -- the ones who already
-- switched are unrecoverable and will repopulate on their next sign-in.
--
-- TEXT rather than VARCHAR(191): Google's lh3.googleusercontent.com URLs carry
-- a signature and sizing parameters and run well past 191 characters, which is
-- Prisma's default String length on MySQL. A truncated URL is a broken image.

ALTER TABLE `User` ADD COLUMN `googleImage` TEXT NULL;

UPDATE `User`
SET `googleImage` = `image`
WHERE `image` LIKE 'https://lh3.googleusercontent.com/%'
   OR `image` LIKE 'https://lh4.googleusercontent.com/%'
   OR `image` LIKE 'https://lh5.googleusercontent.com/%'
   OR `image` LIKE 'https://lh6.googleusercontent.com/%';
