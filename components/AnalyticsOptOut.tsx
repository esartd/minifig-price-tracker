'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { isAdminEmail } from '@/lib/admin-auth';

/**
 * Keeps admin browsing out of Google Analytics.
 *
 * Renders nothing. Its whole job is to set a flag the Analytics bootstrap in
 * app/layout.tsx reads synchronously on every subsequent page load, before the
 * tag is fetched.
 *
 * It cannot prevent the hit on the page it is mounted on: that bootstrap has
 * already run by the time React hydrates and the session resolves. So the first
 * page view after an admin signs in on a fresh browser is still counted, and
 * every one after it is not. Blocking that first one too would mean delaying
 * Analytics for every visitor until the session resolved, which would skew the
 * numbers for everybody to fix a handful of hits.
 *
 * Why this rather than a GA4 internal-traffic filter: a filter keys off IP, and
 * an IP changes with a reconnection, a phone leaving wifi, or a coffee shop.
 * This follows the account instead. The two are complementary -- an IP filter
 * additionally covers signed-out browsing from a known location.
 *
 * The flag is never cleared automatically. Signing out of an admin account does
 * not re-enable measurement on that browser, deliberately: it is the same
 * person still using it. Clear it with ?analytics=on.
 */

const FLAG = 'ib_no_analytics';

export default function AnalyticsOptOut() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!isAdminEmail(session?.user?.email)) return;

    try {
      if (localStorage.getItem(FLAG) !== '1') {
        localStorage.setItem(FLAG, '1');
        // Stop the tag sending anything further in THIS page's session too.
        // The initial page_view is already gone, but navigations within the
        // visit would otherwise keep reporting.
        (window as unknown as { [k: string]: unknown })['ga-disable-G-PXLF7KRTSB'] = true;
      }
    } catch {
      // Private browsing throws. Nothing to do -- measurement simply continues.
    }
  }, [status, session?.user?.email]);

  return null;
}
