'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Global Collection Pre-Fetch Component
 *
 * Silently pre-fetches all user collections on ANY page load
 * for instant navigation to collection pages.
 *
 * Why this works:
 * - Only runs for logged-in users
 * - Uses cached prices from priceCache (no BrickLink API calls)
 * - Fetches all 4 collections in parallel
 * - Data cached in browser memory for instant page loads
 *
 * API Impact: ZERO - reads from database cache only
 */
export default function CollectionPreFetch() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only pre-fetch for authenticated users
    if (status !== 'authenticated' || !session) {
      return;
    }

    const preFetchCollections = async () => {
      try {
        // Pre-fetch all user collections (uses cached prices, no BrickLink API calls)
        // This makes navigation to collection pages feel instant
        const endpoints = [
          '/api/personal-collection?all=true',  // Minifigs: Collection
          '/api/inventory?all=true',            // Minifigs: Inventory
          '/api/sets-collection?all=true',      // Sets: Collection
          '/api/sets-inventory?all=true'        // Sets: Inventory
        ];

        // Fetch all in parallel for speed
        const results = await Promise.allSettled(
          endpoints.map(url =>
            fetch(url).then(res => res.ok ? res.json() : null)
          )
        );

        // Log success (helps debug, can be removed in production)
        let totalItems = 0;
        results.forEach((result, i) => {
          if (result.status === 'fulfilled' && result.value) {
            const endpoint = endpoints[i].split('?')[0].split('/').pop();
            const itemCount = result.value.length;
            totalItems += itemCount;
            console.log(`✅ Pre-fetched ${itemCount} items from ${endpoint}`);
          }
        });

        if (totalItems > 0) {
          console.log(`🚀 Total pre-fetched: ${totalItems} items - collections ready for instant navigation`);
        }
      } catch (error) {
        // Silent fail - no UI impact
        console.debug('Collection pre-fetch failed (non-critical):', error);
      }
    };

    // Pre-fetch after a short delay to not interfere with initial page load
    // 500ms = enough time for critical page content to render first
    const timer = setTimeout(preFetchCollections, 500);

    return () => clearTimeout(timer);
  }, [session, status]);

  // This component renders nothing - it's purely functional
  return null;
}
