-- Enable PostgreSQL unaccent extension for accent-insensitive search
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add unaccented search column
ALTER TABLE "MinifigCatalog"
ADD COLUMN IF NOT EXISTS search_name_unaccent TEXT;

-- Populate with unaccented values
UPDATE "MinifigCatalog"
SET search_name_unaccent = unaccent(search_name)
WHERE search_name_unaccent IS NULL;

-- Add GIN trigram index for fast similarity queries
CREATE INDEX IF NOT EXISTS "MinifigCatalog_search_name_unaccent_gin_trgm"
ON "MinifigCatalog" USING gin (search_name_unaccent gin_trgm_ops);
