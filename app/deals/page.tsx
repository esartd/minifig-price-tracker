import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegoSaleClient from './client';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import { originFor } from '@/lib/site-domain';

// Feature flag check
const ENABLED = process.env.ENABLE_LEGO_SALE === 'true';

export async function generateMetadata(): Promise<Metadata> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);

  if (!ENABLED) {
    return {
      title: t.legoSale?.meta?.notFoundTitle || 'Page Not Found',
    };
  }

  return {
    title: t.legoSale?.meta?.title || 'LEGO® Sale: Best Amazon Deals Up to 50% Off | IntoBrick',
    description:
      t.legoSale?.meta?.description ||
      'Find the best LEGO deals on Amazon with discounts up to 50% off. Updated every 6 hours. Browse current LEGO sets from Star Wars, City, Creator, and more. Free shipping with Prime.',
    keywords: t.legoSale?.meta?.keywords || [
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
      title: t.legoSale?.meta?.ogTitle || 'LEGO® Sale - Up to 50% Off on Amazon',
      description:
        t.legoSale?.meta?.ogDescription ||
        'Discover the best LEGO deals on Amazon. Updated every 6 hours with discounts from 20% to 50% off.',
      type: 'website',
      url: `${originFor(locale)}/deals`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.legoSale?.meta?.twitterTitle || 'LEGO® Sale - Best Amazon Deals',
      description: t.legoSale?.meta?.twitterDescription || 'Find LEGO sets with up to 50% off on Amazon',
    },
  };
}

export default async function LegoSalePage() {
  // Feature flag check
  if (!ENABLED) {
    notFound();
  }

  // No opportunistic refresh on page view. The old Amazon version kicked one
  // off from here; the Walmart catalog only updates once a day, so a page view
  // can never find anything new. /api/cron/walmart-deals owns the sync.

  // Origin for the schema below; generateMetadata's copy is out of scope here.
  const { headers: readHeaders } = await import('next/headers');
  const locale = getLocaleFromHost((await readHeaders()).get('host') || '');

  // Schema.org structured data for SEO.
  //
  // This is what Google reads, so the retailer named here has to be the one
  // whose prices the page actually shows. It said "LEGO® Sale on Amazon" long
  // after the Amazon feed died -- invisible on the page itself, which is
  // exactly why it survived every other pass.
  const offerCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LEGO sets on sale at Walmart',
    description: 'LEGO sets discounted at Walmart, checked daily and sorted by how much is off',
    url: `${originFor(locale)}/deals`,
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
