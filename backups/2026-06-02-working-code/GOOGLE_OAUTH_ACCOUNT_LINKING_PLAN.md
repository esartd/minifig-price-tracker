# Google OAuth & Account Linking Implementation Plan

**Project:** FigTracker  
**Date:** June 1, 2026  
**Status:** Planning Phase - For Review  

---

## Executive Summary

Restore Google OAuth authentication with proper account linking functionality. Users should be able to:
1. Sign up with Google (new users)
2. Sign in with Google (returning Google users)
3. Link their existing email/password account to Google
4. Sign in with either method after linking

---

## Current State Analysis

### What Exists Today

**Authentication System:**
- NextAuth v5 with Credentials provider (email/password only)
- Database schema is OAuth-ready (`Account` model exists)
- Sign-in page: `/app/auth/signin/page.tsx`
- Sign-up page: `/app/auth/signup/page.tsx`
- Auth config: `/auth.ts`

**Previous Implementation (Removed):**
- Google OAuth was coded in commit `7bd7c98` (May 28, 2026)
- Accidentally deleted in commit `1860324` (May 29, 2026) during repo cleanup
- Components that were removed:
  - `components/auth/GoogleButton.tsx` - Google sign-in button
  - `components/auth/DividerOr.tsx` - Visual separator
  - `lib/auth/urlError.ts` - Error message helper

**Database Schema:**
```prisma
model Account {
  userId            String
  type              String
  provider          String         // "google" or "credentials"
  providerAccountId String         // Google user ID
  refresh_token     String?
  access_token      String?
  // ... OAuth tokens
  User              User @relation(fields: [userId], references: [id])
  @@id([provider, providerAccountId])
}

model User {
  id       String
  email    String @unique
  password String?  // Nullable - Google users won't have password
  Account  Account[]
  // ... other fields
}
```

### What Was Missing in Previous Implementation

**Critical Gap: No Account Linking**
- Previous code showed error: "That Google account is not linked to an existing user"
- Users with email/password accounts couldn't link Google
- No UI for managing connected accounts

---

## Goals & Requirements

### Must Have
1. ✅ New users can sign up with Google
2. ✅ Google users can sign in with Google
3. ✅ **Email/password users can link Google to their account**
4. ✅ After linking, users can sign in with either method
5. ✅ Error handling for edge cases
6. ✅ Security: No unauthorized account takeovers

### Nice to Have
7. Account settings page showing connected accounts
8. Ability to unlink Google account (if password exists)
9. Email verification for OAuth accounts
10. Apple Sign In (future)

### Out of Scope
- Guest mode (separate feature)
- Magic link authentication
- Two-factor authentication

---

## Technical Approach: Three Options

### Option 1: Automatic Account Linking (Recommended)

**How it works:**
- Enable `allowDangerousEmailAccountLinking: true` in NextAuth
- When user signs in with Google, NextAuth automatically:
  - Checks if email exists in User table
  - If yes: Creates Account record, links to existing User
  - If no: Creates new User + Account record

**Pros:**
✅ Zero user friction - works automatically  
✅ Simple implementation - one config flag  
✅ No UI changes needed  
✅ Works immediately for existing users  

**Cons:**
⚠️ Security risk: If attacker gains access to Google account with victim's email, they get app access  
⚠️ Called "dangerous" by NextAuth (but common in industry)  

**When it's safe:**
- Google accounts require email verification (we check `email_verified: true`)
- Most users use same email for Google and app
- Risk is low if users have strong Google account security

---

### Option 2: Manual Account Linking via Settings Page

**How it works:**
1. User signs in with email/password
2. Goes to Account Settings → "Connected Accounts"
3. Clicks "Link Google Account"
4. OAuth flow completes, creates Account record
5. Future logins work with Google or password

**Pros:**
✅ Explicit user consent - no surprises  
✅ No security concerns - user controls linking  
✅ Clear UI showing which accounts are linked  
✅ Can add "Unlink" functionality  

**Cons:**
❌ More development work (new UI, API routes)  
❌ User friction - requires extra steps  
❌ Existing users won't discover it automatically  
❌ Doesn't solve "I forgot my password, can I use Google?" case  

**Implementation Requirements:**
- New page: `/app/account/connected-accounts/page.tsx`
- New API: `/app/api/auth/link-google/route.ts`
- New API: `/app/api/auth/unlink-google/route.ts`
- Session management: Check if already linked

---

### Option 3: Hybrid Approach (Best of Both)

**How it works:**
1. Enable automatic linking (Option 1)
2. Add Account Settings UI (Option 2) to show status
3. Allow unlinking (only if password is set)

