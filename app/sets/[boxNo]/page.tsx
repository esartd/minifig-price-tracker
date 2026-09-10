import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBoxByNumber, loadAllBoxes } from '@/lib/boxes-data';
import SetDetailClient from '@/components/set-detail-client';
import { POPULAR_SETS } from '@/lib/popular-sets';
import { DOMAINS } from '@/lib/i18n-alternates';

// ISR: Pre-render popular pages, revalidate every 6 hours
export const revalidate = 21600; // 6 hours in seconds

// Generate static params for top 100 popular sets at build time
export async function generateStaticParams() {
  // Pre-generate popular sets only
  // Other sets will be generated on-demand and cached
  return POPULAR_SETS.map((boxNo) => ({
    boxNo,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ boxNo: string }>
}): Promise<Metadata> {
  const { boxNo } = await params;

  const set = getBoxByNumber(boxNo);

  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';

  const { getLocaleFromHost, getTranslations } = await import('@/lib/i18n-subdomain');
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);

  if (!set) {
    return {
      title: t.setDetail?.meta?.notFoundTitle || 'Set Not Found',
    };
  }

  // Hostnames come from lib/site-domain.ts via lib/i18n-alternates.ts.
  const domains = DOMAINS;

  const localeMap = {
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    es: 'es_ES',
    it: 'it_IT',
    nl: 'nl_NL',
    pl: 'pl_PL',
    pt: 'pt_PT',
    sv: 'sv_SE',
    ja: 'ja_JP',
  };

  // Descriptions come from SetsCatalog in the database, NOT from boxes.json.
  // The comment here used to say boxes.json and the code read `set`, which is
  // the boxes.json record -- and that file has no description fields at all
  // (it is regenerated from BrickLink twice a month, which is exactly why
  // descriptions were moved to the database in the first place). So every set
  // page in every language fell through to the fallback template below and had
  // done since the field was added. Matches what the minifig page does.
  const { prisma } = await import('@/lib/prisma');
  const setDescription = await prisma.setsCatalog.findUnique({
    where: { box_no: boxNo },
    select: {
      description_en: true,
      description_de: true,
      description_fr: true,
      description_es: true,
      description_it: true,
      description_ja: true,
      description_nl: true,
      description_pl: true,
      description_pt: true,
      description_sv: true,
    },
  }).catch(() => null);

  const descriptionKey = `description_${locale}` as keyof NonNullable<typeof setDescription>;
  const descriptionFallbackTemplate = t.setDetail?.meta?.descriptionFallback ||
                      '{category} - {name}. Track current BrickLink prices and manage your LEGO set inventory. Released {year}.';
  const description = setDescription?.[descriptionKey] ||
                      setDescription?.description_en ||
                      descriptionFallbackTemplate
                        .replace('{category}', set.category_name)
                        .replace('{name}', set.name)
                        .replace('{year}', set.year_released || 'date unknown');

  // Two sentences, and only add the period back if trimming removed one.
  // `'x.'.split('. ')` yields ['x.'], so the old unconditional `+ '.'` turned
  // a one-sentence description into "released in 2023.." on every set page.
  const sentences = description.split('. ');
  const metaDescription =
    sentences.length > 2 ? sentences.slice(0, 2).join('. ') + '.' : description;

  return {
    title: `${set.name} (${set.box_no}) - ${t.setDetail?.meta?.titleSuffix || 'LEGO Set Price Guide'}`,
    description: metaDescription,
    keywords: [
      'LEGO set',
      set.name,
      set.box_no,
      set.category_name,
      'BrickLink price',
      'set price guide',
      'LEGO price tracker',
      'collectible sets',
      'LEGO collection manager',
      'track set value'
    ],
    openGraph: {
      title: `${set.name} - ${set.category_name}`,
      description: `LEGO Set ${set.box_no} - ${t.setDetail?.meta?.ogDescription || 'Track BrickLink prices, see current market value, and manage your collection'}`,
      url: `${domains[locale as keyof typeof domains]}/sets/${boxNo}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES', 'it_IT', 'nl_NL', 'pl_PL', 'pt_PT', 'sv_SE', 'ja_JP'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      images: [set.image_url],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${set.name}`,
      description: `${set.category_name} ${t.setDetail?.meta?.twitterDescriptionSuffix || 'set price guide'}`,
      images: [set.image_url],
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/sets/${boxNo}`,
      languages: {
        'en': `${domains.en}/sets/${boxNo}`,
        'de': `${domains.de}/sets/${boxNo}`,
        'fr': `${domains.fr}/sets/${boxNo}`,
        'es': `${domains.es}/sets/${boxNo}`,
        'it': `${domains.it}/sets/${boxNo}`,
        'nl': `${domains.nl}/sets/${boxNo}`,
        'pl': `${domains.pl}/sets/${boxNo}`,
        'pt': `${domains.pt}/sets/${boxNo}`,
        'sv': `${domains.sv}/sets/${boxNo}`,
        'ja': `${domains.ja}/sets/${boxNo}`,
        'x-default': `${domains.en}/sets/${boxNo}`,
      },
    },
  };
}

export default async function SetPage({
  params
}: {
  params: Promise<{ boxNo: string }>
}) {
  const { boxNo } = await params;

  // Fetch set from catalog
  const set = getBoxByNumber(boxNo);

  if (!set) {
    notFound();
  }

  // Get user's locale for description
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const { getLocaleFromHost, getTranslations } = await import('@/lib/i18n-subdomain');
  const locale = getLocaleFromHost(host);
  const t = await getTranslations(locale);
  // Breadcrumb JSON-LD used to hard-code the English origin, so every locale
  // advertised English breadcrumb URLs to Google.
  const origin = DOMAINS[locale];

  // Get localized description
  const descriptionKey = `description_${locale}` as 'description_en' | 'description_de' | 'description_fr' | 'description_es';
  const localizedDescription = (set as any)[descriptionKey] || (set as any).description_en || '';

  // Transform to expected format
  const setData = {
    box_no: set.box_no,
    name: set.name,
    category_id: set.category_id,
    category_name: set.category_name,
    year_released: set.year_released,
    weight: set.weight,
    image_url: set.image_url,
    description: localizedDescription
  };

  // Fetch sets from the same theme
  const allBoxes = loadAllBoxes();
  const parentTheme = set.category_name.split(' / ')[0].trim();

  // Fetch similar sets (nearby set numbers) - expand range until we find 10 sets
  // Extract number from box_no (e.g., "75319-1" → 75319)
  const boxMatch = boxNo.match(/^(\d+)/);
  let closeRangeSets: any[] = [];

  if (boxMatch) {
    const currentSetNum = parseInt(boxMatch[1]);

    // Get all sets from same theme with set numbers
    const sameThemeSets = allBoxes
      .filter(b => {
        const bMatch = b.box_no.match(/^(\d+)/);
        if (!bMatch) return false;
        const bNum = parseInt(bMatch[1]);
        return bNum !== currentSetNum &&
               b.category_name.split(' / ')[0].trim() === parentTheme;
      })
      .map(b => ({
        ...b,
        setNum: parseInt(b.box_no.match(/^(\d+)/)?.[1] || '0'),
        distance: Math.abs(parseInt(b.box_no.match(/^(\d+)/)?.[1] || '0') - currentSetNum)
      }))
      .sort((a, b) => {
        // Sort by distance first, then by set number
        if (a.distance !== b.distance) return a.distance - b.distance;
        return a.setNum - b.setNum;
      })
      .slice(0, 10);

    closeRangeSets = sameThemeSets;
  }

  const themeSets = allBoxes
    .filter(b =>
      b.box_no !== boxNo &&
      b.category_name.split(' / ')[0].trim() === parentTheme
    )
    .sort((a, b) => {
      // Sort by year (newest first)
      const yearA = parseInt(a.year_released) || 0;
      const yearB = parseInt(b.year_released) || 0;
      return yearB - yearA;
    })
    .slice(0, 10);

  const themeSetsData = themeSets.map(b => ({
    box_no: b.box_no,
    name: b.name,
    image_url: b.image_url
  }));

  const closeRangeSetsData = closeRangeSets.map(b => ({
    box_no: b.box_no,
    name: b.name,
    image_url: b.image_url
  }));

  // Get similar sets from same year
  const sameYearSets = allBoxes
    .filter(b =>
      b.box_no !== boxNo &&
      b.year_released === set.year_released &&
      b.category_name.split(' / ')[0].trim() === parentTheme
    )
    .sort((a, b) => a.box_no.localeCompare(b.box_no))
    .slice(0, 8);

  const sameYearData = sameYearSets.map(b => ({
    box_no: b.box_no,
    name: b.name,
    image_url: b.image_url
  }));

  // Set contents, READ ONLY -- never fetched here.
  //
  // This used to call fetchSetContents(), which hits BrickLink on a miss and
  // goes through the same 3-second rate limiter as pricing. Stacked on the
  // pricing call it gave cold set pages 4-9s of TTFB: the page rendered
  // nothing at all while a person waited for two different BrickLink calls.
  //
  // getMinifigsInSet() is a plain indexed database read. Sets already fetched
  // (18,603 of 19,603) still render their minifigs server-side, so the common
  // case keeps its SEO and costs a few milliseconds. For the rest the page
  // ships immediately and SetDetailClient fills the list in from
  // /api/sets/[boxNo]/contents once it has mounted -- which is what actually
  // performs the BrickLink call, off the critical path.
  //
  // hasSetContents() is what makes that safe to repeat: without it the client
  // could not tell "not fetched yet" from "fetched, genuinely has no
  // minifigs", and would re-request forever on every minifig-less set.
  const { getMinifigsInSet, hasSetContents } = await import('@/lib/set-contents');
  let setMinifigs: Array<{ minifig_no: string; quantity: number; name?: string; image_url?: string }> = [];
  let contentsFetched = true;

  try {
    const [stored, fetched] = await Promise.all([
      getMinifigsInSet(boxNo),
      hasSetContents(boxNo),
    ]);
    contentsFetched = fetched;

    const { findMinifigByNumber } = await import('@/lib/catalog-static');
    setMinifigs = await Promise.all(stored.map(async m => {
      const minifig = await findMinifigByNumber(m.minifig_no);
      return {
        ...m,
        name: minifig?.name,
        image_url: minifig ? `https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png` : undefined
      };
    }));
  } catch (error) {
    console.error('[SET PAGE] Error reading set contents:', error);
    // Leave contentsFetched true on an error: better to show no minifigs than
    // to send every visitor into a retry loop against BrickLink.
  }

  // Pricing for the Product snippet.
  //
  // This page used to emit `offers: { '@type': 'AggregateOffer' }` carrying a
  // currency and an availability and no price whatsoever -- on all ~19,600 set
  // pages. lowPrice is a required field, so every one of them was a critical
  // "Missing field lowPrice" in Search Console and none were eligible for a
  // product snippet.
  //
  // Via the orchestrator, never bricklinkAPI directly: it serves the 7-day
  // logged-out cache and enforces the daily budget, which is exactly what the
  // June 2026 incident on the minifig page was about.
  // getCachedPriceOnly, NOT getSetPrice. getSetPrice falls through to a live
  // BrickLink call on a cache miss, and that path sleeps 3s twice for rate-limit
  // compliance -- measured 4-9s of TTFB on cold set pages, with a real person
  // waiting on it after clicking a search result. Nothing here is worth making
  // someone wait; if the price is not cached the page ships without `offers`
  // and the next crawl picks it up once a visitor has warmed the cache.
  const { pricingOrchestrator } = await import('@/lib/pricing-orchestrator');
  const setPricing = await pricingOrchestrator.getCachedPriceOnly(boxNo, 'SET');

  // No price, no offer node. An empty AggregateOffer is worse than none.
  const setOffer = setPricing && setPricing.currentLowest > 0
    ? {
        '@type': 'AggregateOffer' as const,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        lowPrice: setPricing.currentLowest.toFixed(2),
        // No highPrice and no offerCount on purpose.
        //
        // These previously read pricingData.currentHighest and
        // .totalQuantity -- neither of which exists on PricingData. They were
        // silently undefined, so highPrice collapsed to lowPrice and
        // offerCount always emitted the literal 1. Verified in the live
        // markup before this fix.
        //
        // The real shape gives sixMonthAverage, currentAverage, currentLowest
        // and suggestedPrice. None of those is "the highest offer", and an
        // average dressed up as a maximum is exactly the kind of overclaim
        // this site's whole pitch is against. Search Console lists both as
        // recommended, not required; leaving them absent keeps two
        // non-critical warnings and says nothing untrue.
        url: `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${set.box_no}`,
      }
    : null;

  // Schema.org structured data for rich search results
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: set.name,
    description: `${set.category_name} LEGO set ${set.box_no}`,
    image: set.image_url,
    brand: {
      '@type': 'Brand',
      name: 'LEGO'
    },
    category: set.category_name,
    identifier: set.box_no,
    // Guarded: a QuantitativeValue with a null value is an invalid node, and
    // the catalog does not carry a weight for every set.
    ...(set.weight && {
      weight: {
        '@type': 'QuantitativeValue',
        value: set.weight,
        unitCode: 'GRM'
      }
    }),
    ...(set.year_released && {
      releaseDate: set.year_released
    }),
    ...(setOffer && { offers: setOffer })
  };

  // BreadcrumbList schema for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.navigation?.home || 'Home',
        item: origin
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.navigation?.sets || 'Sets',
        item: `${origin}/sets/browse`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: parentTheme,
        item: `${origin}/sets-themes/${encodeURIComponent(parentTheme.toLowerCase().replace(/\s+/g, '-'))}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: set.name,
        item: `${origin}/sets/${set.box_no}`
      }
    ]
  };

  return (
    <>
      {/* Product schema, only when there is a price to put in it.
          
          Google requires a Product to carry at least ONE of offers, review or
          aggregateRating. This morning's fix stopped emitting an `offers`
          block with no lowPrice in it -- correct as far as it went, and 51
          pages were validated clean -- but on pages with no cached price it
          left a Product with none of the three, which is the same critical
          severity under a different name: "Either offers, review, or
          aggregateRating should be specified".
          
          We have no reviews and no ratings, and inventing them is a
          manual-action risk. So a page with no price has nothing truthful to
          put in a Product, and a Product that cannot be eligible for a
          product snippet should not be claimed at all. The page keeps its
          BreadcrumbList and the site-level schemas; only this one is
          conditional, and it returns as soon as the price caches. */}
      {setOffer && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SetDetailClient
        set={setData}
        themeSets={themeSetsData}
        sameYearSets={sameYearData}
        closeRangeSets={closeRangeSetsData}
        minifigs={setMinifigs}
        contentsPending={!contentsFetched}
      />
    </>
  );
}
