import type { Metadata } from 'next';
import DisclosurePageClient from '@/components/disclosure-page-client';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure - FigTracker',
  description: 'FigTracker participates in the LEGO.com Affiliate Program and Amazon Associates Program. Learn about our affiliate partnerships and how we earn commissions.',
  openGraph: {
    title: 'Affiliate Disclosure - FigTracker',
    description: 'Learn about our affiliate partnerships and advertising practices.',
    url: 'https://figtracker.ericksu.com/disclosure',
  },
  alternates: {
    canonical: 'https://figtracker.ericksu.com/disclosure',
  },
};

export default function DisclosurePage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return <DisclosurePageClient lastUpdated={lastUpdated} />;
}
