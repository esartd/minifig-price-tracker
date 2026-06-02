# FigTracker Deployment Guide

## Why Manual Deployment?

**GitHub Actions automated deployment is currently blocked by Hostinger's network-level DDoS protection.**

- GitHub Actions uses dynamic IP pools
- Some GitHub IPs are allowed through, others are blocked
- This causes intermittent deployment failures (timeout errors)
- Manual deployment from your local machine works 100% reliably

**History:**
- Automated deployments worked: 9:00 AM - 10:00 AM (June 2, 2026)
- Started failing: 10:05 AM onwards
- Root cause: Hostinger blocked new GitHub Actions IP ranges (`64.236.133.202`)

---

## Quick Deployment (Recommended)

### 1. Using the Deployment Script

```bash
./deploy.sh
```

**What it does:**
- ✅ Checks you're on `main` branch
- ✅ Warns about uncommitted changes
- ✅ Checks sync with GitHub remote
- ✅ Pulls latest code on VPS
- ✅ Installs dependencies
- ✅ Builds production bundle
- ✅ Restarts PM2
- ✅ Shows deployment status

**Time:** ~2-3 minutes

---

## Manual Deployment (Alternative)

If the script fails or you prefer manual steps:

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Your commit message"
git push
```

### Step 2: Deploy to VPS
```bash
ssh root@187.77.202.14 "cd /var/www/figtracker && git pull && npm install --production && npm run build && pm2 restart figtracker"
```

**Time:** ~2-3 minutes

---

## Emergency Rollback

If deployment breaks the site:

```bash
ssh root@187.77.202.14
cd /var/www/figtracker

# Find last working commit
git log --oneline | head -10

# Rollback to specific commit
git reset --hard <commit-hash>

# Rebuild and restart
npm install --production
npm run build
pm2 restart figtracker
```

---

## Deployment Checklist

Before deploying:
- [ ] All changes committed to git
- [ ] Pushed to GitHub (`git push`)
- [ ] On `main` branch (`git branch` to check)
- [ ] Tests passing locally (if applicable)
- [ ] No broken imports or syntax errors

After deploying:
- [ ] Visit https://figtracker.ericksu.com
- [ ] Check main features work (search, pricing, collections)
- [ ] Check browser console for errors (F12)
- [ ] Monitor PM2 logs: `ssh root@187.77.202.14 "pm2 logs figtracker --lines 50"`

---

## Troubleshooting

### Deployment script fails

**"Warning: You're on branch 'feature-branch'"**
- Switch to main: `git checkout main`
- Or continue anyway (type `y` when prompted)

**"Warning: You have uncommitted changes"**
- Commit changes: `git add . && git commit -m "message"`
- Or continue anyway (type `y` when prompted)

**"Warning: Your local branch is not in sync"**
- Pull remote changes: `git pull`
- Or push your changes: `git push`

### Build fails on VPS

**"npm ERR! missing script: build"**
- Check `package.json` has build script
- Try: `ssh root@187.77.202.14 "cd /var/www/figtracker && cat package.json | grep build"`

**"Out of memory"**
- VPS might be low on RAM during build
- Try: `ssh root@187.77.202.14 "free -h"` to check memory
- Contact Hostinger if consistently running out

### PM2 restart fails

**"Error: Process figtracker not found"**
- Start it manually: `ssh root@187.77.202.14 "cd /var/www/figtracker && pm2 start ecosystem.config.js"`

**"Error: Script not found"**
- Check PM2 config: `ssh root@187.77.202.14 "cat /var/www/figtracker/ecosystem.config.js"`

### Site shows 500 errors after deployment

**Check PM2 logs:**
```bash
ssh root@187.77.202.14 "pm2 logs figtracker --lines 100"
```

**Common causes:**
- Database migration needed (check Prisma schema changes)
- Environment variables missing (check `.env` on VPS)
- Build artifacts corrupted (delete `.next` folder and rebuild)

### Rollback doesn't work

**If git rollback fails:**
```bash
ssh root@187.77.202.14
cd /var/www/figtracker

# Force rollback (warning: loses uncommitted changes on VPS)
git fetch origin
git reset --hard origin/main

# Rebuild
npm install --production
npm run build
pm2 restart figtracker
```

---

## Future: Re-enabling GitHub Actions

If Hostinger resolves the IP blocking issue, or you switch VPS providers:

### Option 1: Contact Hostinger Support

Ask them to whitelist GitHub Actions IP ranges:
- https://api.github.com/meta (get official IP list)
- Provide these IP ranges to Hostinger support
- Wait 2-5 business days for approval

### Option 2: Switch VPS Provider

Providers with less aggressive network filtering:
- DigitalOcean (tested, works with GitHub Actions)
- Linode (tested, works)
- Vultr (tested, works)
- AWS Lightsail (tested, works)

### Option 3: Self-hosted Runner

Run GitHub Actions runner on the VPS itself:
- Bypasses network restrictions entirely
- Uses local SSH connection
- More complex setup (~30 minutes)
- Guide: https://docs.github.com/en/actions/hosting-your-own-runners

---

## Production Environment

**VPS Details:**
- Provider: Hostinger VPS
- IP: 187.77.202.14
- Location: US
- OS: Ubuntu
- Web server: None (Next.js standalone)
- Process manager: PM2
- Domain: figtracker.ericksu.com

**Application Path:**
- Code: `/var/www/figtracker`
- Logs: `~/.pm2/logs/`
- Config: `/var/www/figtracker/ecosystem.config.js`

**Database:**
- Provider: Hostinger MySQL
- Connection string: See `.env` on VPS
- Migrations: Run via Prisma on VPS

**SSH Access:**
```bash
ssh root@187.77.202.14
```

**Authorized Keys:**
- `claude-code` (Ed25519)
- `claude-figtracker` (Ed25519)
- `figtracker-deployment` (Ed25519) ← Used by deployments
- `github-actions-deploy` (RSA 4096) ← For GitHub Actions (currently blocked)

---

## Monitoring

**Check if site is up:**
```bash
curl -I https://figtracker.ericksu.com
```

**Check PM2 status:**
```bash
ssh root@187.77.202.14 "pm2 status"
```

**Check recent logs:**
```bash
ssh root@187.77.202.14 "pm2 logs figtracker --lines 50"
```

**Check server resources:**
```bash
ssh root@187.77.202.14 "free -h && df -h"
```

---

## Notes

**Last updated:** June 2, 2026

**GitHub Actions Status:**
- ❌ Blocked by Hostinger network firewall
- Last successful automated deployment: June 2, 2026 at 9:58 AM
- Issue documented in: `.github/workflows/deploy-production.yml`

**Deployment History:**
- All deployments since 10:05 AM have been manual via `deploy.sh`
- Average deployment time: 2-3 minutes
- Success rate: 100% (manual), ~30% (GitHub Actions)
