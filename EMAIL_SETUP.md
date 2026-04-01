# Email Setup Guide (Resend)

Your forgot password and welcome emails are now set up! To enable email sending, follow these steps:

## 1. Sign Up for Resend (Free)

1. Go to [resend.com](https://resend.com)
2. Click "Start Building" or "Sign Up"
3. Sign up with your email or GitHub
4. **Free tier includes:**
   - 3,000 emails per month
   - 100 emails per day
   - No credit card required

## 2. Get Your API Key

1. After signing in, go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name like "Minifig Price Tracker"
4. Select permissions: **"Sending access"**
5. Click "Add"
6. **Copy the API key** (starts with `re_`)

## 3. Add to Your .env File

Open your `.env.local` file and add:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=onboarding@resend.dev
NEXTAUTH_URL=http://localhost:3000
```

**For development:** You can use `onboarding@resend.dev` as the sender (Resend test domain)

**For production:** Add your own domain in Resend:
1. Go to [Domains](https://resend.com/domains) in Resend
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records to your domain registrar
5. Wait for verification (usually 5-10 minutes)
6. Update `EMAIL_FROM` to `noreply@yourdomain.com`

## 4. Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart:
npm run dev
```

## 5. Test It!

1. Go to [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)
2. Click "Forgot?" link
3. Enter your email
4. Check your inbox for the reset email
5. Click the link and set a new password

## What's Included

### ✅ Password Reset Emails
- Users can request a password reset
- Reset link expires in 1 hour
- Beautiful HTML email template

### ✅ Welcome Emails
- Sent when users sign up
- Includes link to start searching

### 🔒 Security Features
- Reset tokens are cryptographically secure
- Tokens expire after 1 hour
- Used tokens are immediately deleted
- Email addresses aren't revealed (security best practice)

## Troubleshooting

### Emails not sending?
1. Check your `.env.local` has `RESEND_API_KEY` set
2. Make sure you restarted the dev server after adding the key
3. Check the terminal/console for errors
4. Verify your API key is active in Resend dashboard

### Reset link not working?
- Links expire after 1 hour
- Each link can only be used once
- Request a new reset if needed

### Want to use a different email service?
You can replace Resend with:
- **SendGrid** - [sendgrid.com](https://sendgrid.com)
- **Postmark** - [postmarkapp.com](https://postmarkapp.com)  
- **Nodemailer with Gmail** - Requires app password setup

Just update `/lib/email.ts` with the new provider's SDK.

---

## Production Checklist

Before deploying to production:

- [ ] Add your custom domain to Resend
- [ ] Verify domain DNS records
- [ ] Update `EMAIL_FROM` to your domain
- [ ] Set `NEXTAUTH_URL` to your production URL
- [ ] Test password reset flow in production
- [ ] Monitor email delivery in Resend dashboard
