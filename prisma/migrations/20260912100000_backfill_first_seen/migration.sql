-- Age the rows that existed when firstSeenAt was added.
--
-- Correcting a mistake in 20260912090000_deals_digest. That migration's comment
-- claimed a CURRENT_TIMESTAMP default would mean "nothing looks new on the
-- first run". The opposite is true: MySQL backfills every existing row with the
-- ALTER's timestamp, so all 3,568 rows -- and all 77 that qualify as deals --
-- looked brand new. The first digest would have announced the whole list as
-- new deals, which is both false and exactly the first impression that gets a
-- new email unsubscribed.
--
-- Nothing is genuinely new here: these rows predate the column. Dating them
-- back 30 days says "we do not know when these first appeared, and they are not
-- new", which is the truth. The next sync inserts genuinely new rows with
-- NOW(3) and they will read as new correctly.
--
-- Safe to run once: no sync has happened between the two migrations, so every
-- row still carries the ALTER timestamp. The WHERE clause keeps it idempotent
-- in case that stops being true.

UPDATE `WalmartDeal`
SET `firstSeenAt` = DATE_SUB(NOW(), INTERVAL 30 DAY)
WHERE `firstSeenAt` > DATE_SUB(NOW(), INTERVAL 2 DAY);
