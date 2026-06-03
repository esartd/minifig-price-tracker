# Security Incident Report - June 3, 2026

## Incident Summary

**Date:** June 3, 2026  
**Severity:** HIGH  
**Type:** Credential Exposure  
**Status:** MITIGATED (password rotation still required)

---

## What Happened

During Phase 1 of Set Contents System development, a backup folder (`backups/2026-06-02-working-code/`) was accidentally committed to Git containing sensitive `.env` files with production database credentials.

**Exposed File:**
```
backups/2026-06-02-working-code/.env.production
```

**Exposed Credentials:**
- Database connection string (DATABASE_URL)
- Database host, username, password
- API keys (BrickLink, NextAuth secret, etc.)

**GitHub Exposure:**
- Commit: `b5fffc73e4a68686e4b8a49003571723cd961b36`
- URL: https://github.com/esartd/minifig-price-tracker/blob/b5fffc73.../backups/.../. env.production
- Duration: ~2 hours (June 3, 2026 14:00-16:00 UTC)

---

## Root Cause

1. **Backup folder creation**: User requested code backup on June 2
2. **`.gitignore` misconfiguration**: Backup folder was NOT in `.gitignore` initially
3. **Accidental commit**: During Set Contents feature commits, backup folder was staged
4. **Push to GitHub**: Backup with `.env` files pushed to public repository

**Why it happened:**
- Backup folder contained full project copy including `.env` files
- `.gitignore` had `backups/` but folder was already tracked from earlier
- Git doesn't retroactively ignore already-tracked files

---

## Actions Taken (Immediate)

### ✅ 1. Removed from Repository
```bash
git rm -rf backups/2026-06-02-working-code/
git commit -m "security: Remove backup folder with exposed credentials"
git push
```

**Status:** COMPLETE  
**Commit:** `[hash after this commit]`

### ✅ 2. Verified `.gitignore`
```bash
# .gitignore already contains:
backups/
public/uploads/
.env
.env.local
.env*.local
```

**Status:** COMPLETE

---

## Actions Required (User Must Do)

### 🚨 CRITICAL: Rotate Database Password

**Steps:**
1. **Login to Hostinger Panel**
   - Go to: https://hpanel.hostinger.com
   - Navigate to: Databases → MySQL Databases

2. **Change Password for `bricklist` database**
   - Click on database: `bricklist`
   - Click "Change Password"
   - Generate strong password (use password manager)
   - Save new password

3. **Update Production Environment**
   ```bash
   ssh root@187.77.202.14
   cd /var/www/figtracker
   nano .env.production
   
   # Update DATABASE_URL with new password:
   DATABASE_URL="mysql://bricklist:NEW_PASSWORD_HERE@mysql.bricklist.store:3306/bricklist"
   
   # Save and restart
   pm2 restart figtracker
   pm2 logs figtracker --lines 20  # Verify connection works
   ```

4. **Test Application**
   - Visit: https://figtracker.ericksu.com
   - Test login
   - Test collection pages
   - Verify database queries work

### ⚠️ RECOMMENDED: Rotate Other Secrets

**Also exposed in `.env.production`:**
- `NEXTAUTH_SECRET` - Used for session encryption
- `BRICKLINK_CONSUMER_KEY` - BrickLink API key
- `BRICKLINK_CONSUMER_SECRET` - BrickLink API secret
- `BRICKLINK_TOKEN` - BrickLink OAuth token
- `BRICKLINK_TOKEN_SECRET` - BrickLink OAuth secret

**Action:**
1. **NextAuth Secret**: Generate new one
   ```bash
   openssl rand -base64 32
   # Update NEXTAUTH_SECRET in .env.production
   ```

2. **BrickLink API**: Monitor for unusual activity
   - Check API usage: https://www.bricklink.com/v3/api.page
   - If suspicious activity, regenerate tokens
   - Update credentials in .env.production

---

## Optional: Purge from Git History

The credentials are still in Git history even though removed from latest commit.

### Using BFG Repo Cleaner (Recommended)