**Pros:**
✅ Frictionless for users  
✅ Transparent - users see what's linked  
✅ Safeguard - can unlink if needed  

**Cons:**
❌ More work than Option 1  
❌ Still has "dangerous" flag enabled  

---

## Recommended Solution: Option 1 (Automatic Linking)

**Rationale:**
1. **Industry Standard:** GitHub, Twitter, LinkedIn all use automatic linking
2. **User Expectation:** Users expect clicking "Continue with Google" to log them into their existing account, not create a duplicate
3. **Google's Security:** We verify `email_verified: true` before allowing sign-in - Google guarantees email ownership
4. **User Experience:** Removes friction - "it just works"
5. **Support Burden:** Prevents "Account already exists" confusion and duplicate account issues
6. **Migration Path:** Existing users immediately benefit

**ChatGPT Review Feedback (June 1, 2026):**
✅ Automatic linking with verified emails is UX best practice
✅ Security is strong when email verification is enforced
✅ Rating: UX 9.5/10, Security 8.5/10, Complexity 9/10
⚠️ Must show success message after automatic linking
⚠️ Skip Account Settings UI initially - focus on core feature

**Risk Mitigation:**
- ✅ **CRITICAL:** Only allow verified Google emails (`email_verified: true`)
- ✅ Log all account linking events for audit trail
- ✅ **NEW:** Show success message: "Welcome back! We linked your Google account to your existing FigTracker account"
- ✅ Monitor for suspicious activity (multiple accounts linked to same Google ID)

---

## Implementation Plan

### Phase 1: Core Google OAuth (Week 1)

#### Step 1: Restore Components
**Files to Create:**
- `components/auth/GoogleButton.tsx` - Google sign-in button with loading state
- `components/auth/DividerOr.tsx` - Visual separator between Google and email
- `lib/auth/urlError.ts` - Friendly error messages for OAuth failures

**From Git History:**
```bash
git show 7bd7c98:components/auth/GoogleButton.tsx
git show 7bd7c98:components/auth/DividerOr.tsx
git show 7bd7c98:lib/auth/urlError.ts
```

#### Step 2: Update NextAuth Config
**File:** `auth.ts`

**Changes:**
```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  
  // KEY CHANGE: Enable automatic account linking
  allowDangerousEmailAccountLinking: true,
  
  providers: [
    // Add Google provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Keep existing Credentials provider
    Credentials({
      // ... existing code
    })
  ],
  
  pages: {
    signIn: '/auth/signin',
  },
  
  session: {
    strategy: "jwt"
  },
  
  callbacks: {
    // CRITICAL: Verify Google email before allowing sign-in
    // This is the security foundation for automatic account linking
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        const googleProfile = profile as { email_verified?: boolean }
        
        // MUST verify email - Google guarantees email ownership
        if (!googleProfile.email_verified) {
          console.error('Google sign-in blocked: email not verified', profile?.email)
          return false // Block unverified emails
        }
        
        // Check if this is an account linking event (existing user + new Google account)
        if (user?.email) {
          const existingAccounts = await prisma.account.findMany({
            where: { userId: user.id }
          })
          
          const hasGoogleAccount = existingAccounts.some(acc => acc.provider === 'google')
          const hasCredentialsAccount = existingAccounts.some(acc => acc.provider === 'credentials')
          
          // If user had credentials but no Google, this is a linking event
          if (hasCredentialsAccount && !hasGoogleAccount) {
            console.log('Account linking occurred:', user.email, 'linked Google account')
            // The PrismaAdapter will create the Account record automatically
          }
        }
      }
      return true
    },
    
    // ENHANCED: Load user data from database on sign-in
    async jwt({ token, user, trigger, session, account }) {
      // On initial sign in (OAuth or credentials)
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            preferredCurrency: true,
            preferredCountryCode: true,
            preferredRegion: true,
            currencySymbol: true,
            locale: true,
          }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          token.name = dbUser.name
          token.picture = dbUser.image
          token.preferredCurrency = dbUser.preferredCurrency
          token.preferredCountryCode = dbUser.preferredCountryCode
          token.preferredRegion = dbUser.preferredRegion
          token.currencySymbol = dbUser.currencySymbol
          token.locale = dbUser.locale
        }
      }
      
      // Handle session updates (avatar, preferences)
      if (trigger === "update") {
        if (session?.image) {
          token.picture = session.image
        }
        if (session?.preferredCurrency !== undefined) {
          token.preferredCurrency = session.preferredCurrency
          token.preferredCountryCode = session.preferredCountryCode
          token.preferredRegion = session.preferredRegion
          token.currencySymbol = session.currencySymbol
          token.locale = session.locale
        }
      }
      
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.preferredCurrency = token.preferredCurrency as string
        session.user.preferredCountryCode = token.preferredCountryCode as string
        session.user.preferredRegion = token.preferredRegion as string
        session.user.currencySymbol = token.currencySymbol as string
        session.user.locale = token.locale as string
      }
      return session
    }
  }
})
```

