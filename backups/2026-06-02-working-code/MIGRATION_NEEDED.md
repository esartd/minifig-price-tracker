# MySQL Migration Required

## Action Needed
The following SQL needs to be run on the Hostinger MySQL production database:

```sql
ALTER TABLE `SetInventoryItem` ADD COLUMN `pricing_currency_code` VARCHAR(191) NULL;

ALTER TABLE `SetPersonalCollectionItem` ADD COLUMN `pricing_currency_code` VARCHAR(191) NULL;
```

## How to Apply
1. Log into Hostinger MySQL admin (phpMyAdmin or similar)
2. Select database: `u493602047_figtracker`
3. Run the SQL from: `prisma/manual-migrations/add_pricing_currency_code_to_sets_mysql.sql`

## Why This is Needed
The code now saves currency codes with pricing data to prevent unnecessary API calls. Without this migration, the build will succeed but the app will fail at runtime when trying to save pricing data.

## Status
- ✅ PostgreSQL (Supabase) migration applied
- ❌ MySQL (Hostinger) migration PENDING
- ✅ Schema files updated
- ✅ Code deployed

## After Migration
Delete this file once the migration is applied successfully.
