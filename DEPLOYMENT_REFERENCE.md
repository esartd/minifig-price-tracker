# Deployment Reference - Quick Guide

## 🎯 Overview

**OLD (Before):**
- Direct deployment to production
- No staging environment
- Downtime during deployments
- Testing happens in production

**NEW (After Setup):**
- Staging environment for testing
- Zero-downtime production deployments
- Automatic health checks
- Automatic rollback on failure

---

## 📋 Quick Reference

### Branch Strategy

| Branch | Environment | URL | Auto-Deploy |
|--------|-------------|-----|-------------|
| `develop` | Staging | staging.figtracker.com | ✅ Yes |
| `main` | Production | figtracker.ericksu.com | ✅ Yes |

### Deployment Flow

```
1. Develop on `develop` branch
   ↓
2. Push to GitHub
   ↓
3. Auto-deploy to STAGING
   ↓
4. Test on staging.figtracker.com
   ↓
5. Merge `develop` → `main`
   ↓
6. Auto-deploy to PRODUCTION (zero-downtime)
```

---

## 🚀 Common Tasks

### Deploy to Staging

```bash
git checkout develop
# Make changes
git add .
git commit -m "feat: New feature"
git push origin develop
```

**Result:** Auto-deploys to staging.figtracker.com in ~3 minutes.

### Deploy to Production

```bash
# After testing on staging
git checkout main
git merge develop
git push origin main
```

**Result:** Auto-deploys to production with zero downtime in ~3 minutes.

### Emergency Hotfix

```bash
# Fix directly on main (skip staging)
git checkout main
# Make urgent fix
git add .
git commit -m "fix: Critical bug"
git push origin main
```

**Result:** Deploys to production immediately (use only for emergencies).

---

## 🔍 Monitoring Deployments

### GitHub Actions

1. Go to: https://github.com/ericksu/figtracker/actions
2. Watch running workflows
3. Click workflow for detailed logs

### VPS Status

```bash
# SSH to VPS
ssh root@187.77.202.14

# Check PM2 status
pm2 list

# View logs
pm2 logs figtracker          # Production
pm2 logs figtracker-staging  # Staging
```

### Health Checks

```bash
# Production
curl https://figtracker.ericksu.com/api/health

# Staging
curl https://staging.figtracker.com/api/health
```

---

## 🛠️ Troubleshooting

### Deployment Failed

**Check GitHub Actions:**
1. Go to Actions tab
2. Click failed workflow
3. Read error logs

**Common fixes:**
- Build error → Fix code, push again
- Health check timeout → Check VPS resources
- SSH connection failed → Verify VPS_SSH_KEY secret

### Staging Not Working

```bash
# SSH to VPS
ssh root@187.77.202.14

# Check staging status
pm2 status figtracker-staging

# Restart staging
pm2 reload figtracker-staging

# Check logs
pm2 logs figtracker-staging --lines 50
```

### Production Deployment Rolled Back

Deployment automatically rolls back if health checks fail.

**To investigate:**
```bash
ssh root@187.77.202.14
pm2 logs figtracker --lines 100
ls -lt /root/prod-backup-*.tar.gz | head -5  # List recent backups
```

**To manually rollback further:**
```bash
cd /var/www/figtracker
tar -xzf /root/prod-backup-YYYYMMDD-HHMMSS.tar.gz
pm2 reload figtracker
```

---

## 📊 PM2 Commands

### Status & Monitoring

```bash
pm2 list            # List all processes
pm2 status          # Detailed status
pm2 monit           # Real-time monitoring (interactive)
```

### Logs

```bash
pm2 logs                        # All logs (tail)
pm2 logs figtracker             # Production logs
pm2 logs figtracker-staging     # Staging logs
pm2 logs --lines 100            # Last 100 lines
pm2 logs --err                  # Error logs only
```

### Manual Restart (if needed)

```bash
pm2 reload figtracker           # Zero-downtime restart
pm2 restart figtracker          # Regular restart (brief downtime)
pm2 stop figtracker             # Stop process
pm2 start figtracker            # Start process
```

---

## 🔐 GitHub Secrets Required

