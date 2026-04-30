-- Add private share token columns for separate public/private links
-- Public links show pricing, private links hide pricing

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareTokenInventoryPrivate" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareEnabledInventoryPrivate" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareTokenCollectionPrivate" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareEnabledCollectionPrivate" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareTokenSetsInventoryPrivate" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareEnabledSetsInventoryPrivate" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareTokenSetsCollectionPrivate" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shareEnabledSetsCollectionPrivate" BOOLEAN NOT NULL DEFAULT false;
