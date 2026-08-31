import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import { buildExportMetadata, DOMAINS } from '@/lib/export-landing-meta';
import ExportLandingShell from '@/components/ExportLandingShell';

/**
 * The neutral door into the export tool — no marketplace pre-selected.
 * The marketplace-specific pages exist for search; this one is for the
 * in-app "Export" buttons on the collection pages.
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);
  const e = t.exportTool || {};

  return buildExportMetadata(
    locale,
    '/export',
    e.meta?.title || 'Bulk List Your LEGO on Whatnot and BrickLink',
    e.meta?.description ||
      'Turn your LEGO collection into ready-to-upload marketplace files. Pick your items once and export to Whatnot and BrickLink together. Free.'
  );
}

export default async function ExportPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);
  const { source } = await searchParams;
  const e = t.exportTool || {};
  const baseUrl = DOMAINS[locale];

  return (
    <ExportLandingShell
      initialSource={source}
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: e.meta?.title || 'Bulk List Your LEGO on Whatnot and BrickLink',
        description:
          e.meta?.description ||
          'Turn your LEGO collection into ready-to-upload marketplace files.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: `${baseUrl}/export`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@type': 'Organization', name: 'FigTracker' },
      }}
      copy={{
        title: e.hero?.title || 'List Your Collection Everywhere at Once',
        subtitle:
          e.hero?.subtitle ||
          'Pick your items once, choose where you want to sell, and get a ready-to-upload file for each marketplace.',
        howItWorks: t.whatnotExport?.howItWorks || 'How it works',
        steps: [
          {
            title: e.steps?.step1?.title || 'Pick what you want to sell',
            body:
              e.steps?.step1?.body ||
              'Choose any of your four collections and tick the items you want to list.',
          },
          {
            title: e.steps?.step2?.title || 'Choose your marketplaces',
            body:
              e.steps?.step2?.body ||
              'Tick as many as you like. Each one gets its own settings and its own correctly-formatted file.',
          },
          {
            title: e.steps?.step3?.title || 'Download and upload',
            body:
              e.steps?.step3?.body ||
              'You get one file per marketplace, matching each of their templates exactly.',
          },
        ],
        notesTitle: t.whatnotExport?.notes?.title || 'Before you upload',
        notes: [
          e.notes?.checkWarnings ||
            'Anything worth a second look is flagged above before you download.',
          e.notes?.perMarketplace ||
            'Each marketplace wants different things — Whatnot needs photos and a shipping profile, BrickLink needs set completeness. Both are handled for you.',
          e.notes?.region ||
            'These files match the United States templates. Sellers in other regions may need a different one.',
        ],
        pricingLinkText:
          t.whatnotExport?.pricingLink?.text || 'Curious where the suggested prices come from?',
        pricingLinkLabel:
          t.whatnotExport?.pricingLink?.linkText || 'See how we calculate prices',
      }}
    />
  );
}
