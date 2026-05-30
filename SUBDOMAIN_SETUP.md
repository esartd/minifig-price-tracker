# Subdomain Setup Guide for FigTracker (10 Languages)

Your site uses **subdomain-based i18n routing** where each language has its own subdomain:

- `figtracker.ericksu.com` → English (default)
- `de.figtracker.ericksu.com` → German
- `fr.figtracker.ericksu.com` → French
- `es.figtracker.ericksu.com` → Spanish
- `it.figtracker.ericksu.com` → Italian
- `nl.figtracker.ericksu.com` → Dutch
- `pl.figtracker.ericksu.com` → Polish
- `pt.figtracker.ericksu.com` → Portuguese
- `sv.figtracker.ericksu.com` → Swedish
- `ja.figtracker.ericksu.com` → Japanese

---

## Step 1: Configure DNS Records (Hostinger)

Go to **Hostinger Control Panel → DNS Zone Editor** for `ericksu.com`

### Add 9 CNAME Records (One for Each Language Subdomain)

| Type | Name | Points To | TTL |
|------|------|-----------|-----|
| CNAME | `de.figtracker` | `cname.vercel-dns.com.` | 14400 |
| CNAME | `fr.figtracker` | `cname.vercel-dns.com.` | 14400 |
| CNAME | `es.figtracker` | `cname.vercel-dns.com.` | 14400 |
| CNAME | `it.figtracker` | `cname.vercel-dns.com.` | 14400 |
| CNAME | `nl.figtracker` | `cname.vercel-dns.com.` | 14400 |
| CNAME | `pl.figtracker` | `cname.vercel-dns.com.` | 14400 |
| CNAME | `pt.figtracker` | `cname.vercel-dns.com.` | 14400 |
| CNAME | `sv.figtracker` | `cname.vercel-dns.com.` | 14400 |
| CNAME | `ja.figtracker` | `cname.vercel-dns.com.` | 14400 |

**Note:** Your main domain `figtracker.ericksu.com` should already be configured (A record or CNAME).

### Example Hostinger DNS Configuration:

```
Record Type: CNAME
Name: de.figtracker
Target: cname.vercel-dns.com
TTL: 14400 (Automatic)

Record Type: CNAME
Name: fr.figtracker
Target: cname.vercel-dns.com
TTL: 14400 (Automatic)

... (repeat for all 9 subdomains)
```

---

## Step 2: Configure Vercel Domains

Go to **Vercel Dashboard → Your Project → Settings → Domains**

### Add All 10 Domains

Click "Add Domain" and enter each domain:

1. `figtracker.ericksu.com` (should already exist)
2. `de.figtracker.ericksu.com`
3. `fr.figtracker.ericksu.com`
4. `es.figtracker.ericksu.com`
5. `it.figtracker.ericksu.com`
6. `nl.figtracker.ericksu.com`
7. `pl.figtracker.ericksu.com`
8. `pt.figtracker.ericksu.com`
9. `sv.figtracker.ericksu.com`
10. `ja.figtracker.ericksu.com`

For each domain:
- Vercel will verify DNS configuration
- Automatically provision SSL certificates
- All domains point to same deployment (Next.js middleware handles locale routing)

---

## Step 3: Deploy Updated Code

The following files have been created/updated:

1. **`middleware.ts`** - Detects subdomain and sets locale
2. **`lib/i18n-subdomain.ts`** - Contains all 10 locale configurations
3. **Translation files:**
   - `translations-backup/it.json` (Italian)
   - `translations-backup/nl.json` (Dutch)
   - `translations-backup/pl.json` (Polish)
   - `translations-backup/pt.json` (Portuguese)
   - `translations-backup/sv.json` (Swedish)
   - `translations-backup/ja.json` (Japanese)

### Deploy to Vercel:

```bash
git add middleware.ts SUBDOMAIN_SETUP.md
git commit -m "Add middleware for subdomain i18n routing"
git push origin main
```

Vercel will automatically deploy the changes.

---

## Step 4: Verify Setup

### DNS Propagation Check (5-30 minutes)

