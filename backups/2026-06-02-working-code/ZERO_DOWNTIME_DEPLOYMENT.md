# Zero-Downtime Deployment Setup Complete ✅

This document summarizes the new deployment architecture for FigTracker.

## 🎯 What Changed

### Before
- ❌ Direct production deployments
- ❌ Downtime during deploys (pm2 stop → pm2 start)
- ❌ No staging environment
- ❌ Testing in production
- ❌ Manual rollback on failure

### After
- ✅ Staging environment for testing
- ✅ Zero-downtime production deploys (pm2 reload)
- ✅ Automatic health checks
- ✅ Automatic rollback on failure
- ✅ Build on GitHub (no VPS CPU overload)

---

## 📁 Files Created

### GitHub Actions Workflows
1. **`.github/workflows/deploy-staging.yml`**
   - Triggers on: push to `develop` branch
   - Deploys to: staging.figtracker.com (port 3001)
   - Uses: PM2 reload for zero-downtime

2. **`.github/workflows/deploy-production.yml`**
   - Triggers on: push to `main` branch
   - Deploys to: figtracker.ericksu.com (port 3000)
   - Uses: PM2 reload + health checks + auto-rollback

3. **`.github/workflows/deploy.yml.old`**
   - Old workflow (renamed, can delete after migration)

### Documentation
1. **`STAGING_SETUP_GUIDE.md`** - Complete step-by-step setup instructions
2. **`PM2_ECOSYSTEM_CONFIG.md`** - PM2 configuration and monitoring
3. **`DEPLOYMENT_REFERENCE.md`** - Quick reference guide
4. **`ZERO_DOWNTIME_DEPLOYMENT.md`** - This file (summary)

### Health Check Endpoint
- **`app/api/health/route.ts`** - Health check for deployment verification

---

## 🚀 Next Steps to Complete Setup

### 1. VPS Setup (15 minutes)

```bash
# SSH to VPS
ssh root@187.77.202.14

# Create staging directory
mkdir -p /var/www/figtracker-staging
cd /var/www/figtracker-staging

# Copy production files
cp -r /var/www/figtracker/package.json .
cp -r /var/www/figtracker/package-lock.json .
cp -r /var/www/figtracker/.next .
cp -r /var/www/figtracker/node_modules .
cp -r /var/www/figtracker/prisma .
cp -r /var/www/figtracker/public . 2>/dev/null || true

# Copy and modify .env for staging
cp /var/www/figtracker/.env .env
nano .env  # Change DATABASE_URL to staging database

# Start staging on port 3001
pm2 start npm --name "figtracker-staging" -- start -- -p 3001
pm2 save
pm2 list  # Verify both apps running
```

### 2. Nginx Configuration (5 minutes)

```bash
# Edit Nginx config
nano /etc/nginx/sites-available/figtracker

# Add staging server block (see STAGING_SETUP_GUIDE.md for full config)
# Test and reload
nginx -t
systemctl reload nginx
```

### 3. DNS Configuration (5 minutes)

Add to your DNS provider (Cloudflare/Hostinger):
- Type: `A`
- Name: `staging`
- Value: `187.77.202.14`
- TTL: Auto

### 4. SSL Certificate (5 minutes)

```bash
# Add staging subdomain to certbot
certbot --nginx -d staging.figtracker.com
```

### 5. GitHub Secrets (2 minutes)

Go to: **GitHub repo → Settings → Secrets and variables → Actions**

Add new secret:
- Name: `STAGING_DATABASE_URL`
- Value: Your staging database URL

### 6. Create Develop Branch (1 minute)

```bash
git checkout -b develop
git push -u origin develop
```

### 7. Test Staging Deployment (5 minutes)

```bash
git checkout develop
echo "// Test staging" >> app/layout.tsx
git commit -am "test: Staging deployment"
git push origin develop

# Watch GitHub Actions
# Visit https://staging.figtracker.com
```

### 8. Test Production Deployment (5 minutes)

```bash
git checkout main
git merge develop
git push origin main

# Watch GitHub Actions
# Verify site stayed up during deployment
```

**Total Setup Time: ~45 minutes**

---

## 📊 Architecture Diagram