#### Step 3: Get Google OAuth Credentials
**Process:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "FigTracker Production"
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://figtracker.net/api/auth/callback/google` (production)
     - `https://*.figtracker.net/api/auth/callback/google` (subdomains for i18n)
5. Copy Client ID and Client Secret

**Environment Variables:**
```bash
# .env.local
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# For production (add to Hostinger or deployment platform)
GOOGLE_CLIENT_ID=production-client-id
GOOGLE_CLIENT_SECRET=production-client-secret
```

#### Step 4: Add Account Linking Detection
**File:** `lib/auth/detect-account-linking.ts`

**Purpose:** Detect when automatic account linking occurred and show success message

```typescript
import { prisma } from '@/lib/prisma'

export async function wasAccountJustLinked(userId: string): Promise<boolean> {
  const googleAccount = await prisma.account.findFirst({
    where: { 
      userId,
      provider: 'google'
    },
    orderBy: { createdAt: 'desc' }
  })
  
  if (!googleAccount) return false
  
  // Check if Google account was created in the last 10 seconds
  const tenSecondsAgo = new Date(Date.now() - 10000)
  const wasJustCreated = googleAccount.createdAt > tenSecondsAgo
  
  if (!wasJustCreated) return false
  
  // Check if user also has credentials account (indicates linking, not new user)
  const credentialsAccount = await prisma.account.findFirst({
    where: { 
      userId,
      provider: 'credentials'
    }
  })
  
  return !!credentialsAccount
}
```

#### Step 5: Update Sign-In Page
**File:** `app/auth/signin/page.tsx`

**Changes:**
```typescript
import { GoogleButton } from '@/components/auth/GoogleButton';
import { DividerOr } from '@/components/auth/DividerOr';
import { getFriendlyAuthError } from '@/lib/auth/urlError';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const linked = searchParams.get('linked'); // NEW: Check if account was just linked
  
  // Check for OAuth errors from URL
  const urlError = searchParams.get('error');
  const friendlyError = getFriendlyAuthError(urlError);
  
  return (
    <AuthLayout>
      {/* NEW: Show success message for account linking */}
      {linked === 'true' && (
        <MessageAlert 
          type="success" 
          message="Welcome back! We linked your Google account to your existing FigTracker account." 
        />
      )}
      
      {/* Show OAuth errors */}
      {friendlyError && <MessageAlert type="error" message={friendlyError} />}
      
      {/* Google Sign-In Button */}
      <GoogleButton 
        text={t('auth.signin.continueWithGoogle') || 'Continue with Google'} 
        callbackUrl={callbackUrl}
      />
      
      <DividerOr />
      
      {/* Existing email/password form */}
      <form onSubmit={handleSubmit}>
        {/* ... existing form ... */}
      </form>
    </AuthLayout>
  );
}
```

#### Step 6: Add Callback Handler
**File:** `app/auth/callback/page.tsx` (NEW)

**Purpose:** Detect account linking after OAuth redirect and show success message

```typescript
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { wasAccountJustLinked } from '@/lib/auth/detect-account-linking'

export default async function AuthCallback({
  searchParams
}: {
  searchParams: { callbackUrl?: string }
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    // No session, redirect to sign-in
    redirect('/auth/signin')
  }
  
  // Check if account linking just occurred
  const linked = await wasAccountJustLinked(session.user.id)
  
  const callbackUrl = searchParams.callbackUrl || '/'
  
  if (linked) {
    // Redirect with success message parameter
    redirect(`${callbackUrl}?account_linked=true`)
  } else {
    // Normal redirect
    redirect(callbackUrl)
  }
}
```

#### Step 7: Update Layout to Show Success Toast
**File:** `app/layout.tsx` or `components/AccountLinkedToast.tsx`

**Purpose:** Show a toast notification when `?account_linked=true` is in URL