Check if DNS records are propagated:

```bash
# Check each subdomain
dig de.figtracker.ericksu.com
dig fr.figtracker.ericksu.com
dig it.figtracker.ericksu.com
# ... etc
```

Should return CNAME pointing to `cname.vercel-dns.com`

### Test Each Language Subdomain

Visit each URL and verify:
- ✅ Page loads without errors
- ✅ Content is in correct language
- ✅ SSL certificate is valid (https)
- ✅ No redirect loops

**Test URLs:**
- https://figtracker.ericksu.com (English)
- https://de.figtracker.ericksu.com (German - "Suche" button)
- https://fr.figtracker.ericksu.com (French - "Rechercher" button)
- https://es.figtracker.ericksu.com (Spanish - "Buscar" button)
- https://it.figtracker.ericksu.com (Italian - "Cerca" button)
- https://nl.figtracker.ericksu.com (Dutch - "Zoeken" button)
- https://pl.figtracker.ericksu.com (Polish - "Szukaj" button)
- https://pt.figtracker.ericksu.com (Portuguese - "Pesquisar" button)
- https://sv.figtracker.ericksu.com (Swedish - "Sök" button)
- https://ja.figtracker.ericksu.com (Japanese - "検索" button)

---

## Troubleshooting

### Issue: "Domain not found" or 404 errors

**Solution:**
1. Verify CNAME records are added in Hostinger DNS
2. Wait 5-30 minutes for DNS propagation
3. Clear browser cache and try again

### Issue: SSL certificate errors

**Solution:**
- Vercel automatically provisions SSL, but takes 5-10 minutes after DNS verification
- Check Vercel Dashboard → Domains → Certificate status should be "Active"

### Issue: Wrong language displays

**Solution:**
- Check `middleware.ts` is deployed (should be in Vercel deployment logs)
- Verify `lib/i18n-subdomain.ts` has correct subdomain mappings
- Clear browser cache

### Issue: Some text still in English

**Solution:**
- Translation files use fallback behavior - if key is missing, shows English
- Check translation file has the key: `jq '.common.search' translations-backup/it.json`
- Should return translated text, not "Search"

---

## Quick Setup Checklist

- [ ] Add 9 CNAME records in Hostinger DNS
- [ ] Add 10 domains in Vercel dashboard
- [ ] Wait for DNS propagation (5-30 min)
- [ ] Deploy code with middleware.ts
- [ ] Verify SSL certificates provisioned
- [ ] Test all 10 language URLs
- [ ] Check search button text in each language

---

## Architecture Overview

```
User visits de.figtracker.ericksu.com
         ↓
DNS → Vercel Edge Network
         ↓
Next.js Middleware (middleware.ts)
         ↓
Detects hostname: "de.figtracker.ericksu.com"
         ↓
getLocaleFromHost() → returns "de"
         ↓
Sets header: x-locale = "de"
         ↓
Server components read locale
         ↓
Load translations: translations-backup/de.json
         ↓
Render page in German
```

All 10 domains point to the **same Next.js deployment**. The middleware dynamically detects which language to serve based on the subdomain.

---

## Support Resources

- **Next.js i18n:** https://nextjs.org/docs/app/building-your-application/routing/internationalization
- **Vercel Custom Domains:** https://vercel.com/docs/projects/domains
- **Hostinger DNS Management:** https://support.hostinger.com/en/articles/1696791-how-to-use-dns-zone-editor

---

## Production Checklist

Before announcing new languages:

1. ✅ All translation files complete (1697+ lines each)
2. ✅ DNS records configured for all subdomains
3. ✅ Vercel domains added and verified
4. ✅ SSL certificates active
5. ✅ Middleware deployed
6. ✅ Test each subdomain loads correctly
7. ✅ Verify SEO meta tags translate properly
8. ✅ Test user flows (search, login, collection) in each language
9. ✅ Update sitemap.xml to include all language subdomains
10. ✅ Add hreflang tags for SEO

---

**Last Updated:** 2026-05-18
**Status:** Ready for DNS configuration
