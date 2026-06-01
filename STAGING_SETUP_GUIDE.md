# Staging Environment Setup Guide

This guide walks through setting up a **staging environment** on your existing Hostinger VPS for zero-downtime deployments.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              Hostinger VPS                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Production (Port 3000)                         │
│  ├── /var/www/figtracker                        │
│  ├── PM2: figtracker                            │
│  └── URL: figtracker.ericksu.com                │
│                                                 │
│  Staging (Port 3001)                            │
│  ├── /var/www/figtracker-staging                │
│  ├── PM2: figtracker-staging                    │
│  └── URL: staging.figtracker.com                │
│                                                 │
│  Nginx Reverse Proxy                            │
│  ├── :80/:443 → :3000 (production)              │
│  └── :80/:443 → :3001 (staging subdomain)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Step 1: VPS Setup (One-Time)

### 1.1 Create Staging Directory

```bash
ssh root@187.77.202.14

# Create staging directory
mkdir -p /var/www/figtracker-staging
cd /var/www/figtracker-staging

# Copy production files as initial staging setup
cp -r /var/www/figtracker/package.json .
cp -r /var/www/figtracker/package-lock.json .
cp -r /var/www/figtracker/.next .
cp -r /var/www/figtracker/node_modules .
cp -r /var/www/figtracker/prisma .
cp -r /var/www/figtracker/public . 2>/dev/null || true
```

### 1.2 Create Staging Environment File

```bash
cd /var/www/figtracker-staging

# Copy production .env and modify for staging
cp /var/www/figtracker/.env .env

# Edit staging .env
nano .env
```

**Staging .env changes:**

```env
# Use staging database (create new database or use suffix)
DATABASE_URL="mysql://user:pass@host:3306/figtracker_staging"

# Staging-specific URLs
NEXT_PUBLIC_BASE_URL=https://staging.figtracker.com
NEXTAUTH_URL=https://staging.figtracker.com

# Optional: Different API keys for staging
# BRICKLINK_CONSUMER_KEY=staging_key
# SENDGRID_API_KEY=staging_key
```

### 1.3 Start Staging with PM2

```bash
cd /var/www/figtracker-staging

# Start staging on port 3001
pm2 start npm --name "figtracker-staging" -- start -- -p 3001

# Save PM2 configuration
pm2 save

# Verify both apps are running
pm2 list
```

Expected output:
```
┌─────┬────────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                   │ status  │ cpu     │ memory   │
├─────┼────────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ figtracker             │ online  │ 0%      │ 150 MB   │
│ 1   │ figtracker-staging     │ online  │ 0%      │ 150 MB   │
└─────┴────────────────────────┴─────────┴─────────┴──────────┘
```

## Step 2: Nginx Configuration

### 2.1 Add Staging Subdomain to Nginx

```bash
# Edit Nginx configuration
nano /etc/nginx/sites-available/figtracker
```

**Add staging server block:**

```nginx
# Production (existing)
server {
    listen 80;
    listen 443 ssl;
    server_name figtracker.ericksu.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Staging (NEW)
server {
    listen 80;
    listen 443 ssl;
    server_name staging.figtracker.com;

    ssl_certificate /path/to/cert.pem;  # Use same cert (wildcard) or get new one
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;  # Port 3001 for staging
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2.2 Test and Reload Nginx

```bash
# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

## Step 3: DNS Configuration

Add staging subdomain to your DNS provider (Cloudflare/Hostinger):

**DNS Record:**
- Type: `A`
- Name: `staging`
- Value: `187.77.202.14` (your VPS IP)
- TTL: Auto or 3600

**Result:** `staging.figtracker.com` → VPS → Nginx → Port 3001

## Step 4: SSL Certificate (Let's Encrypt)

### Option A: Wildcard Certificate (Recommended)

If you already have a wildcard cert (`*.figtracker.com`), staging is covered automatically.

### Option B: Add Staging to Existing Cert

```bash
# Add staging.figtracker.com to certbot
certbot --nginx -d figtracker.ericksu.com -d staging.figtracker.com

# Or create separate cert for staging
certbot --nginx -d staging.figtracker.com
```

## Step 5: GitHub Secrets Configuration

Add staging secrets to GitHub repository:

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Add **Staging Environment** secrets:

```
STAGING_DATABASE_URL = mysql://user:pass@host:3306/figtracker_staging
```

All other secrets (VPS_HOST, VPS_USERNAME, VPS_SSH_KEY) are shared between staging and production.

