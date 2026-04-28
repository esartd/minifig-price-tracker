# Vercel Subdomain Setup for i18n

This document explains how to configure Vercel to serve FigTracker in multiple languages using subdomains.

## Overview

FigTracker uses subdomain-based internationalization:

- **English**: figtracker.ericksu.com (default)
- **German**: de.figtracker.ericksu.com
- **French**: fr.figtracker.ericksu.com
- **Spanish**: es.figtracker.ericksu.com

All subdomains serve the same Next.js application. The locale is detected server-side from the `Host` header.

## Step 1: Add Domain Aliases in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your FigTracker project
3. Navigate to **Settings** → **Domains**
4. Add the following domains one by one:
   - `de.figtracker.ericksu.com`
   - `fr.figtracker.ericksu.com`
   - `es.figtracker.ericksu.com`

For each domain:
- Click **Add**
- Enter the subdomain (e.g., `de.figtracker.ericksu.com`)
- Vercel will show DNS configuration requirements

## Step 2: Configure DNS Records

You need to add DNS records for each subdomain in your domain registrar (where ericksu.com is registered).

### For Each Subdomain

Add a **CNAME record**:

| Type  | Name | Value                | TTL  |
|-------|------|----------------------|------|
| CNAME | de   | cname.vercel-dns.com | 3600 |
| CNAME | fr   | cname.vercel-dns.com | 3600 |
| CNAME | es   | cname.vercel-dns.com | 3600 |

**Or** if your DNS provider doesn't support CNAME for subdomains, use **A records**:

| Type | Name | Value          | TTL  |
|------|------|----------------|------|
| A    | de   | 76.76.21.21    | 3600 |
| A    | fr   | 76.76.21.21    | 3600 |
| A    | es   | 76.76.21.21    | 3600 |

**Note**: Get the exact IP addresses from Vercel's domain configuration page for your project.

### DNS Propagation

