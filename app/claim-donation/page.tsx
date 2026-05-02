import type { Metadata } from 'next';
import ClaimDonationClient from '@/components/claim-donation-client';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Claim Your Donation - FigTracker',
    description: 'Add your donation to the FigTracker supporters leaderboard',
    robots: 'noindex', // Don't index this page
  };
}

export default function ClaimDonationPage() {
  return <ClaimDonationClient />;
}
