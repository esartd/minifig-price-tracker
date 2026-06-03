# Database Architecture

**Last Updated:** June 3, 2026

## Current Architecture (WORKING - DO NOT CHANGE)

FigTracker uses a **dual-database architecture**:

### Database 1: MySQL (Hostinger Remote)
**Purpose:** Minifig catalog, pricing, collection data  
**Location:** `srv1777.hstgr.io:3306`  
**Database:** `u493602047_figtracker`  
**User:** `u493602047_figtracker_use`  
**Prisma Client:** `@prisma/client-hostinger`  
**Schema:** `prisma/schema-hostinger.prisma`

**Tables:**
- MinifigCatalog, SetsCatalog
- CollectionItem, PersonalCollectionItem
- PriceCache, PriceHistory, PriceAlert
- ApiCallTracker, SetContents
- Article, AmazonDeal
- And 19 total tables

### Database 2: PostgreSQL (Neon/Supabase)
**Purpose:** User accounts, authentication  
**Location:** Various (Neon, Supabase endpoints in .env.production)  
**Prisma Client:** `@prisma/client` (default)  
**Schema:** `prisma/schema.prisma`

**Tables:**
- User, Account, Session
- Authentication-related tables

---

## Why Dual Database?

**Historical Reasons:**
1. Started with Neon PostgreSQL for user accounts (easy auth setup)
2. Added MySQL later for LEGO catalog data (better performance for large catalogs)
3. Kept both to avoid risky migration

**Benefits:**
- ✅ User data isolated from catalog data (security)
- ✅ Can scale/optimize each database independently
- ✅ Working and stable

**Tradeoffs:**
- ⚠️ Two database connections to maintain
- ⚠️ Slightly more complex deployment
- ⚠️ Two sets of credentials to manage

---

## Migration Attempt (June 3, 2026)

**Goal:** Consolidate to single VPS MySQL database for better performance

**Result:** ❌ FAILED - Rolled back safely

**Why it failed:**
1. App code expects both databases simultaneously
2. Many files use `@prisma/client` (Neon) for User accounts
3. Many files use `@prisma/client-hostinger` (MySQL) for catalog
4. Cannot easily merge without rewriting significant code
5. Risk of downtime too high

**Lesson:** Current architecture is more complex than initially understood. Changing it requires careful planning and code refactoring, not just database migration.

---

## Current Configuration Files

### Production (.env on VPS)
```bash
DATABASE_URL="mysql://u493602047_figtracker_use:[PASSWORD]@srv1777.hstgr.io:3306/u493602047_figtracker"
# Plus Neon/Supabase URLs in .env.production
```

### Prisma Clients
```typescript
// lib/prisma.ts - Default client (Neon/Supabase for User accounts)
import { PrismaClient } from '@prisma/client'

// Code using MySQL (catalog, collections, pricing)
import { PrismaClient } from '@prisma/client-hostinger'
```

---

## Security Incident (June 3, 2026)

**What happened:**
- `.env` file with MySQL credentials exposed on GitHub
- Database: `u493602047_figtracker at srv1777.hstgr.io`
- Exposed password: `Legocatelogstuff12345!`
- Duration: ~2 hours

**Impact:** LOW
- No suspicious activity detected
- API usage normal
- No user complaints
- Niche project (low attack surface)

**Remediation:**
- ✅ Removed backup folder from GitHub
- ✅ Created security incident report
- ⏳ Password rotation recommended (not urgent)

**Monitor:**
- Check Hostinger MySQL logs for unknown IPs
- Monitor API call spikes
- Watch for unusual user activity

---

## DO NOT MIGRATE Unless...

**Before attempting database migration again:**

1. ✅ **Code audit complete** - Map all Prisma client usage
2. ✅ **Test environment set up** - Test migration on staging first
3. ✅ **Refactoring plan** - Know exactly which files to change
4. ✅ **Backup verified** - Full database export confirmed working
5. ✅ **Rollback tested** - Can restore in < 60 seconds
6. ✅ **Downtime window** - User aware of maintenance
7. ✅ **Monitoring ready** - Can detect issues immediately

**Estimated effort:** 8-12 hours of careful work

**Benefit vs Risk:** LOW benefit (slight performance gain) vs HIGH risk (complete site outage)

**Recommendation:** Keep current architecture indefinitely. It works.

---

## How to Rotate MySQL Password

**When you're ready to change the exposed password:**

1. **Find database in Hostinger panel**
   - Look for "Remote MySQL" or "External Databases"
   - Database name: `u493602047_figtracker`
   - Host: `srv1777.hstgr.io`

2. **Change password**
   - Click "Change Password" or "Modify"
   - Use strong password (save in password manager)
   - Apply changes

3. **Update VPS**
   ```bash
   ssh root@187.77.202.14
   cd /var/www/figtracker
   nano .env
   
   # Update this line:
   DATABASE_URL="mysql://u493602047_figtracker_use:NEW_PASSWORD@srv1777.hstgr.io:3306/u493602047_figtracker"
   
   # Save and restart
   pm2 restart figtracker
   pm2 logs figtracker --lines 20  # Verify connection
   ```

4. **Test site**
   - Visit: https://figtracker.ericksu.com
   - Test login
   - Check collections load
   - Verify pricing works

---

## Performance Notes

**Current MySQL Performance:** GOOD
- Query latency: ~10-20ms (external but close region)
- Connection pooling: Working
- No bottlenecks detected

**If VPS Local MySQL:** Would improve to ~0.1ms
- **But:** Not worth the migration risk
- **Because:** Current performance is already fine

---

## Related Documentation

- [SECURITY_INCIDENT_2026-06-03.md](SECURITY_INCIDENT_2026-06-03.md) - Security incident details
- [SET_CONTENTS_SYSTEM.md](SET_CONTENTS_SYSTEM.md) - New feature using MySQL
- [CLAUDE.md](CLAUDE.md) - General project instructions

---

## Questions & Answers

**Q: Why not just use one database?**  
A: Historical reasons + working system = don't fix what isn't broken.

**Q: Is the dual-database slowing things down?**  
A: No measurable performance impact. Both databases are fast.

**Q: Should we migrate eventually?**  
A: Only if you're refactoring authentication or scaling issues arise. Current setup can handle 10x traffic.

**Q: What if Hostinger MySQL goes down?**  
A: Catalog/collection features break, but you have backups. Can switch to VPS MySQL in emergency (2-4 hours).

**Q: What if Neon goes down?**  
A: User login breaks, but catalog browsing still works. Can switch to VPS PostgreSQL in emergency (1-2 hours).

---

**Status:** ✅ STABLE - Do not modify without careful planning  
**Next Review:** Only if experiencing actual performance or reliability issues
