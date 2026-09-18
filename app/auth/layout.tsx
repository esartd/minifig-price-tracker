import type { Metadata } from 'next';

/**
 * Sign-in, sign-up and password-reset screens are not search results.
 *
 * These pages are 'use client', so they cannot export metadata themselves --
 * which is why they had none, and therefore inherited the root layout's, whose
 * canonical is the domain root. Every one of them was telling Google it was
 * indexable AND that its canonical URL was the homepage, on all ten locale
 * subdomains.
 *
 * noindex rather than a robots.txt Disallow on purpose: a disallowed URL is
 * never crawled, so Google never sees the noindex and can keep a URL it found
 * via a link in the index indefinitely. Letting it crawl and read noindex is
 * what actually removes them.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
