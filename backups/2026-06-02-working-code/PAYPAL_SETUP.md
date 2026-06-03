# PayPal Donation System Setup Guide

## ✅ What's Already Done:
- ✅ Code deployed to production
- ✅ Database migration running (Donation table being created)
- ✅ All API endpoints ready
- ✅ Frontend components live

## 🔧 What You Need To Do:

### Step 1: Create PayPal App (5 minutes)

1. Go to: https://developer.paypal.com/dashboard/
2. Log in with your PayPal Business account
3. Click **"Create App"** under "REST API apps"
4. Name it: "FigTracker Donations"
5. Select app type: **Merchant**
6. Click **"Create App"**

**Save these values:**
- Client ID: `copy from dashboard`
- Secret: `click "Show" and copy`

### Step 2: Set Up Webhook (3 minutes)

Still in the PayPal dashboard:

1. Go to your app → **"Webhooks"** tab
2. Click **"Add Webhook"**
3. Webhook URL: `https://figtracker.ericksu.com/api/paypal/webhook`
4. Event types → Click **"Select all events"** OR just select:
   - `PAYMENT.CAPTURE.COMPLETED`
5. Click **"Save"**

**Save this value:**
- Webhook ID: `copy from the webhook you just created`

### Step 3: Add Environment Variables

Add these to your `.env` file and your hosting provider (Vercel/Hostinger):

```bash
PAYPAL_CLIENT_ID=your_client_id_from_step_1
PAYPAL_CLIENT_SECRET=your_secret_from_step_1
PAYPAL_WEBHOOK_ID=your_webhook_id_from_step_2
PAYPAL_MODE=sandbox  # Use "sandbox" for testing, change to "live" when ready
```

**For Vercel/Netlify:**
- Go to Project Settings → Environment Variables
- Add all 4 variables above
- Redeploy

**For Hostinger:**
- Add to your .env file via File Manager or FTP

### Step 4: Test with Sandbox (10 minutes)

1. Make sure `PAYPAL_MODE=sandbox` in your env
2. Go to: https://www.paypal.com/donate/?business=W2LZ3TNF2X88C&no_recurring=0&currency_code=USD
3. Use PayPal Sandbox test account to donate
4. Check your server logs for: `[PayPal Webhook] Payment captured:`
5. Visit: https://figtracker.ericksu.com/claim-donation
6. Enter your test PayPal email and transaction ID
7. Set display name and opt-in
8. Check homepage for leaderboard

### Step 5: Go Live

1. Switch PayPal app from Sandbox to Live mode in dashboard
2. Update webhook URL to use live credentials
3. Change `.env`: `PAYPAL_MODE=live`
4. Redeploy
5. Make a real $1 test donation
6. Verify it appears after claiming

## 🐛 Troubleshooting

**"No donation found"**
- Check that webhook was received (look at server logs)
- Verify PayPal mode matches (sandbox vs live)
- Wait a few seconds after payment for webhook to arrive

**"Webhook not firing"**
- Verify webhook URL is correct in PayPal dashboard
- Check it's set to the right mode (sandbox vs live)
- Look for webhook delivery attempts in PayPal dashboard

**"Leaderboard not showing"**
- Make sure at least 1 donor opted-in (`showOnLeaderboard=true`)
- Check current quarter matches donation season
- Clear browser cache

## 📊 How It Works

1. User clicks "Donate via PayPal" button
2. PayPal processes payment
3. PayPal sends webhook POST to `/api/paypal/webhook`
4. Your server saves donation to database (anonymous by default)
5. PayPal redirects user to `/claim-donation` page
6. User enters email + transaction ID to verify
7. User sets display name and opts-in
8. Leaderboard updates automatically

## 🔒 Security Notes

- Webhook verification is currently disabled for easier development
- To enable: uncomment verification code in `/app/api/paypal/webhook/route.ts`
- Display names are validated (3-30 chars, alphanumeric only)
- Email + transaction ID are never shown publicly
- Only donors who opt-in appear on leaderboard

## 📅 Quarterly Reset

Leaderboard resets automatically every quarter:
- Q1: Jan-Mar
- Q2: Apr-Jun
- Q3: Jul-Sep (Current: Q2 2026)
- Q4: Oct-Dec

Old donations stay in database but don't appear on current leaderboard.

## Need Help?

Check logs at:
- Vercel: Project → Deployments → Runtime Logs
- Server: `console.log` statements in webhook/claim APIs

Look for:
- `[PayPal Webhook] Event: PAYMENT.CAPTURE.COMPLETED`
- `[PayPal Webhook] Payment captured:`
- `[PayPal Webhook] Donation recorded:`
