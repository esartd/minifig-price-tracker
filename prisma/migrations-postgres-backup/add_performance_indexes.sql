-- Performance indexes for FigTracker
-- Run this manually or via prisma migrate

-- Minifig catalog searches by category (theme pages)
CREATE INDEX IF NOT EXISTS idx_minifig_catalog_category ON minifig_catalog(category_name);

-- Minifig catalog searches by year (current themes)
CREATE INDEX IF NOT EXISTS idx_minifig_catalog_year ON minifig_catalog(year_released);

-- Combined index for theme + year queries
CREATE INDEX IF NOT EXISTS idx_minifig_catalog_category_year ON minifig_catalog(category_name, year_released);

-- Inventory lookups by user
CREATE INDEX IF NOT EXISTS idx_inventory_user ON inventory(user_id);

-- Personal collection lookups by user
CREATE INDEX IF NOT EXISTS idx_personal_collection_user ON personal_collection(user_id);

-- Minifig cache expiration cleanup
CREATE INDEX IF NOT EXISTS idx_minifig_cache_expires ON minifig_cache(expires_at);

-- Minifig cache lookups
CREATE INDEX IF NOT EXISTS idx_minifig_cache_no ON minifig_cache(no);

-- Price history lookups
CREATE INDEX IF NOT EXISTS idx_price_history_item ON price_history(minifigure_no, recorded_at);
