import type { Metadata } from 'next';
import May4thDealsClient from './client';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'LEGO Star Wars May the 4th Deals 2026 - Up to 39% Back | FigTracker',
    description: 'Exclusive LEGO Star Wars May the 4th deals guide. Get up to 39% total value with free minifigures and 4x Insiders Points. Analysis of all deal tiers May 1-6, 2026.',
    keywords: ['LEGO Star Wars May the 4th 2026', 'LEGO May 4th deals', 'LEGO Star Wars GWP', 'LEGO Insiders Points', 'best LEGO deals 2026', 'LEGO Star Wars freebies'],
    openGraph: {
      title: 'LEGO Star Wars May the 4th Deals Guide 2026 - Up to 39% Back',
      description: 'Get up to 39% total value. Free Star Wars minifigs + 20% cashback with 4x points. May 1-6 only.',
      url: 'https://figtracker.ericksu.com/deals/star-wars-may-4th-2026',
      type: 'article',
    },
    alternates: {
      canonical: 'https://figtracker.ericksu.com/deals/star-wars-may-4th-2026',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function May4thDeals2026() {
  return <May4thDealsClient />;
}
