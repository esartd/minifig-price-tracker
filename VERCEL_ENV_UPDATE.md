# Vercel Environment Variable Update Required

## Action Needed: Update DATABASE_URL in Vercel

To enable connection pooling and prevent hourly database limits, you need to update the `DATABASE_URL` in Vercel.

### Steps:

1. Go to https://vercel.com/es-art-d-llc/figtracker/settings/environment-variables

2. Find `DATABASE_URL` and click Edit

3. Replace the current value with:
   ```
   mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker?connection_limit=5&pool_timeout=10
   ```

4. Save and redeploy

### What this does:
- `connection_limit=5` - Limits to 5 simultaneous database connections (safe for Hostinger)
- `pool_timeout=10` - Waits up to 10 seconds for an available connection before failing

### Expected result:
- No more "Taking a Quick Break" errors
- Site stays stable under load
- Users experience tiny delays (milliseconds) instead of hourly outages

---

**Delete this file after updating Vercel**
