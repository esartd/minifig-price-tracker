import type { Metadata } from 'next';
import ClaimDonationClient from '@/components/claim-donation-client';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';

export async function generateMetadata(): Promise<Metadata> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);

  return {
    title: t.claimDonation?.meta?.title || 'Claim Your Donation - FigTracker',
    description: t.claimDonation?.meta?.description || 'Add your donation to the FigTracker supporters leaderboard',
    robots: 'noindex', // Don't index this page
  };
}

export default function ClaimDonationPage() {
  return <ClaimDonationClient />;
}
