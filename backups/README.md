# FigTracker Code Backups

## Purpose
These are full backups of working code to ensure we always have a restore point.

## Current Backups

### 2026-06-02-working-code (175MB, 1,220 files)
- **Created:** June 2, 2026 at 8:50 PM
- **Delete After:** June 7, 2026 (5 days from creation)
- **Status:** ✅ Verified working - all code builds successfully
- **Features included:**
  - Singapore IP blocking active
  - Price alerts system complete
  - Collection sharing enabled
  - Manual deployment via deploy.sh
  - All translations working
  - Bot protection active

**What's included:**
- All source code (app, components, lib, scripts)
- All documentation files
- All configuration files (.env examples, configs)
- Prisma schemas and migrations
- Translation files
- Public assets and catalog data

**What's excluded:**
- node_modules (can be reinstalled)
- .next build directory (can be rebuilt)
- .git history (already in git)

## How to Restore

If you need to restore from this backup:

```bash
# 1. Rename current code (just in case)
cd "/Users/erickkosysu/Code Projects/_Personal/FigTracker"
mv FigTracker FigTracker-broken-$(date +%Y%m%d)

# 2. Copy backup to main location
cp -r backups/2026-06-02-working-code FigTracker

# 3. Reinstall dependencies
cd FigTracker
npm install

# 4. Rebuild
npm run build

# 5. Deploy
./deploy.sh
```

## Backup Schedule

**Policy:** Keep 5-day rolling backups of working code

- Create backup: After major features complete and verified working
- Keep duration: 5 days
- Delete after: Confirmed newer working backup exists

## Notes

- Git history is ALWAYS the primary backup (every commit is saved)
- These backups are for peace of mind and quick recovery
- Always test that code builds before creating a backup
- Label each backup with status (working/broken/untested)
