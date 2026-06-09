# FigTracker Deployment Guide

## 🚀 Quick Deploy (Zero Downtime)

**One command from your local machine:**

```bash
ssh root@187.77.202.14 '/var/www/figtracker/deploy.sh'
```

**Time:** ~2-3 minutes | **Downtime:** 0 seconds ✨

---

## 📋 What the Deploy Script Does

The script at `/var/www/figtracker/deploy.sh` runs:

1. `git pull origin main` - Get latest code
2. `npm ci --omit=dev` - Install production dependencies
3. `npx prisma generate` - Generate Prisma client
4. `npm run build` - Build Next.js (~2 min)
5. `pm2 reload ecosystem.config.js --update-env` - **Zero-downtime reload**

### How Zero Downtime Works

PM2 cluster mode (2 instances):
1. Starts 2 new worker processes
2. New workers become ready
3. Old workers shut down gracefully
4. **Site never goes offline!**

---

## 📝 Full Deployment Workflow

### Step 1: Make Changes Locally

```bash
cd /Users/erickkosysu/Code\ Projects/_Personal/FigTracker

# Make your code changes
# Test locally: npm run dev

# Commit
git add -A
git commit -m "your changes"
git push origin main
```

### Step 2: Deploy to Production

```bash
ssh root@187.77.202.14 '/var/www/figtracker/deploy.sh'
```

### Step 3: Verify

```bash
# Check PM2 status
ssh root@187.77.202.14 'pm2 status'

# Test site
open https://figtracker.ericksu.com

# Monitor logs (if needed)
ssh root@187.77.202.14 'pm2 logs figtracker --lines 50'
```

---

## 🆘 Troubleshooting

### Build Fails on Server

```bash
# SSH in and diagnose
ssh root@187.77.202.14
cd /var/www/figtracker

# Check what went wrong
git status
npm run build  # See the actual error

# Common fixes:
npm ci --omit=dev  # Clean dependency install
npx prisma generate  # Regenerate Prisma client
```

### Site Down After Deploy

```bash
# Check PM2 status
ssh root@187.77.202.14 'pm2 status'

# View error logs
ssh root@187.77.202.14 'pm2 logs figtracker --err --lines 50'

# Restart if needed
ssh root@187.77.202.14 'pm2 restart figtracker'
```

### Emergency Rollback

```bash
ssh root@187.77.202.14
cd /var/www/figtracker

# Find last working commit
git log --oneline -10

# Rollback
git reset --hard <commit-hash>
npm ci --omit=dev
npm run build
pm2 reload ecosystem.config.js
```

---

## 🚫 Why GitHub Actions Doesn't Work

**Status:** Disabled due to Hostinger firewall

**The Problem:**
- GitHub Actions uses rotating AWS/Azure IPs
- Hostinger's datacenter firewall blocks most of these IPs
- Error: `dial tcp ***:22: i/o timeout`
- Success rate: ~10% (too unreliable)

**What We Tried:**
- SSH keys configured correctly ✅
- Server firewall (UFW) is off ✅
- SSH accessible from local machine ✅
- GitHub Actions still times out ❌

**Root Cause (per Google AI):**
> Hostinger VPS has datacenter-level firewall that blocks GitHub Actions' rotating IP pools. Not an SSH config issue - it's network-level filtering.

**Workflow file:** `.github/workflows/deploy.yml` (exists but won't work)

**Solution:** Manual SSH deploy works 100% reliably

---

## 🔮 Future: Automated Deploys

If we want automation later:

### Option 1: Hostinger Whitelist (Unlikely)
Contact Hostinger support to whitelist GitHub Actions IPs
- GitHub uses 100+ rotating IPs
- Hostinger unlikely to whitelist all
- Estimated time: 2-5 business days

### Option 2: Self-Hosted Runner (Best)
Install GitHub Actions runner on VPS:
- ✅ Bypasses firewall entirely
- ✅ 100% reliable
- ⏱️ 30 min setup
- Guide: https://docs.github.com/en/actions/hosting-your-own-runners

### Option 3: Switch VPS Provider
Providers that work with GitHub Actions:
- DigitalOcean ✅
- Linode ✅
- Vultr ✅
- AWS Lightsail ✅

**For now:** Manual deploy is fast enough (one command!)

---

## 📊 Production Environment

**VPS Details:**
- Provider: Hostinger VPS
- IP: `137.184.34.143`
- OS: Ubuntu
- Process Manager: PM2 (cluster mode, 2 instances)
- Domain: figtracker.ericksu.com

**Application:**
- Path: `/var/www/figtracker`
- Config: `/var/www/figtracker/ecosystem.config.js`
- Logs: `~/.pm2/logs/figtracker-*.log`

**Database:**
- Provider: Hostinger MySQL
- Host: `srv1777.hstgr.io`
- Connection: See `.env` on VPS

**SSH Access:**
```bash
ssh root@187.77.202.14
```

---

## 📈 Deployment History

**June 8, 2026 - Zero Downtime Setup**
- ✅ Created `deploy.sh` script on server
- ✅ Switched to PM2 cluster mode (2 instances)
- ✅ Verified zero-downtime reload works
- ✅ Deployed 4 major features successfully

**Features Deployed:**
1. Mobile Safari login fix (cookie domain removed)
2. 60% API call reduction (USD-only caching)
3. Client-side currency conversion
4. Smart set listing descriptions

**Key Commits:**
- `e79f3c0` - Remove visitor tracking
- `02d1a57` - Add PM2 cluster config
- `f59f474` - Smart conditional listing fields
- `bb455b6` - Client-side currency conversion
- `6dccf5b` - USD-only caching

---

## ✅ Deployment Checklist

**Before:**
- [ ] Changes committed: `git status`
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Build succeeds locally: `npm run build`

**Deploy:**
- [ ] Run: `ssh root@187.77.202.14 '/var/www/figtracker/deploy.sh'`
- [ ] Wait ~2-3 minutes

**After:**
- [ ] Visit https://figtracker.ericksu.com
- [ ] Test key features (login, pricing, collections)
- [ ] Check browser console (F12) for errors

---

## 📝 Notes

**Last Updated:** June 8, 2026

**Deploy Method:** Manual SSH (100% reliable)  
**Average Time:** 2-3 minutes  
**Downtime:** 0 seconds (PM2 cluster mode)  
**Success Rate:** 100%

**GitHub Actions:** Disabled (Hostinger firewall blocks it)
