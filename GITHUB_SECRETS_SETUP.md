# GitHub Secrets Setup

## Required GitHub Secret

You need to add **one new secret** to your GitHub repository for staging deployments.

## How to Add GitHub Secret

1. Go to your GitHub repository: https://github.com/[your-username]/figtracker
2. Click: **Settings** (top right)
3. In left sidebar, click: **Secrets and variables → Actions**
4. Click: **New repository secret**
5. Add the following secret:

### Secret Details

**Name:**
```
STAGING_DATABASE_URL
```

**Value:**
```
mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker
```

_(This is the same as production database for now. If you create a separate staging database later, update this secret.)_

6. Click: **Add secret**

## Existing Secrets (Already Configured)

These secrets should already exist in your repository:

- ✅ `VPS_HOST` = 187.77.202.14
- ✅ `VPS_USERNAME` = root
- ✅ `VPS_SSH_KEY` = (your SSH private key)
- ✅ `DATABASE_URL` = (production database)

**Do not modify these** - they're already working for production deployments.

## Verification

After adding the secret:

1. Go to: **Actions → Secrets**
2. You should see all 5 secrets listed:
   - DATABASE_URL
   - STAGING_DATABASE_URL ← NEW
   - VPS_HOST
   - VPS_SSH_KEY
   - VPS_USERNAME

## Next Steps

After adding the GitHub secret:
1. Create `develop` branch
2. Test staging deployment
3. Test production deployment

Tell me when you've added the secret and I'll continue with creating the develop branch.