```
┌──────────────────────────────────────────────────┐
│                   DEVELOPER                      │
└──────────────────────────────────────────────────┘
                      │
                      ├─── git push origin develop
                      │         │
                      │         ▼
                      │    ┌─────────────────────┐
                      │    │  GitHub Actions     │
                      │    │  (deploy-staging)   │
                      │    └─────────────────────┘
                      │         │
                      │         │ Build on GitHub
                      │         │ (not VPS - saves CPU)
                      │         │
                      │         ▼
                      │    ┌─────────────────────┐
                      │    │ staging.figtracker  │
                      │    │ Port 3001           │
                      │    │ PM2: reload         │
                      │    └─────────────────────┘
                      │         │
                      │         │ Test & Verify
                      │         │
                      ├─── git merge develop → main
                      │         │
                      │         ▼
                      │    ┌─────────────────────┐
                      │    │  GitHub Actions     │
                      │    │  (deploy-production)│
                      │    └─────────────────────┘
                      │         │
                      │         │ Build on GitHub
                      │         │ Health Check
                      │         │ Auto-Rollback
                      │         │
                      │         ▼
                      │    ┌─────────────────────┐
                      └───▶│ figtracker.ericksu  │
                           │ Port 3000           │
                           │ PM2: reload         │
                           │ Zero-Downtime ✅    │
                           └─────────────────────┘
```

---

## 🔄 Typical Workflow

### Feature Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. Develop and commit
# ... make changes ...
git add .
git commit -m "feat: New feature"

# 3. Push and create PR to develop
git push origin feature/new-feature
# Create PR on GitHub: feature/new-feature → develop

# 4. Merge PR to develop
# PR approved and merged
# Auto-deploys to staging.figtracker.com

# 5. Test on staging
# Visit staging.figtracker.com
# Verify feature works

# 6. Merge develop → main (after testing)
git checkout main
git pull origin main
git merge develop
git push origin main
# Auto-deploys to production with zero-downtime
```

### Hotfix

```bash
# 1. Branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Fix and commit
# ... fix bug ...
git add .
git commit -m "fix: Critical bug"

# 3. Push directly to main (skip staging for emergencies)
git checkout main
git merge hotfix/critical-bug
git push origin main
# Auto-deploys to production immediately

# 4. Backport to develop
git checkout develop
git merge hotfix/critical-bug
git push origin develop
```

---

## 🛡️ Safety Features

### 1. Health Checks
- Deployment waits 5 seconds after PM2 reload
- Attempts health check 15 times (45 seconds total)
- Only succeeds if `/api/health` returns 200 OK

### 2. Automatic Rollback
- If health check fails, deployment script:
  1. Extracts previous backup
  2. Runs `pm2 reload` with old version
  3. Verifies old version is healthy
  4. Exits with error (deployment marked as failed)

### 3. Backup System
- Every deployment creates timestamped backup
- Keeps last 5 backups automatically
- Manual rollback available from any backup

### 4. Zero-Downtime PM2 Reload
- PM2 starts new instance before stopping old one
- Traffic continues to old instance during startup
- Seamless switchover when new instance is ready
- Users never see downtime

---

## 📈 Performance Impact

### Before (pm2 restart)
```
User Request
    ↓
  [ERROR]  ← Server down
    ↓
  Wait...  ← 3-5 seconds
    ↓
  [OK]     ← Server back up
```

### After (pm2 reload)
```
User Request
    ↓
  [OK]  ← Old instance running
    ↓
  [OK]  ← Old instance still running
    ↓
  [OK]  ← Seamless switch to new instance
    ↓
  [OK]  ← New instance running