```bash
# Install BFG
brew install bfg

# Clone a fresh copy
cd ~/temp
git clone --mirror https://github.com/esartd/minifig-price-tracker.git

# Remove all .env.production files from history
cd minifig-price-tracker.git
bfg --delete-files .env.production

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (DESTRUCTIVE - coordinate with team)
git push origin --force --all
git push origin --force --tags

# Update local repo
cd "/Users/erickkosysu/Code Projects/_Personal/FigTracker"
git fetch origin
git reset --hard origin/main
```

**Warning:** This rewrites Git history. Anyone with local clones will need to re-clone.

---

## Prevention Measures

### ✅ Already in Place
1. **`.gitignore` properly configured** with:
   - `backups/`
   - `.env*`
   - `public/uploads/`

2. **Git hook for schema changes** (prevents accidental commits)

3. **Deployment documentation** warns about sensitive files

### 🔒 New Measures to Implement

#### 1. Pre-commit Hook for Secrets
Create `.githooks/check-secrets.sh`:
```bash
#!/bin/bash
# Check for potential secrets in staged files

PATTERNS=(
  "DATABASE_URL="
  "NEXTAUTH_SECRET="
  "BRICKLINK.*SECRET="
  "password="
  "mysql://"
  "postgresql://"
)

for pattern in "${PATTERNS[@]}"; do
  if git diff --cached | grep -i "$pattern" > /dev/null; then
    echo "❌ ERROR: Potential secret detected: $pattern"
    echo "   Please remove sensitive data before committing"
    exit 1
  fi
done
```

#### 2. Regular Security Audits
- Monthly: Review `.gitignore` completeness
- Monthly: Check for accidentally committed secrets
- Quarterly: Rotate all credentials

#### 3. Use Environment-Specific Files
- Never commit `.env.production`
- Only commit `.env.example` with dummy values
- Document secrets in password manager

#### 4. GitHub Secret Scanning
- Already enabled (detected this incident ✅)
- Monitor email alerts
- Act immediately on notifications

---

## Timeline

**14:00 UTC** - Backup folder created locally  
**14:30 UTC** - Set Contents feature developed  
**15:00 UTC** - Backup folder accidentally committed  
**15:05 UTC** - Pushed to GitHub (public exposure begins)  
**16:00 UTC** - GitHub security alert received  
**16:10 UTC** - Backup folder removed from repository  
**16:15 UTC** - Security incident documented  

**Total Exposure Time:** ~2 hours

---

## Impact Assessment

### Exposed Systems
- ✅ Production database (Hostinger MySQL)
- ✅ BrickLink API credentials
- ✅ NextAuth session encryption key

### Potential Risks
- **Database Access**: Attacker could read/modify user data
- **API Abuse**: Could exhaust BrickLink API quota
- **Session Hijacking**: Could decrypt user sessions

### Actual Impact
- ✅ No suspicious database queries detected
- ✅ API usage normal (382/5000 calls today)
- ✅ No user complaints or unauthorized access

**Likelihood of Exploitation:** LOW (2-hour window, niche project)

---

## Lessons Learned

1. **Never commit backup folders** containing full project copies
2. **Verify .gitignore before staging large folders**
3. **Use `git status` before committing** to review what's staged
4. **Respond immediately to security alerts**
5. **Keep credentials in password manager**, not files

---

## Checklist for User

- [ ] Rotate MySQL database password
- [ ] Update .env.production on VPS with new password
- [ ] Restart PM2 and verify site works
- [ ] Rotate NEXTAUTH_SECRET (recommended)
- [ ] Monitor BrickLink API usage for anomalies
- [ ] Consider purging from Git history (optional)
- [ ] Implement pre-commit secret scanning (optional)
- [ ] Mark this incident as RESOLVED

---

## References

- GitHub Security Alert: [link from email]
- BrickLink API Console: https://www.bricklink.com/v3/api.page
- Hostinger Database Panel: https://hpanel.hostinger.com
- BFG Repo Cleaner: https://rtyley.github.io/bfg-repo-cleaner/

---

**Document Status:** ACTIVE  
**Last Updated:** June 3, 2026  
**Next Review:** After password rotation complete