```typescript
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function AccountLinkedToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    if (searchParams.get('account_linked') === 'true') {
      setShow(true)
      
      // Remove query param from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('account_linked')
      router.replace(url.pathname + url.search)
      
      // Auto-hide after 5 seconds
      setTimeout(() => setShow(false), 5000)
    }
  }, [searchParams, router])
  
  if (!show) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#10b981',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Account Linked!</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Your Google account is now connected to FigTracker.
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### Step 8: Update Sign-Up Page
**File:** `app/auth/signup/page.tsx`

**Same changes as sign-in page - add Google button before email form**

#### Step 9: Add Translation Keys
**Files:** `translations/en.json`, `translations/de.json`, etc.

**Add:**
```json
{
  "auth": {
    "signin": {
      "continueWithGoogle": "Continue with Google",
      "continueWithEmail": "Continue with Email"
    },
    "signup": {
      "continueWithGoogle": "Sign up with Google",
      "signupWithEmail": "Sign up with Email"
    }
  }
}
```

---

### Phase 2: Testing & Validation (Week 1)

#### Test Cases

**Test 1: New User Sign-Up with Google**
1. Visit `/auth/signup`
2. Click "Sign up with Google"
3. Complete Google OAuth
4. Verify: User record created
5. Verify: Account record created with provider="google"
6. Verify: No password field set
7. Verify: Redirected to home page with session

**Test 2: Existing Google User Sign-In**
1. User from Test 1 signs out
2. Visit `/auth/signin`
3. Click "Continue with Google"
4. Verify: Signs in successfully
5. Verify: Session restored with correct user data

**Test 3: Account Linking (Key Test)**
1. Create account with email/password: `test@example.com`
2. Sign out
3. Click "Continue with Google"
4. Sign in with Google using same email: `test@example.com`
5. Verify: No error shown
6. Verify: Signed in successfully
7. Verify database:
   - User record unchanged
   - NEW Account record created with provider="google"
   - User now has 2 Account records (credentials + google)

**Test 4: Sign In After Linking**
1. User from Test 3 signs out
2. Can sign in with email/password ✓
3. Can sign in with Google ✓
4. Both methods access same user data ✓

**Test 5: Unverified Google Email**
1. Mock Google profile with `email_verified: false`
2. Attempt sign-in
3. Verify: Blocked with error message

**Test 6: Error Handling**
1. User denies Google permissions
2. Verify: Shows friendly error message
3. Google OAuth fails (network error)
4. Verify: Shows generic error, doesn't crash

**Test 7: Multiple Languages**
1. Test German subdomain: `de.figtracker.net`
2. Google button shows German text
3. OAuth redirect works correctly
4. Callback URL preserves subdomain

**Test 8: Mobile Responsiveness**
1. Test on mobile device
2. Google button sized correctly
3. OAuth flow works on mobile Chrome/Safari

---

### Phase 3: Account Settings UI (Future Enhancement - Not MVP)

**ChatGPT Recommendation:** Skip this initially. Automatic linking + success message solves 95% of use cases with much less development effort.

**Purpose:** Show users which accounts are connected (only build if user demand exists)

#### New Page: Connected Accounts
**File:** `app/account/connected-accounts/page.tsx`

**Features:**
- Show "Google: Connected" or "Google: Not Connected"
- Show "Email/Password: Set" or "Not Set"
- Button: "Link Google Account" (if not linked)
- Button: "Unlink Google Account" (if linked AND password exists)
- Warning: "You must have a password set to unlink Google"

**UI Mockup:**
```
┌─────────────────────────────────────┐
│ Connected Accounts                  │
├─────────────────────────────────────┤
│                                     │
│ ✓ Google                            │
│   john.doe@gmail.com                │
│   Connected on June 1, 2026         │
│   [Unlink]                          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ✓ Email & Password                  │
│   Set and active                    │
│   [Change Password]                 │
│                                     │
└─────────────────────────────────────┘
```

#### API Route: Unlink Google
**File:** `app/api/auth/unlink-google/route.ts`

**Logic:**
```typescript
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check if user has password set
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true }
  })
  
  if (!user?.password) {
    return NextResponse.json({ 
      error: 'Cannot unlink Google: You must set a password first' 
    }, { status: 400 })
  }
  
  // Delete Google account record
  await prisma.account.delete({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        userId: session.user.id
      }
    }
  })
  
  return NextResponse.json({ success: true })
}
```

---

## Security Considerations

### Threat Model

**Threat 1: Google Account Compromise**
- Attacker gains access to victim's Google account
- Attacker signs in with Google → gets FigTracker access
- **Mitigation:** This is true with or without account linking. If Google account is compromised, user has bigger problems.

**Threat 2: Email Takeover**
- Attacker registers new Google account with victim's email
- **Mitigation:** Google requires email verification. We check `email_verified: true`.

**Threat 3: Account Confusion**
- User accidentally links wrong Google account
- **Mitigation:** Show email address during OAuth consent screen

**Threat 4: Data Leakage**
- OAuth tokens stored in database
- **Mitigation:** Tokens are encrypted at rest (database level), not accessible via API

### Best Practices Implemented

✅ Email verification check (`email_verified: true`)  
✅ HTTPS-only OAuth redirects  
✅ CSRF protection (NextAuth built-in)  
✅ Secure session tokens (httpOnly cookies)  
✅ No client-side token storage  
✅ Rate limiting on auth endpoints (TODO: Add if not exists)  

---

## Rollout Plan

### Development Environment (Local)
1. Add Google OAuth credentials to `.env.local`
2. Test all 8 test cases
3. Verify no regressions in email/password auth

### Staging Environment (Optional)
1. Deploy to staging subdomain
2. Create test Google accounts
3. Run full test suite
4. Check analytics (sign-up conversion)

### Production Environment
1. Add Google OAuth credentials to production env vars
2. Deploy during low-traffic period
3. Monitor error logs for OAuth failures
4. Check sign-up funnel metrics

### Rollback Plan
If issues arise:
```bash
# Revert auth.ts changes
git checkout HEAD~1 -- auth.ts

