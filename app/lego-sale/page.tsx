import { Metadata } from 'next/headers';
import { notFound } from 'next/navigation';
import LegoSaleClient from './client';
import { triggerRefreshIfStale } from '@/lib/amazon-deals-refresh';

// Feature flag check
const ENABLED = process.env.ENABLE_LEGO_SALE === 'true';

export async function generateMetadata(): Promise<Metadata> {
  if (!ENABLED) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: 'LEGO® Sale: Best Amazon Deals Up to 50% Off | FigTracker',
    description:
      'Find the best LEGO deals on Amazon with discounts up to 50% off. Updated every 6 hours. Browse current LEGO sets from Star Wars, City, Creator, and more. Free shipping with Prime.',
    keywords: [
      'LEGO sale',
      'LEGO deals',
      'LEGO Amazon',
      'cheap LEGO sets',
      'LEGO discount',
      'LEGO clearance',
      'LEGO Star Wars sale',
      'LEGO City deals',
      'best LEGO prices',
      'LEGO offers',
      'LEGO promotions',
    ],
    openGraph: {
      title: 'LEGO® Sale - Up to 50% Off on Amazon',
      description:
        'Discover the best LEGO deals on Amazon. Updated every 6 hours with discounts from 20% to 50% off.',
      type: 'website',
      url: 'https://figtracker.ericksu.com/lego-sale',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'LEGO® Sale - Best Amazon Deals',
      description: 'Find LEGO sets with up to 50% off on Amazon',
    },
  };
}

export default async function LegoSalePage() {
  // Feature flag check
  if (!ENABLED) {
    notFound();
  }

  // Trigger opportunistic refresh if data is stale (non-blocking)
  // This runs in background and doesn't slow down page load
  triggerRefreshIfStale().catch((error) => {
    console.error('[LEGO Sale] Background refresh error:', error);
  });

  // Schema.org structured data for SEO
  const offerCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LEGO® Sale on Amazon',
    description: 'Best LEGO deals with discounts up to 50% off',
    url: 'https://figtracker.ericksu.com/lego-sale',
    itemListElement: [
      {
        '@type': 'Offer',
        category: 'LEGO Toys',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: 10,
          maxPrice: 500,
          priceCurrency: 'USD',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }}
      />
      <LegoSaleClient />
    </>
  );
}
