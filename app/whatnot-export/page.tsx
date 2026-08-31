import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import { buildExportMetadata, DOMAINS } from '@/lib/export-landing-meta';
import ExportLandingShell from '@/components/ExportLandingShell';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);
  const w = t.whatnotExport || {};

  return buildExportMetadata(
    locale,
    '/whatnot-export',
    w.meta?.title || 'Whatnot CSV Export for LEGO Sellers',
    w.meta?.description ||
      'Turn your LEGO collection into a Whatnot bulk-import CSV in one click. Prices, conditions, shipping profiles and photos filled in for you. Free.'
  );
}

export default async function WhatnotExportPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);
  const { source } = await searchParams;
  const w = t.whatnotExport || {};
  const baseUrl = DOMAINS[locale];

  return (
    <ExportLandingShell
      initialSource={source}
      initialMarketplace="whatnot"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: w.meta?.title || 'Whatnot CSV Export for LEGO Sellers',
        description:
          w.meta?.description ||
          'Turn your LEGO collection into a Whatnot bulk-import CSV in one click.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: `${baseUrl}/whatnot-export`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@type': 'Organization', name: 'FigTracker' },
      }}
      copy={{
        title: w.hero?.title || 'List on Whatnot in One Upload',
        subtitle:
          w.hero?.subtitle ||
          'Whatnot lets you bulk-import listings from a CSV. FigTracker already knows your items, their prices and their weights — so it can write that file for you.',
        howItWorks: w.howItWorks || 'How it works',
        steps: [
          {
            title: w.steps?.step1?.title || 'Pick what you want to sell',
            body:
              w.steps?.step1?.body ||
              'Choose any of your four collections and tick the items you want to list.',
          },
          {
            title: w.steps?.step2?.title || 'Set your prices and conditions once',
            body:
              w.steps?.step2?.body ||
              'Start from FigTracker’s suggested price, add a markup if you want, and choose how your conditions map to Whatnot’s.',
          },
          {
            title: w.steps?.step3?.title || 'Download and upload',
            body:
              w.steps?.step3?.body ||
              'You get a CSV that matches Whatnot’s template exactly. Upload it to your Whatnot Inventory and your drafts are ready.',
          },
        ],
        notesTitle: w.notes?.title || 'Before you upload',
        notes: [
          w.notes?.photos ||
            'Photos come from the LEGO catalog. For used items, replacing them with your own pictures will sell better.',
          w.notes?.shipping ||
            'Shipping profiles are estimated from catalog weight plus your packaging allowance. Weigh anything unusual before listing it.',
          w.notes?.region ||
            'This file matches Whatnot’s United States template. Sellers in other regions use a different one.',
        ],
        pricingLinkText:
          w.pricingLink?.text || 'Curious where the suggested prices come from?',
        pricingLinkLabel: w.pricingLink?.linkText || 'See how we calculate prices',
      }}
    />
  );
}
