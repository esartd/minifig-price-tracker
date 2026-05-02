import type { Metadata } from 'next';
import SupportPageClient from '@/components/support-page-client';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Support FigTracker - Keep Our LEGO Price Tracker Free',
    description: 'Learn how FigTracker stays free and how you can help support the site through affiliate purchases and sharing with other LEGO collectors.',
    keywords: ['support FigTracker', 'LEGO affiliate links', 'help FigTracker', 'support LEGO price tracker'],
    openGraph: {
      title: 'Support FigTracker',
      description: 'Help keep FigTracker free for the LEGO community',
      url: 'https://figtracker.ericksu.com/support',
      type: 'website',
    },
    alternates: {
      canonical: 'https://figtracker.ericksu.com/support',
    },
  };
}

export default function SupportPage() {
  return <SupportPageClient />;
}
