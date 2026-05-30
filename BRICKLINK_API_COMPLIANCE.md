# BrickLink API Compliance Checklist

**Status**: ✅ COMPLIANT - Ready for public launch

This document verifies FigTracker's compliance with [BrickLink API Terms of Use](https://www.bricklink.com/v3/api.page?page=terms).

## Required Elements

### 1. Cache Duration (Section 1)
✅ **COMPLIANT**
- **Requirement**: "You must not display item Content or product information and/or images which is more than six hours older than such information is on the Website."
- **Implementation**: 
  - `MinifigCache`: 6 hour expiration ([lib/bricklink.ts:252](lib/bricklink.ts#L252))
  - `PriceCache`: 6 hour expiration ([lib/bricklink.ts:356](lib/bricklink.ts#L356))
  - Both enforce automatic refresh via database `expires_at` checks

### 2. Rate Limiting (Section 1)
✅ **COMPLIANT**
- **Requirement**: "You must not make more than 5,000 calls per day."
- **Implementation**: 
  - Hard limit enforced via `ApiCallTracker` table ([lib/bricklink.ts:61](lib/bricklink.ts#L61))
  - 3-second minimum delay between requests ([lib/bricklink.ts:71](lib/bricklink.ts#L71))
  - Throws error at 5,000 calls with clear message
  - Warns at 90% threshold (4,500 calls)

### 3. Privacy Policy (Section 2)
✅ **COMPLIANT**
- **Requirement**: "You must provide a privacy policy and contact information."
- **Implementation**: 
  - Privacy policy at `/privacy` ([app/privacy/page.tsx](app/privacy/page.tsx))
  - Contact email: hello@ericksu.com (displayed on privacy page)
  - Footer links to privacy policy ([components/Footer.tsx:35](components/Footer.tsx#L35))

### 4. Attribution Notice (Section 2)
✅ **COMPLIANT**
- **Requirement**: "You must display the attribution notice on all pages that display BrickLink content."
- **Exact wording required**: "The term 'BrickLink' is a trademark of the LEGO Group BrickLink..."
- **Implementation**: 
  - Displayed in site footer on every page ([components/Footer.tsx:63-86](components/Footer.tsx#L63-L86))
  - Exact required text matches API Terms
  - Includes BrickLink.com hyperlink as required
  - Includes LEGO® trademark notice

### 5. No Checkout Replication (Section 4)
✅ **COMPLIANT**
- **Requirement**: "You must not replicate BrickLink's checkout or ordering process."
- **Implementation**: 
  - No checkout functionality
  - No order placement features
  - External links to Amazon Associates only (no BrickLink store integration)

### 6. Prohibited Uses (Section 6)
✅ **COMPLIANT**
- ✅ Not competing directly with BrickLink marketplace
- ✅ Not scraping or systematically downloading entire catalog
- ✅ Not using data for price manipulation
- ✅ Not creating automated buying/selling bots
- ✅ Not reselling API access

### 7. Commercial Use Allowance (Section 5)
✅ **COMPLIANT**
- **Allowed**: "You may display advertising on your Application."
- **Implementation**: Amazon Associates affiliate links comply with this allowance

## Monitoring

To verify continued compliance:

```bash
# Check today's API call count
psql $DATABASE_URL -c "SELECT * FROM \"ApiCallTracker\" WHERE date = CURRENT_DATE;"

# Check cache expiration times (should all be < 6 hours from cached_at)
psql $DATABASE_URL -c "SELECT minifigure_no, cached_at, expires_at, 
  EXTRACT(EPOCH FROM (expires_at - cached_at))/3600 as hours_until_expiry 
  FROM \"MinifigCache\" ORDER BY cached_at DESC LIMIT 10;"

# Verify attribution is present in footer
curl https://figtracker.ericksu.com | grep "BrickLink is a trademark of the LEGO Group BrickLink"
```

## Critical Files

Files containing BrickLink API compliance logic:
- [lib/bricklink.ts](lib/bricklink.ts) - API client with rate limiting and caching
- [components/Footer.tsx](components/Footer.tsx) - Attribution notice
- [app/privacy/page.tsx](app/privacy/page.tsx) - Privacy policy
- [prisma/schema.prisma](prisma/schema.prisma) - Database models for cache and rate tracking

## Compliance Fixes Applied (2026-04-16)

Before public launch, corrected critical violations:

1. **MinifigCache duration**: Changed from 30 days → 6 hours
2. **PriceCache duration**: Changed from 7 days → 6 hours  
3. **Attribution text**: Added "BrickLink" to match exact required wording

All violations resolved. Site is ready for public launch.