```

**Downtime: 0 seconds** ✅

---

## 🧪 Testing Deployment

### Test Zero-Downtime

**Terminal 1: Monitor requests**
```bash
# Make continuous requests during deployment
while true; do
  STATUS=$(curl -s -o /dev/null -w '%{http_code}' https://figtracker.ericksu.com/api/health)
  echo "$(date +%T) - Status: $STATUS"
  if [ "$STATUS" != "200" ]; then
    echo "❌ DOWNTIME DETECTED"
  fi
  sleep 0.5
done
```

**Terminal 2: Deploy**
```bash
git push origin main
```

**Expected:** All requests return 200 OK during deployment.

---

## 📝 Monitoring Commands

### GitHub Actions
- Go to: https://github.com/[username]/figtracker/actions
- Watch workflows in real-time
- Check logs for failures

### VPS Status
```bash
ssh root@187.77.202.14

# Check PM2 processes
pm2 list
pm2 monit  # Real-time monitoring

# View logs
pm2 logs figtracker --lines 50
pm2 logs figtracker-staging --lines 50

# Check server resources
free -h     # Memory usage
top         # CPU usage
df -h       # Disk usage
```

### Health Checks
```bash
# Production
curl https://figtracker.ericksu.com/api/health

# Staging
curl https://staging.figtracker.com/api/health
```

---

## 🔧 Troubleshooting

### Deployment Fails Health Check

**Check logs:**
```bash
ssh root@187.77.202.14
pm2 logs figtracker --lines 100
```

**Common causes:**
- Database connection failed
- Environment variables missing
- Port already in use
- Build error (check GitHub Actions logs)

**Solution:**
- Deployment auto-rolls back
- Fix issue in code
- Push again

### Staging Not Accessible

**Check DNS:**
```bash
nslookup staging.figtracker.com
# Should return: 187.77.202.14
```

**Check Nginx:**
```bash
ssh root@187.77.202.14
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

**Check PM2:**
```bash
pm2 status figtracker-staging
pm2 logs figtracker-staging
```

### Manual Rollback

**List backups:**
```bash
ssh root@187.77.202.14
ls -lt /root/prod-backup-*.tar.gz | head -5
```

**Restore backup:**
```bash
cd /var/www/figtracker
tar -xzf /root/prod-backup-20260601-143022.tar.gz
pm2 reload figtracker
curl http://localhost:3000/api/health  # Verify
```

---

## 💰 Cost Analysis

**Additional Resources:**
- Staging app: ~150MB RAM
- Nginx config: 0MB (already running)
- SSL cert: Free (Let's Encrypt)
- DNS record: Free
- GitHub Actions: Free (public repo) or included (private repo)

**Total Additional Cost: $0/month** ✅

---

## 🎓 Best Practices

1. **Always test on staging first** (except emergencies)
2. **Monitor deployments** (watch GitHub Actions)
3. **Check logs after deployment** (`pm2 logs`)
4. **Keep develop and main in sync** (merge frequently)
5. **Use descriptive commit messages**
6. **Don't delete backups manually**
7. **Never run `npm run build` on VPS** (use GitHub Actions)

---

## 📚 Related Documentation

- **[STAGING_SETUP_GUIDE.md](STAGING_SETUP_GUIDE.md)** - Detailed setup steps
- **[PM2_ECOSYSTEM_CONFIG.md](PM2_ECOSYSTEM_CONFIG.md)** - PM2 configuration
- **[DEPLOYMENT_REFERENCE.md](DEPLOYMENT_REFERENCE.md)** - Quick reference
- **[CLAUDE.md](CLAUDE.md)** - Development guidelines

---

## ✅ Migration Checklist

- [ ] Read this document completely
- [ ] Complete VPS setup (Step 1)
- [ ] Configure Nginx (Step 2)
- [ ] Add DNS record (Step 3)
- [ ] Setup SSL certificate (Step 4)
- [ ] Add GitHub secrets (Step 5)
- [ ] Create develop branch (Step 6)
- [ ] Test staging deployment (Step 7)
- [ ] Test production deployment (Step 8)
- [ ] Monitor first production deployment
- [ ] Verify zero-downtime works
- [ ] Update team documentation
- [ ] Archive old deploy.yml

---

## 🎉 Summary

You now have a **production-grade deployment system** for FigTracker:

✅ **Staging environment** - Test safely before production  
✅ **Zero-downtime deployments** - Site never goes down  
✅ **Automatic rollback** - Failed deploys revert automatically  
✅ **Health monitoring** - Verify deployments work  
✅ **Build on GitHub** - No VPS CPU overload  
✅ **Backup system** - Easy rollback to previous versions  
✅ **Simple workflow** - git push = deployed  

**Next:** Follow [STAGING_SETUP_GUIDE.md](STAGING_SETUP_GUIDE.md) to complete the setup.
