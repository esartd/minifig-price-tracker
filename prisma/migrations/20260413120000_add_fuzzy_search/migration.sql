-- Enable PostgreSQL trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN index on search_name for fast similarity queries
CREATE INDEX IF NOT EXISTS "MinifigCatalog_search_name_gin_trgm" ON "MinifigCatalog" USING gin (search_name gin_trgm_ops);
