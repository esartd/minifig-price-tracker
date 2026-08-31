import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import { buildExportMetadata, DOMAINS } from '@/lib/export-landing-meta';
import ExportLandingShell from '@/components/ExportLandingShell';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);
  const e = t.ebayExport || {};

  return buildExportMetadata(
    locale,
    '/ebay-export',
    e.meta?.title || 'eBay Bulk Listing File for LEGO Sellers',
    e.meta?.description ||
      'Turn your LEGO collection into an eBay File Exchange CSV in one click. Categories, condition IDs, prices and photos filled in for you. Free.'
  );
}

export default async function EbayExportPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);
  const { source } = await searchParams;
  const e = t.ebayExport || {};
  const baseUrl = DOMAINS[locale];

  return (
    <ExportLandingShell
      initialSource={source}
      initialMarketplace="ebay"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: e.meta?.title || 'eBay Bulk Listing File for LEGO Sellers',
        description:
          e.meta?.description ||
          'Turn your LEGO collection into an eBay File Exchange CSV in one click.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: `${baseUrl}/ebay-export`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@type': 'Organization', name: 'FigTracker' },
      }}
      copy={{
        title: e.hero?.title || 'List Your LEGO on eBay in One Upload',
        subtitle:
          e.hero?.subtitle ||
          'eBay lets you create listings in bulk from a spreadsheet. FigTracker fills in the parts people usually get wrong — the category and condition codes.',
        howItWorks: t.whatnotExport?.howItWorks || 'How it works',
        steps: [
          {
            title: e.steps?.step1?.title || 'Pick what you want to sell',
            body:
              e.steps?.step1?.body ||
              'Choose any of your four collections and tick the items you want to list.',
          },
          {
            title: e.steps?.step2?.title || 'Set your selling terms once',
            body:
              e.steps?.step2?.body ||
              'Where you ship from, how long the listing runs, postage and returns. They apply to every row.',
          },
          {
            title: e.steps?.step3?.title || 'Upload to Seller Hub',
            body:
              e.steps?.step3?.body ||
              'In eBay, go to Seller Hub, then Reports, then Upload. Choose the CSV and eBay will report anything it did not like row by row.',
          },
        ],
        notesTitle: t.whatnotExport?.notes?.title || 'Before you upload',
        notes: [
          e.notes?.categories ||
            'Listings go to eBay’s own LEGO categories — Minifigures for minifigs, Complete Sets & Packs for sets — with the matching numeric condition codes.',
          e.notes?.location ||
            'eBay will not accept the file without a shipping location, so fill that in before downloading.',
          e.notes?.photos ||
            'Photos come from the LEGO catalog. For used items, your own pictures will sell far better on eBay.',
          e.notes?.fees ||
            'eBay charges listing and final value fees. Check your allowance before uploading a large batch.',
        ],
        pricingLinkText:
          t.whatnotExport?.pricingLink?.text || 'Curious where the suggested prices come from?',
        pricingLinkLabel:
          t.whatnotExport?.pricingLink?.linkText || 'See how we calculate prices',
      }}
    />
  );
}