# Remove Google button from sign-in/sign-up pages
git checkout HEAD~1 -- app/auth/signin/page.tsx
git checkout HEAD~1 -- app/auth/signup/page.tsx

# Deploy
npm run build
# Push to production
```

---

## Success Metrics

### Primary KPIs
- **Sign-up conversion rate:** Expect +30-50% increase
- **Sign-in time:** Expect 50% faster (no password typing)
- **OAuth adoption:** Target 40% of new users use Google

### Secondary KPIs
- Error rate for OAuth flows: Target <1%
- Account linking success rate: Target >95%
- Support tickets related to login: Expect decrease

### Monitoring
- Add analytics event: `google_signin_clicked`
- Add analytics event: `google_signin_success`
- Add analytics event: `google_account_linked` (automatic)
- Track `error=OAuthAccountNotLinked` (should be 0 with automatic linking)

---

## Open Questions for Discussion

1. **Automatic vs Manual Linking:**
   - Is `allowDangerousEmailAccountLinking: true` acceptable?
   - Do we need UI to show account linking status?

2. **Email Notifications:**
   - Should we email users when Google account is linked?
   - Template: "Your Google account (john@gmail.com) was linked to FigTracker"

3. **Password Requirements:**
   - Can users remove their password after linking Google?
   - Or require at least one auth method at all times?

4. **Multi-Language OAuth:**
   - Do Google OAuth redirects work with subdomains (`de.figtracker.net`)?
   - Do we need separate OAuth clients per subdomain?

5. **Future Auth Methods:**
   - Should architecture support Apple Sign In, GitHub, etc?
   - Use same automatic linking approach?

6. **Existing Users:**
   - How do we communicate Google sign-in to existing users?
   - Email announcement? In-app banner?

---

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Phase 1: Core OAuth** | 2-3 days | Restore components, update auth config, get Google credentials, add success message |
| **Phase 2: Testing** | 1-2 days | Run all test cases, fix bugs, verify success message shows |
| **Phase 3: Deployment** | 1 day | Production deploy, monitoring |
| **Phase 4: Account Settings UI** | 3-4 days | *Future enhancement - only if user demand exists* |

**Total:** 4-6 days for MVP (Phases 1-3)

---

## Dependencies

**External Services:**
- Google Cloud Console account (free tier sufficient)
- Google OAuth 2.0 API enabled

**Environment Variables:**
- `GOOGLE_CLIENT_ID` (development + production)
- `GOOGLE_CLIENT_SECRET` (development + production)

**No Database Migrations Required:**
- Schema already supports OAuth (Account model exists)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Account takeover via compromised Google | Low | High | Email verification check |
| OAuth redirect errors | Medium | Medium | Comprehensive testing |
| User confusion about linking | Low | Low | Clear error messages |
| Breaking existing auth | Low | High | Keep credentials provider, test thoroughly |
| Google API downtime | Low | Medium | Fallback to email/password |
| Credential limit reached | Very Low | Low | Google allows 100+ OAuth apps |

**Overall Risk Level:** Low-Medium

---

## Conclusion

This plan restores Google OAuth with automatic account linking, providing a seamless experience for both new and existing users. The implementation is straightforward (1-2 weeks), with minimal security risk when proper mitigations are in place.

**Recommended Decision:** Proceed with Option 1 (Automatic Linking) for Phase 1-2, optionally add Account Settings UI in Phase 3 based on user feedback.

---

**Next Steps:**
1. Review this plan with team/advisors (ChatGPT review)
2. Get approval on automatic linking approach
3. Obtain Google OAuth credentials
4. Begin Phase 1 implementation

**Questions?** Ready to discuss any section in detail.
