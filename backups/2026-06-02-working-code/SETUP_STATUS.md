# Zero-Downtime Deployment Setup Status

## ✅ Completed (By Claude)

### VPS Configuration
- ✅ Created `/var/www/figtracker-staging` directory
- ✅ Copied all files from production to staging
- ✅ Configured staging `.env` file
- ✅ Started staging on PM2 (port 3001)
- ✅ Configured Nginx for staging subdomain
- ✅ SSL certificate already covers wildcard (`*.figtracker.ericksu.com`)

### Code & Documentation
- ✅ Created `.github/workflows/deploy-staging.yml`
- ✅ Created `.github/workflows/deploy-production.yml`
- ✅ Created `app/api/health/route.ts` (health check endpoint)
- ✅ Created all documentation files
- ✅ Created `develop` branch
- ✅ Pushed `develop` branch to GitHub

### Current VPS Status
```
Production:
- Directory: /var/www/figtracker
- Port: 3000
- PM2 Process: figtracker
- URL: figtracker.ericksu.com
- Status: ✅ Running

Staging:
- Directory: /var/www/figtracker-staging
- Port: 3001
- PM2 Process: figtracker-staging
- URL: staging.figtracker.ericksu.com (DNS not configured yet)
- Status: ✅ Running locally
```

---

## ⏳ Pending (Manual Steps Required)

### 1. Configure DNS Record (5 minutes)

**You need to add DNS record for staging subdomain.**

**Instructions:** See [DNS_SETUP_INSTRUCTIONS.md](DNS_SETUP_INSTRUCTIONS.md)

**Quick steps:**
1. Log in to your DNS provider (Cloudflare/Hostinger)
2. Add A record:
   - Name: `staging.figtracker`
   - Type: A
   - Value: `187.77.202.14`
   - TTL: Auto/3600
3. Wait 5-10 minutes for propagation

**Verify:**
```bash
nslookup staging.figtracker.ericksu.com
# Should return: 187.77.202.14

curl -I https://staging.figtracker.ericksu.com
# Should return: 200 OK
```

### 2. Add GitHub Secret (2 minutes)

**You need to add staging database URL to GitHub secrets.**

**Instructions:** See [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)

**Quick steps:**
1. Go to: GitHub repo → Settings → Secrets and variables → Actions
2. Click: New repository secret
3. Name: `STAGING_DATABASE_URL`
4. Value: `mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker`
5. Click: Add secret

---

## 🧪 Testing (After DNS & GitHub Secret)

### Test 1: Staging Deployment

```bash
git checkout develop
echo "// Test staging" >> app/layout.tsx
git commit -am "test: Staging deployment"
git push origin develop
```

**Expected:**
- GitHub Actions triggers "Deploy to Staging" workflow
- Builds on GitHub
- Deploys to VPS
- Staging available at: https://staging.figtracker.ericksu.com

### Test 2: Production Zero-Downtime Deployment

```bash
git checkout main
git merge develop
git push origin main
```

**Expected:**
- GitHub Actions triggers "Deploy to Production" workflow
- Builds on GitHub
- PM2 reload (zero-downtime)
- Health check passes
- Production updated at: https://figtracker.ericksu.com
- **No downtime during deployment**

---

## 📊 What Happens After Setup

### Daily Workflow

```
1. Work on develop branch
   git checkout develop
   # Make changes
   git commit -am "feat: New feature"
   git push origin develop
   
2. Auto-deploys to STAGING
   → https://staging.figtracker.ericksu.com
   
3. Test on staging
   → Verify feature works
   
4. Merge to production
   git checkout main
   git merge develop
   git push origin main
   
5. Auto-deploys to PRODUCTION (zero-downtime)
   → https://figtracker.ericksu.com
```

### Deployment Process

**Staging (develop branch):**
- Build: ~3 minutes
- Deployment: PM2 reload
- Health check: 15 attempts (45 seconds)
- Rollback: Automatic if health check fails

**Production (main branch):**
- Build: ~3 minutes
- Deployment: PM2 reload (zero-downtime)
- Health check: 15 attempts (45 seconds)
- Rollback: Automatic if health check fails
- Backup: Last 5 deployments saved automatically

---

## 🔍 Monitoring

### Check PM2 Status
```bash
ssh root@187.77.202.14
pm2 list
pm2 logs figtracker
pm2 logs figtracker-staging
```

### Check GitHub Actions
- Go to: https://github.com/[username]/figtracker/actions
- Watch workflows in real-time
- Check logs for failures

### Check Health
```bash
curl https://figtracker.ericksu.com/api/health
curl https://staging.figtracker.ericksu.com/api/health
```

---

## 📁 Documentation Files Created

- [ZERO_DOWNTIME_DEPLOYMENT.md](ZERO_DOWNTIME_DEPLOYMENT.md) - Complete overview
- [STAGING_SETUP_GUIDE.md](STAGING_SETUP_GUIDE.md) - Detailed setup steps
- [PM2_ECOSYSTEM_CONFIG.md](PM2_ECOSYSTEM_CONFIG.md) - PM2 configuration
- [DEPLOYMENT_REFERENCE.md](DEPLOYMENT_REFERENCE.md) - Quick reference
- [DNS_SETUP_INSTRUCTIONS.md](DNS_SETUP_INSTRUCTIONS.md) - DNS configuration
- [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) - GitHub secrets
- [SETUP_STATUS.md](SETUP_STATUS.md) - This file (current status)

---

## 🎯 Next Actions

**Do these in order:**

1. ✅ **VPS Setup** - COMPLETE (by Claude)
2. ⏳ **Configure DNS** - [Instructions](DNS_SETUP_INSTRUCTIONS.md)
3. ⏳ **Add GitHub Secret** - [Instructions](GITHUB_SECRETS_SETUP.md)
4. ⏳ **Test Staging** - Push to develop branch
5. ⏳ **Test Production** - Merge develop to main

**Estimated time remaining: 10-15 minutes**

---

## 🆘 Need Help?

**If stuck:**
1. Check the specific documentation file for that step
2. SSH to VPS and run: `pm2 list` to check status
3. Check GitHub Actions logs for deployment errors
4. Review [DEPLOYMENT_REFERENCE.md](DEPLOYMENT_REFERENCE.md) for troubleshooting

**Common Issues:**
- DNS not working → Wait 10 minutes, check with `nslookup`
- GitHub Actions failing → Check if `STAGING_DATABASE_URL` secret exists
- Staging not accessible → Check PM2 status: `pm2 status figtracker-staging`

---

**Once DNS and GitHub secret are configured, tell me and I'll test the deployments.**
