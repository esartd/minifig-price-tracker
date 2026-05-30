# Database Protection & Safeguards

## What Happened (April 17, 2026)

A catastrophic data loss incident occurred when schema changes were pushed directly to the production database using `npx prisma db push --accept-data-loss`. This wiped all user data including:
- All users (8)
- All collection items (17)
- All personal collection items (290)
- Entire catalog (18,732 minifigs)

**Data was successfully restored** from Neon's point-in-time backup (restored to 5:30 PM, before the incident).

## Protections Now in Place

### 1. Database Safeguards (`/lib/database-safeguards.ts`)

**Automatic Protections Active in Production:**

- ✅ **Blocks `deleteMany` operations entirely** - Cannot bulk delete in production
- ✅ **Requires `where` clause on all deletes** - No accidental delete-all
- ✅ **Verifies production database has data** - Prevents operations on empty databases
- ✅ **Audit logging** - All database mutations are logged with timestamps
- ✅ **Safety snapshots** - Can verify no data loss after risky operations
- ✅ **Emergency read-only mode** - Can instantly block ALL writes if needed

**Initialized automatically on app startup** via `/lib/startup-checks.ts`

### 2. Catalog Updates Are Safe

The monthly catalog update cron job (`/app/api/cron/update-catalog/route.ts`) uses **`upsert`** which:
- ✅ Creates new entries if they don't exist
- ✅ Updates existing entries with new data
- ✅ **NEVER deletes anything**

Your catalog can be refreshed monthly without any risk to existing data.

### 3. What These Safeguards Prevent

❌ **Blocked Operations:**
- `prisma.user.deleteMany()` - Cannot bulk delete users
- `prisma.collectionItem.delete()` (without where) - Must specify which item
- Running migrations with `--accept-data-loss` in production
- Operations on empty production databases

✅ **Allowed Operations:**
- Individual deletes with specific where clauses
- Upserts (create or update)
- Updates with where clauses
- All read operations
- Catalog imports/updates

## Best Practices Going Forward

### Rule #1: NEVER Touch Production Database Directly

- ❌ Never run `npx prisma db push` in production
- ❌ Never use `--accept-data-loss` flag
- ❌ Never run migrations without testing locally first
- ✅ Always use Neon console for emergency operations
- ✅ Always verify backups exist before schema changes

### Rule #2: Use Separate Environments

**Production:** `DATABASE_URL` (your Neon database with real users)
**Local Development:** Different database URL for testing

### Rule #3: Test Locally First

Before ANY database changes:
1. Test on local database
2. Verify it works correctly
3. Create manual backup in Neon console
4. Only then apply to production

### Rule #4: Backup Strategy

**Neon Automatic Backups:**
- History retention: 6 hours (current plan)
- Point-in-time recovery available
- Access via Neon Console → Backup & Restore

**Recommendation:**
- Consider upgrading Neon plan for longer retention (7 days recommended)
- Create manual snapshots before major changes
- Export data regularly (especially user collections)

## Emergency Recovery Procedure

If data loss occurs:

1. **DO NOT PANIC** - Stay calm and act quickly
2. **Access Neon Console immediately**:
   - Go to https://console.neon.tech
   - Select your project
   - Click "Backup & Restore"
3. **Restore to point BEFORE the incident**:
   - Select timestamp before the problem
   - Click "Preview data" to verify
   - Click "Restore to point in time"
4. **Verify restoration**:
   ```bash
   npx prisma studio
   ```
   Check that users, collections, and catalog are present

## Monitoring

The safeguards automatically log:
- All database mutations (create, update, delete, upsert)
- Blocked operations (deleteMany attempts)
- Empty database warnings
- Slow queries (>1 second)

Check Vercel logs to monitor database health.

## Emergency Contacts

- **Neon Support**: https://console.neon.tech (for backup/restore)
- **Backup Retention**: 6 hours (consider upgrading)
- **Last Verified Working**: April 17, 2026, 5:30 PM

## Code Files

- `/lib/database-safeguards.ts` - Core protection mechanisms
- `/lib/startup-checks.ts` - Auto-initialization
- `/app/layout.tsx` - Imports startup checks
- `/lib/bricklink-catalog.ts` - Safe upsert-based catalog updates

---

**Never again.** These safeguards ensure your production data is protected against accidental deletion, schema mishaps, and destructive operations.