## Step 6: Create Develop Branch

```bash
# Create develop branch for staging deployments
git checkout -b develop
git push -u origin develop
```

**Branch Strategy:**
- `develop` branch → Auto-deploys to **staging.figtracker.com**
- `main` branch → Auto-deploys to **figtracker.ericksu.com** (production)

## Step 7: Test Staging Deployment

1. **Make a change on develop branch:**
   ```bash
   git checkout develop
   echo "// Test staging deployment" >> app/layout.tsx
   git commit -am "test: Staging deployment test"
   git push origin develop
   ```

2. **Watch GitHub Actions:**
   - Go to **Actions** tab
   - Watch "Deploy to Staging" workflow
   - Should complete in ~3 minutes

3. **Verify staging site:**
   ```bash
   curl https://staging.figtracker.com
   ```

4. **Access in browser:**
   - Visit: https://staging.figtracker.com
   - Should show your test changes

## Step 8: Production Deployment Workflow

**Safe deployment process:**

1. **Develop on `develop` branch:**
   ```bash
   git checkout develop
   # Make changes
   git commit -am "feat: New feature"
   git push origin develop
   ```

2. **Verify on staging:**
   - Changes auto-deploy to staging.figtracker.com
   - Test thoroughly on staging

3. **Merge to production:**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

4. **Production deploys automatically:**
   - GitHub Actions triggers
   - Builds on GitHub (not VPS - avoiding CPU overload)
   - PM2 reload (zero-downtime)
   - Health checks verify deployment
   - Auto-rollback if health check fails

## PM2 Commands Reference

### Check Status
```bash
pm2 list
pm2 monit  # Real-time monitoring
```

### Logs
```bash
pm2 logs figtracker          # Production logs
pm2 logs figtracker-staging  # Staging logs
pm2 logs --lines 100         # Last 100 lines
```

### Manual Restart (if needed)
```bash
pm2 reload figtracker         # Zero-downtime restart (production)
pm2 reload figtracker-staging # Zero-downtime restart (staging)
```

### Stop/Start
```bash
pm2 stop figtracker
pm2 start figtracker

pm2 stop figtracker-staging
pm2 start figtracker-staging
```

## Troubleshooting

### Staging not accessible

```bash
# Check PM2 status
pm2 list

# Check staging is listening on port 3001
netstat -tuln | grep 3001

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Verify DNS propagation
nslookup staging.figtracker.com
```

### Deployment fails

```bash
# Check GitHub Actions logs first

# SSH to VPS and check
ssh root@187.77.202.14
pm2 logs figtracker-staging --lines 50

# Manual rollback if needed
cd /var/www/figtracker-staging
ls -la /root/staging-backup-*.tar.gz  # List backups
tar -xzf /root/staging-backup-YYYYMMDD-HHMMSS.tar.gz
pm2 reload figtracker-staging
```

### Production deployment rollback

Automatic rollback happens if health checks fail. If you need manual rollback:

```bash
ssh root@187.77.202.14
cd /var/www/figtracker

# Find recent backup
ls -lt /root/prod-backup-*.tar.gz | head -5

# Restore backup
tar -xzf /root/prod-backup-YYYYMMDD-HHMMSS.tar.gz
pm2 reload figtracker

# Verify
curl http://localhost:3000/api/health
```

## Cost Savings

**Single VPS, Two Environments:**
- Production: Port 3000
- Staging: Port 3001
- Both share same VPS resources
- No additional hosting cost
- Staging uses ~150MB RAM (negligible impact)

## Benefits Achieved

✅ **Zero-downtime deployments** - PM2 reload keeps site up during deploys  
✅ **Staging environment** - Test before production  
✅ **Automatic rollback** - Failed deployments auto-revert  
✅ **Health checks** - Deployments verified before completion  
✅ **Build on GitHub** - No more VPS CPU overload  
✅ **Backup system** - Last 5 deployments backed up automatically  

## Next Steps

1. Complete VPS setup (Steps 1-3)
2. Configure DNS (Step 4)
3. Add GitHub secrets (Step 6)
4. Create develop branch (Step 7)
5. Test staging deployment (Step 8)
6. Start developing on `develop` branch

**After setup, your workflow:**
- All development → `develop` branch → auto-deploys to staging
- Staging looks good → merge to `main` → auto-deploys to production
- Never SSH to VPS for deployments again (except emergencies)