- DNS changes can take 5 minutes to 48 hours to propagate
- Use [DNS Checker](https://dnschecker.org/) to verify propagation
- Vercel will automatically issue SSL certificates once DNS is verified

## Step 3: Deploy the Application

Push the current changes to trigger a Vercel deployment:

```bash
git add .
git commit -m "Add subdomain-based i18n support

- Implemented subdomain locale detection (en, de, fr, es)
- Created TranslationProvider for client-side translation access
- Added LanguageSwitcher component to header
- Translations loaded dynamically from translations-backup/ directory

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

Vercel will automatically deploy to all configured domains.

## Step 4: Verify Each Subdomain

Once DNS propagates and deployment completes, test each subdomain:

### English (Default)
```bash
curl -I https://figtracker.ericksu.com
# Should return 200 OK
```

### German
```bash
curl -I https://de.figtracker.ericksu.com
# Should return 200 OK
```

### French
```bash
curl -I https://fr.figtracker.ericksu.com
# Should return 200 OK
```

### Spanish
```bash
curl -I https://es.figtracker.ericksu.com
# Should return 200 OK
```

### Manual Browser Testing

1. **Visit each subdomain** in a browser:
   - https://figtracker.ericksu.com (English)
   - https://de.figtracker.ericksu.com (German)
   - https://fr.figtracker.ericksu.com (French)
   - https://es.figtracker.ericksu.com (Spanish)

2. **Check HTML `lang` attribute**:
   - Right-click → View Page Source
   - Should see `<html lang="en">`, `<html lang="de">`, etc.

3. **Test Language Switcher**:
   - Click globe icon in header
   - Select different language
   - Should redirect to same path on new subdomain
   - Example: `figtracker.ericksu.com/themes` → `de.figtracker.ericksu.com/themes`

4. **Verify Translations Load**:
   - Navigation menu should be translated
   - Theme descriptions should be in selected language
   - Check browser console for any translation errors

## Step 5: Update Metadata for SEO

After verifying subdomains work, update metadata to include locale-specific information.

### Add hreflang Tags

In each page's metadata:

```typescript
export async function generateMetadata() {
  return {
    alternates: {
      canonical: 'https://figtracker.ericksu.com',
      languages: {
        'en': 'https://figtracker.ericksu.com',
        'de': 'https://de.figtracker.ericksu.com',
        'fr': 'https://fr.figtracker.ericksu.com',
        'es': 'https://es.figtracker.ericksu.com',
        'x-default': 'https://figtracker.ericksu.com'
      }
    },
    openGraph: {
      locale: 'en_US', // Change based on current locale
      alternateLocale: ['de_DE', 'fr_FR', 'es_ES']
    }
  };
}
```

### Update Sitemap

Generate separate sitemaps or include all locale URLs:

```xml
<url>
  <loc>https://figtracker.ericksu.com/themes</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://figtracker.ericksu.com/themes"/>
  <xhtml:link rel="alternate" hreflang="de" href="https://de.figtracker.ericksu.com/themes"/>
  <xhtml:link rel="alternate" hreflang="fr" href="https://fr.figtracker.ericksu.com/themes"/>
  <xhtml:link rel="alternate" hreflang="es" href="https://es.figtracker.ericksu.com/themes"/>
</url>
```

## Step 6: Monitor Analytics

After deployment, monitor Google Analytics for:

- Traffic distribution across locales
- User engagement by language
- Conversion rates per locale
- Browser language vs subdomain usage

## Troubleshooting

### Subdomain Shows 404

**Cause**: DNS not propagated or domain not added in Vercel

**Fix**:
1. Check DNS records are correct
2. Verify domain is added in Vercel dashboard
3. Wait for DNS propagation (up to 48 hours)
4. Check Vercel deployment logs

### SSL Certificate Pending

**Cause**: DNS not fully propagated

**Fix**:
1. Wait for DNS propagation
2. Vercel will automatically issue certificates once verified
3. Can take up to 24 hours

### Translations Not Loading

**Cause**: Translation files missing or locale detection failing

**Fix**:
1. Verify translations exist: `translations-backup/{locale}.json`
2. Check server logs for import errors
3. Test locale detection: `console.log(locale)` in `app/layout.tsx`

### Language Switcher Redirects to Wrong Domain

**Cause**: `getLocaleUrl()` function in `lib/i18n-subdomain.ts` has wrong URLs

**Fix**:
1. Update `subdomains` object with correct production URLs
2. Ensure function uses HTTPS protocol
3. Test manually: click language switcher, check browser address bar

### Mixed Content Warnings

**Cause**: Hard-coded HTTP links instead of HTTPS

**Fix**:
1. Search codebase for `http://figtracker.ericksu.com`
2. Replace with `https://` or use relative URLs
3. Check external resources (images, fonts, APIs)

## Rollback Plan

If subdomains cause issues:

1. Remove subdomain DNS records
2. Remove subdomain domains from Vercel
3. Revert code to before i18n implementation:
   ```bash
   git revert HEAD~3..HEAD
   git push
   ```

English site at `figtracker.ericksu.com` will continue working unchanged.

## Future Enhancements

After initial deployment is stable:

1. **Auto-detect browser language**: Redirect root domain to preferred locale subdomain
2. **Locale-specific content**: Show region-specific LEGO availability
3. **User preference persistence**: Remember selected language in cookie/session
4. **More languages**: Add Italian, Portuguese, Dutch, Polish
5. **Translation management**: Integrate Lokalise or Crowdin for easier updates

## Resources

- [Vercel Custom Domains Documentation](https://vercel.com/docs/projects/domains)
- [Google's Multilingual Sites Guide](https://developers.google.com/search/docs/specialty/international)
- [hreflang Best Practices](https://ahrefs.com/blog/hreflang-tags/)
- [FigTracker i18n Implementation](lib/i18n-subdomain.ts)

---

**Last Updated**: April 28, 2026  
**Author**: Claude Sonnet 4.5
