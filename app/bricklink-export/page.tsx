import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, getLocaleFromHost } from '@/lib/i18n-subdomain';
import { buildExportMetadata, DOMAINS } from '@/lib/export-landing-meta';
import ExportLandingShell from '@/components/ExportLandingShell';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);
  const b = t.bricklinkExport || {};

  return buildExportMetadata(
    locale,
    '/bricklink-export',
    b.meta?.title || 'BrickLink Mass Upload File for LEGO Sellers',
    b.meta?.description ||
      'Turn your LEGO collection into a BrickLink mass-upload XML in one click. Prices, conditions and set completeness filled in for you. Free.'
  );
}

export default async function BricklinkExportPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const headersList = await headers();
  const locale = getLocaleFromHost(headersList.get('host') || '');
  const t = await getTranslations(locale);
  const { source } = await searchParams;
  const b = t.bricklinkExport || {};
  const baseUrl = DOMAINS[locale];

  return (
    <ExportLandingShell
      initialSource={source}
      initialMarketplace="bricklink"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: b.meta?.title || 'BrickLink Mass Upload File for LEGO Sellers',
        description:
          b.meta?.description ||
          'Turn your LEGO collection into a BrickLink mass-upload XML in one click.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: `${baseUrl}/bricklink-export`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@type': 'Organization', name: 'FigTracker' },
      }}
      copy={{
        title: b.hero?.title || 'Fill Your BrickLink Store in One Upload',
        subtitle:
          b.hero?.subtitle ||
          'BrickLink lets you add your whole inventory from one XML file. Your FigTracker item numbers are already BrickLink numbers, so there is nothing to look up.',
        howItWorks: t.whatnotExport?.howItWorks || 'How it works',
        steps: [
          {
            title: b.steps?.step1?.title || 'Pick what you want to sell',
            body:
              b.steps?.step1?.body ||
              'Choose any of your four collections and tick the items you want to list.',
          },
          {
            title: b.steps?.step2?.title || 'Set your prices once',
            body:
              b.steps?.step2?.body ||
              'Start from FigTracker’s suggested price and add a markup if you want. Sets also carry their completeness, so BrickLink gets what it needs.',
          },
          {
            title: b.steps?.step3?.title || 'Upload to your store',
            body:
              b.steps?.step3?.body ||
              'In BrickLink, go to My Store, then Upload Inventory, and paste or upload the XML.',
          },
        ],
        notesTitle: t.whatnotExport?.notes?.title || 'Before you upload',
        notes: [
          b.notes?.noPhotos ||
            'BrickLink uses its own catalog photos, so no image links are needed at all.',
          b.notes?.completeness ||
            'Every set needs to be marked Complete, Incomplete or Sealed. Record it on each set and your file stops guessing.',
          b.notes?.rollback ||
            'BrickLink rejects the whole file if any single row is wrong, so check the warnings above before uploading.',
          b.notes?.split ||
            'BrickLink caps an upload at 200KB. Large exports arrive as several numbered files — upload each one.',
        ],
        pricingLinkText:
          t.whatnotExport?.pricingLink?.text || 'Curious where the suggested prices come from?',
        pricingLinkLabel:
          t.whatnotExport?.pricingLink?.linkText || 'See how we calculate prices',
      }}
    />
  );
}
