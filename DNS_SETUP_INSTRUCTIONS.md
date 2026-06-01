# DNS Setup Instructions for Staging

## ⚠️ Manual Step Required

I've completed the VPS setup, but **you need to add the DNS record** for staging.figtracker.com.

## How to Add DNS Record

### Option 1: Cloudflare (if you use Cloudflare)

1. Log in to Cloudflare: https://dash.cloudflare.com
2. Select your domain: **ericksu.com**
3. Go to: **DNS → Records**
4. Click: **Add record**
5. Add these settings:
   - **Type:** `A`
   - **Name:** `staging.figtracker`
   - **IPv4 address:** `187.77.202.14`
   - **Proxy status:** Orange cloud (Proxied) or Grey cloud (DNS only)
   - **TTL:** Auto
6. Click: **Save**

### Option 2: Hostinger (if DNS is with Hostinger)

1. Log in to Hostinger: https://hpanel.hostinger.com
2. Go to: **Domains**
3. Select: **ericksu.com**
4. Go to: **DNS / Name Servers**
5. Click: **Add Record**
6. Add these settings:
   - **Type:** `A`
   - **Name:** `staging.figtracker`
   - **Points to:** `187.77.202.14`
   - **TTL:** 3600 (or default)
7. Click: **Add Record**

### Option 3: Other DNS Provider

Add an A record:
- **Host/Name:** `staging.figtracker`
- **Type:** `A`
- **Value/Points to:** `187.77.202.14`
- **TTL:** 3600 seconds (1 hour)

## After Adding DNS Record

Wait 5-10 minutes for DNS propagation, then test:

```bash
# Check DNS propagation
nslookup staging.figtracker.ericksu.com

# Should return:
# Name: staging.figtracker.ericksu.com
# Address: 187.77.202.14

# Test staging site
curl -I https://staging.figtracker.ericksu.com
```

## What's Already Done ✅

- ✅ Staging directory created on VPS
- ✅ Staging app running on port 3001
- ✅ PM2 configured for staging
- ✅ Nginx configured to route staging subdomain
- ✅ SSL certificate (wildcard already covers staging)

## What You Need to Do

1. **Add DNS record** (instructions above)
2. **Wait 5-10 minutes** for DNS propagation
3. **Tell me when done** - I'll continue with GitHub secrets and develop branch

## Verification

Once DNS is configured, visit: **https://staging.figtracker.ericksu.com**

You should see FigTracker running (same as production for now).