### Existing Secrets (already configured)

- `VPS_HOST` = 187.77.202.14
- `VPS_USERNAME` = root
- `VPS_SSH_KEY` = (your SSH private key)
- `DATABASE_URL` = (production database)

### New Secrets (need to add)

- `STAGING_DATABASE_URL` = (staging database URL)

**To add:**
1. GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add `STAGING_DATABASE_URL`

---

## 📁 Files Changed/Created

### GitHub Actions Workflows

- `.github/workflows/deploy-staging.yml` ← NEW (staging deployments)
- `.github/workflows/deploy-production.yml` ← NEW (production deployments)
- `.github/workflows/deploy.yml` ← OLD (can archive/delete after migration)

### Documentation

- `STAGING_SETUP_GUIDE.md` ← Complete setup instructions
- `PM2_ECOSYSTEM_CONFIG.md` ← PM2 configuration reference
- `DEPLOYMENT_REFERENCE.md` ← This file (quick reference)

---

## ⚙️ Setup Checklist

Before using new deployment system, complete these steps:

### VPS Setup
- [ ] Create `/var/www/figtracker-staging` directory
- [ ] Copy files to staging directory
- [ ] Create staging `.env` file
- [ ] Start staging with PM2 on port 3001
- [ ] Add staging to Nginx configuration
- [ ] Reload Nginx

### DNS Setup
- [ ] Add `staging.figtracker.com` A record to DNS
- [ ] Point to VPS IP (187.77.202.14)

### SSL Setup
- [ ] Add staging subdomain to SSL certificate
- [ ] Or verify wildcard cert covers `*.figtracker.com`

### GitHub Setup
- [ ] Add `STAGING_DATABASE_URL` secret
- [ ] Create `develop` branch
- [ ] Push `develop` branch to GitHub

### Testing
- [ ] Push to `develop` → Verify staging deployment
- [ ] Visit staging.figtracker.com → Verify site works
- [ ] Push to `main` → Verify production deployment
- [ ] Monitor PM2 logs during deployment

**See [STAGING_SETUP_GUIDE.md](STAGING_SETUP_GUIDE.md) for detailed instructions.**

---

## 🎓 Best Practices

### ✅ DO

- Always test on staging first
- Monitor GitHub Actions during deployments
- Check PM2 logs after deployments
- Keep `develop` and `main` in sync (merge regularly)
- Use descriptive commit messages

### ❌ DON'T

- Don't push untested code to `main`
- Don't SSH to VPS for deployments (use GitHub Actions)
- Don't run `npm run build` on VPS (causes CPU overload)
- Don't skip staging for non-emergency changes
- Don't delete deployment backups manually

---

## 🆘 Emergency Contacts

- **User:** Erick Su (ericksu0c@gmail.com)
- **VPS Host:** Hostinger (use support portal)
- **GitHub Actions:** Check workflow logs first
- **Database Issues:** Check Hostinger phpMyAdmin

---

## 📖 Related Documentation

- [STAGING_SETUP_GUIDE.md](STAGING_SETUP_GUIDE.md) - Complete setup instructions
- [PM2_ECOSYSTEM_CONFIG.md](PM2_ECOSYSTEM_CONFIG.md) - PM2 configuration
- [CLAUDE.md](CLAUDE.md) - Development guidelines
- [PRICING_SYSTEM.md](PRICING_SYSTEM.md) - Pricing system documentation
- [BRICKLINK_API_COMPLIANCE.md](BRICKLINK_API_COMPLIANCE.md) - API compliance rules

---

## 🎉 Benefits After Migration

✅ **Zero-downtime deployments** - Site stays up during deploys  
✅ **Staging environment** - Test before production  
✅ **Automatic rollback** - Failed deployments auto-revert  
✅ **Health checks** - Verify deployments work  
✅ **No more SSH** - Deploy from git push  
✅ **Backup system** - Last 5 deployments saved  
✅ **Build on GitHub** - No VPS CPU overload  

---

**Next Step:** Follow [STAGING_SETUP_GUIDE.md](STAGING_SETUP_GUIDE.md) to complete the setup.
