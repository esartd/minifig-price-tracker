-- Add columns for user-driven search caching (BrickLink API compliance)
ALTER TABLE "MinifigCache" ADD COLUMN "keywords" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "MinifigCache" ADD COLUMN "last_searched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add index for name-based search
CREATE INDEX "MinifigCache_name_idx" ON "MinifigCache"("name");

-- Update existing records to set last_searched_at to cached_at
UPDATE "MinifigCache" SET "last_searched_at" = "cached_at" WHERE "last_searched_at" = CURRENT_TIMESTAMP;
