# Database Backup System

## Automated Protection for User Data

This system protects your 16 clients' collections from:
- Accidental deletion
- Code bugs
- Database corruption
- Migration failures

## How It Works

**Automated Daily Backups:**
- Runs every day at 4:00 AM UTC
- Backs up all user data:
  - User accounts
  - CollectionItems (Inventory)
  - PersonalCollectionItems (Collections)
  - Listings
- Stores backups in this directory
- Commits to Git for version control and off-site storage

**What's Protected:**
- ✅ All user collections (minifigs, quantities, conditions)
- ✅ All inventory items (for-sale items)
- ✅ All listings (eBay/BrickLink drafts)
- ✅ User preferences (currency, region)
- ❌ Passwords are hashed, can't be recovered (use reset password)

## Manual Backup

Run anytime:
```bash
npx tsx scripts/backup-neon-database.ts
```

## Restore from Backup

If data is lost, restore it:

1. List available backups:
```bash
ls database-backups/BACKUP-SUMMARY-*.json
```

2. Restore from a specific backup:
```bash
npx tsx scripts/restore-backup.ts 2026-04-18T20-00-00
```

⚠️ **WARNING:** Restore will DELETE current data and replace with backup!

## Backup Files

Each backup creates:
- `users-<timestamp>.json` - User accounts
- `collection-items-<timestamp>.json` - Inventory items
- `personal-items-<timestamp>.json` - Personal collections
- `listings-<timestamp>.json` - Marketplace listings
- `BACKUP-SUMMARY-<timestamp>.json` - Backup metadata

## Verification

Test backups work:
```bash
# 1. Create test backup
npx tsx scripts/backup-neon-database.ts

# 2. Check it exists
ls -lh database-backups/

# 3. Verify summary
cat database-backups/BACKUP-SUMMARY-*.json | tail -1
```

## Security

- Backups stored in private Git repository
- Only accessible to repository owners
- Passwords are hashed (bcrypt), safe to backup
- No credit card or payment data stored

## Retention

- All backups kept permanently in Git history
- Can restore from any point in time
- Git provides version control and audit trail

## Emergency Contact

If you need help restoring:
1. Check this README
2. Run `npx tsx scripts/restore-backup.ts`
3. Contact: hello@ericksu.com
