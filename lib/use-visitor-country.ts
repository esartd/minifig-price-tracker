'use client';

import { useState, useEffect } from 'react';

/**
 * The visitor's country, for client components.
 *
 * Server components read lib/visitor-country.ts directly; this is for the ones
 * that cannot, which is most of the buy buttons.
 *
 * Shared cache, deliberately. Three components want this on a set page -- the
 * eBay button, the Walmart row, the alert modal -- and without a shared promise
 * each mount fires its own request for a value that cannot change between them.
 * The in-flight promise is cached too, so components mounting in the same tick
 * share one round trip rather than racing.
 *
 * Never stored in a cookie: cache-handler.js keeps rendered routes in MySQL, so
 * a response carrying one visitor's country can be handed to the next.
 * sessionStorage is per-tab and never rendered into a page, so it is safe.
 */

const STORAGE_KEY = 'ib_visitor_country';

let cached: string | null = null;
let inFlight: Promise<string> | null = null;

async function loadCountry(): Promise<string> {
  if (cached) return cached;
  if (inFlight) return inFlight;

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      cached = stored;
      return stored;
    }
  } catch {
    // Private browsing throws on access. Fall through and fetch.
  }

  inFlight = fetch('/api/geo')
    .then((r) => r.json())
    .then((d) => {
      const country = typeof d?.country === 'string' ? d.country : 'unknown';
      cached = country;
      try {
        sessionStorage.setItem(STORAGE_KEY, country);
      } catch {
        // ignore
      }
      return country;
    })
    .catch(() => 'unknown')
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/**
 * Returns the ISO country code, or 'US' until it is known.
 *
 * Defaulting to US rather than null keeps callers simple: every link builder
 * already falls back to the US marketplace for an unrecognised country, so a
 * link rendered before the answer arrives is the same link it would have been
 * anyway for most visitors, and corrects itself on the next render.
 */
export function useVisitorCountry(): string {
  const [country, setCountry] = useState<string>(cached || 'US');

  useEffect(() => {
    let alive = true;
    loadCountry().then((c) => {
      if (alive) setCountry(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  return country;
}
