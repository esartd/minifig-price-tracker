# Hostinger Cron Job Setup

Run these cron jobs from Hostinger to avoid Vercel Hobby plan limits.

## Prerequisites
1. Get your CRON_SECRET from Vercel environment variables
2. Replace `https://your-site.vercel.app` with your actual domain

## Cron Jobs to Add in Hostinger cPanel

```bash
# Every 6 hours - Refresh pricing (keeps collections fresh)
0 */6 * * * curl -X GET "https://your-site.vercel.app/api/cron/refresh-prices" -H "Authorization: Bearer YOUR_CRON_SECRET" > /dev/null 2>&1

# Daily 2 AM - Record price history
0 2 * * * curl -X GET "https://your-site.vercel.app/api/cron/price-history" -H "Authorization: Bearer YOUR_CRON_SECRET" > /dev/null 2>&1

# Daily 4 AM - Backup database
0 4 * * * curl -X GET "https://your-site.vercel.app/api/cron/backup-database" -H "Authorization: Bearer YOUR_CRON_SECRET" > /dev/null 2>&1

# 1st & 15th of month, 2 AM - Check catalog changes
0 2 1,15 * * curl -X GET "https://your-site.vercel.app/api/cron/check-catalog-changes" -H "Authorization: Bearer YOUR_CRON_SECRET" > /dev/null 2>&1

# 1st & 15th of month, 2:30 AM - Download catalogs
30 2 1,15 * * curl -X GET "https://your-site.vercel.app/api/cron/download-catalogs" -H "Authorization: Bearer YOUR_CRON_SECRET" > /dev/null 2>&1

# 1st & 15th of month, 3 AM - Update catalog
0 3 1,15 * * curl -X GET "https://your-site.vercel.app/api/cron/update-catalog" -H "Authorization: Bearer YOUR_CRON_SECRET" > /dev/null 2>&1
```

## How to Set Up in Hostinger

### Option 1: cPanel (Recommended)
1. Log in to Hostinger cPanel
2. Go to "Advanced" → "Cron Jobs"
3. Add each cron job with the schedule and command above
4. Replace `YOUR_CRON_SECRET` with actual value from Vercel

### Option 2: SSH
1. SSH into Hostinger: `ssh username@your-hostinger-server.com`
2. Edit crontab: `crontab -e`
3. Paste all cron jobs (with secrets replaced)
4. Save and exit

## Verify It's Working

Check Vercel logs for successful cron calls from Hostinger's IP address.
