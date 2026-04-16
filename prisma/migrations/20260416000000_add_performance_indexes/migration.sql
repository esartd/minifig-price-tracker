-- Performance indexes for FigTracker
-- CreateIndex for minifig catalog searches by category (theme pages)
CREATE INDEX IF NOT EXISTS "idx_minifig_catalog_category" ON "MinifigCatalog"("category_name");

-- CreateIndex for minifig catalog searches by year (current themes)
CREATE INDEX IF NOT EXISTS "idx_minifig_catalog_year" ON "MinifigCatalog"("year_released");

-- CreateIndex for combined theme + year queries
CREATE INDEX IF NOT EXISTS "idx_minifig_catalog_category_year" ON "MinifigCatalog"("category_name", "year_released");

-- CreateIndex for inventory lookups by user
CREATE INDEX IF NOT EXISTS "idx_inventory_user" ON "Inventory"("user_id");

-- CreateIndex for personal collection lookups by user
CREATE INDEX IF NOT EXISTS "idx_personal_collection_user" ON "PersonalCollection"("user_id");

-- CreateIndex for minifig cache expiration cleanup
CREATE INDEX IF NOT EXISTS "idx_minifig_cache_expires" ON "MinifigCache"("expires_at");

-- CreateIndex for minifig cache lookups
CREATE INDEX IF NOT EXISTS "idx_minifig_cache_no" ON "MinifigCache"("minifigure_no");

-- CreateIndex for price history lookups
CREATE INDEX IF NOT EXISTS "idx_price_history_item" ON "PriceHistory"("minifigure_no", "recorded_at");
