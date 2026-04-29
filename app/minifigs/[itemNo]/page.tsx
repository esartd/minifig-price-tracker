import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findMinifigByNumber, getMinifigsByCategoryId } from '@/lib/catalog-static';
import MinifigDetailClient from '@/components/minifig-detail-client';

// Force dynamic rendering - required for filesystem access and database queries
export const dynamic = 'force-dynamic';

// Disable pre-rendering at build time
export async function generateStaticParams() {
  return [];
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ itemNo: string }>
}): Promise<Metadata> {
  const { itemNo } = await params;

  const minifig = await findMinifigByNumber(itemNo);

  if (!minifig) {
    return {
      title: 'Minifigure Not Found',
    };
  }

  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  const localeMap = {
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    es: 'es_ES',
  };

  // Use full BrickLink name for SEO (better keyword matching)
  const fullName = minifig.name;

  return {
    title: `${fullName} (${minifig.minifigure_no}) - LEGO Minifigure Price Guide`,
    description: `${minifig.category_name} - ${fullName}. Track current BrickLink prices, view historical trends, and manage your LEGO minifigure inventory. Released ${minifig.year_released || 'date unknown'}.`,
    keywords: [
      'LEGO minifigure',
      fullName,
      minifig.minifigure_no,
      minifig.category_name,
      'BrickLink price',
      'minifigure price guide',
      'LEGO price tracker',
      'collectible minifigures',
      'LEGO inventory'
    ],
    openGraph: {
      title: `${fullName} - ${minifig.category_name}`,
      description: `LEGO Minifigure ${minifig.minifigure_no} - Price tracking and inventory management`,
      url: `${domains[locale as keyof typeof domains]}/minifigs/${itemNo}`,
      locale: localeMap[locale as keyof typeof localeMap],
      alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'es_ES'].filter(l => l !== localeMap[locale as keyof typeof localeMap]),
      images: [`https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName}`,
      description: `${minifig.category_name} minifigure price guide`,
      images: [`https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`],
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/minifigs/${itemNo}`,
      languages: {
        'en': `${domains.en}/minifigs/${itemNo}`,
        'de': `${domains.de}/minifigs/${itemNo}`,
        'fr': `${domains.fr}/minifigs/${itemNo}`,
        'es': `${domains.es}/minifigs/${itemNo}`,
        'x-default': `${domains.en}/minifigs/${itemNo}`,
      },
    },
  };
}

export default async function MinifigPage({
  params
}: {
  params: Promise<{ itemNo: string }>
}) {
  const { itemNo } = await params;

  // Fetch minifig from static catalog
  const minifig = await findMinifigByNumber(itemNo);

  if (!minifig) {
    notFound();
  }

  // Transform to expected format
  const minifigData = {
    no: minifig.minifigure_no,
    name: minifig.name,
    category_id: minifig.category_id,
    category_name: minifig.category_name,
    year_released: minifig.year_released,
    image_url: `https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`,
    weight_grams: null
  };

  // Fetch character variants (same character, different variations)
  // Extract character name: take everything before " - " (space-dash-space), comma, or opening parenthesis
  // e.g., "Darth Maul - Printed Legs..." → "Darth Maul"
  // e.g., "Qui-Gon Jinn - Dark Brown Legs..." → "Qui-Gon Jinn" (preserves hyphen in name)
  // e.g., "Luke Skywalker, Jedi Knight" → "Luke Skywalker"
  // e.g., "Luke Skywalker (Tatooine)" → "Luke Skywalker"
  const characterName = minifig.name.split(/\s+-\s+|,|\(/)[0].trim();

  // Different characters that should NOT be grouped together
  const exclusions: { [key: string]: string[] } = {
    'thor': ['mighty thor'],
    'mighty thor': ['thor'], // If on Mighty Thor page, exclude regular Thor
  };

  const excludePatterns = exclusions[characterName.toLowerCase()] || [];

  // Fetch only same-category minifigs (much faster than loading all 18k)
  let categoryMinifigs: Awaited<ReturnType<typeof getMinifigsByCategoryId>> = [];
  try {
    categoryMinifigs = await getMinifigsByCategoryId(minifig.category_id);
  } catch (error) {
    console.error('[MINIFIG PAGE] Failed to load category minifigs:', error);
    categoryMinifigs = []; // Fallback to empty array
  }

  // Filter for same character name
  const allMatches = categoryMinifigs.filter(m =>
    m.minifigure_no !== itemNo &&
    m.name.toLowerCase().includes(characterName.toLowerCase())
  );

  // Filter to only include matches where character name appears as a complete word
  // and exclude different characters with similar names
  const characterVariants = allMatches.filter(variant => {
    const searchName = variant.name.toLowerCase();
    const charName = characterName.toLowerCase();

    // Check if character name appears as a complete word (not substring)
    // e.g., "thor" should match "thor -" or "bro thor" but not "luthor"
    const wordBoundaryRegex = new RegExp(`(^|\\s)${charName}(\\s|$|,|-|\\()`, 'i');
    if (!wordBoundaryRegex.test(searchName)) {
      return false;
    }

    // Exclude different characters with similar names
    for (const pattern of excludePatterns) {
      if (searchName.startsWith(pattern)) {
        return false;
      }
    }

    return true;
  });

  // Sort by year first (most reliable), then ID, then suffix
  characterVariants.sort((a, b) => {
    // Parse ID: sw1500a → prefix="sw", num=1500, suffix="a"
    const parseId = (id: string) => {
      const match = id.match(/^([a-z]+)(\d+)([a-z])?$/i);
      if (!match) return { prefix: id, num: 0, suffix: '' };
      return {
        prefix: match[1],
        num: parseInt(match[2]),
        suffix: match[3] || ''
      };
    };

    const aParsed = parseId(a.minifigure_no);
    const bParsed = parseId(b.minifigure_no);

    // Parse years
    const aYear = a.year_released ? parseInt(a.year_released) : 0;
    const bYear = b.year_released ? parseInt(b.year_released) : 0;
    const aYearValid = !isNaN(aYear) && aYear > 0;
    const bYearValid = !isNaN(bYear) && bYear > 0;

    // PRIMARY SORT: Year (newest first, unknown years at bottom)
    // Year is most reliable data from BrickLink
    if (aYearValid && bYearValid) {
      if (aYear !== bYear) {
        return bYear - aYear; // 2023 > 2019 > 2010
      }
    } else if (aYearValid && !bYearValid) {
      return -1; // Valid year comes first
    } else if (!aYearValid && bYearValid) {
      return 1; // Unknown year goes last
    }

    // SECONDARY SORT: Within same year, sort by ID number (descending)
    // sw1507 > sw0106 (higher ID = newer within same year)
    if (aParsed.num !== bParsed.num) {
      return bParsed.num - aParsed.num;
    }

    // TERTIARY SORT: Same year, same ID number - sort by suffix
    // sw0106 comes before sw0106a, sw0106b, etc.
    return aParsed.suffix.localeCompare(bParsed.suffix);
  });

  // Fetch similar set minifigs (nearby item numbers: 4 before, 4 after)
  // Extract prefix and number from item (e.g., "sw1507" → prefix="sw", num=1507)
  const match = itemNo.match(/^([a-z]+)(\d+)([a-z])?$/i);
  let themeMinifigs: any[] = [];

  if (match) {
    const prefix = match[1];
    const currentNum = parseInt(match[2]);

    // Try to get 4 before and 4 after
    const minNum = Math.max(1, currentNum - 4);
    const maxNum = currentNum + 4;

    // Generate possible item numbers
    const targetNumbers: string[] = [];
    for (let i = minNum; i <= maxNum; i++) {
      if (i !== currentNum) {
        targetNumbers.push(`${prefix}${i.toString().padStart(match[2].length, '0')}`);
      }
    }

    // Query from same-category minifigs for these specific item numbers
    const foundMinifigs = categoryMinifigs
      .filter(m => targetNumbers.includes(m.minifigure_no))
      .sort((a, b) => a.minifigure_no.localeCompare(b.minifigure_no));

    // If we didn't find 8, expand the range to get more
    if (foundMinifigs.length < 8) {
      const needed = 8 - foundMinifigs.length;
      const expandedMin = Math.max(1, minNum - needed);
      const expandedMax = maxNum + needed;

      const expandedNumbers: string[] = [];
      for (let i = expandedMin; i < minNum; i++) {
        expandedNumbers.push(`${prefix}${i.toString().padStart(match[2].length, '0')}`);
      }
      for (let i = maxNum + 1; i <= expandedMax; i++) {
        expandedNumbers.push(`${prefix}${i.toString().padStart(match[2].length, '0')}`);
      }

      const additionalMinifigs = categoryMinifigs
        .filter(m => expandedNumbers.includes(m.minifigure_no))
        .sort((a, b) => a.minifigure_no.localeCompare(b.minifigure_no));

      themeMinifigs = [...foundMinifigs, ...additionalMinifigs].slice(0, 8);
    } else {
      themeMinifigs = foundMinifigs.slice(0, 8);
    }
  }

  const variantsData = characterVariants.map(m => ({
    no: m.minifigure_no,
    name: m.name,
    image_url: `https://img.bricklink.com/ItemImage/MN/0/${m.minifigure_no}.png`
  }));

  const similarSetsData = themeMinifigs.map(m => ({
    no: m.minifigure_no,
    name: m.name,
    image_url: `https://img.bricklink.com/ItemImage/MN/0/${m.minifigure_no}.png`
  }));

  // Get parent theme for breadcrumbs
  const parentTheme = minifig.category_name.split(' / ')[0];
  const themeSlug = parentTheme.toLowerCase().replace(/\s+/g, '-');

  // Get locale for structured data
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  const localeMap = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
  };

  const baseUrl = domains[locale as keyof typeof domains];

  // Schema.org structured data for rich search results
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: minifig.name,
    description: `${minifig.category_name} LEGO minifigure ${minifig.minifigure_no}`,
    image: `https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`,
    brand: {
      '@type': 'Brand',
      name: 'LEGO'
    },
    category: minifig.category_name,
    identifier: minifig.minifigure_no,
    inLanguage: localeMap[locale as keyof typeof localeMap],
    ...(minifig.year_released && {
      releaseDate: minifig.year_released
    }),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Themes',
        item: `${baseUrl}/themes`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: parentTheme,
        item: `${baseUrl}/themes/${themeSlug}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: minifig.name,
        item: `${baseUrl}/minifigs/${minifig.minifigure_no}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MinifigDetailClient minifig={minifigData} variants={variantsData} similarSets={similarSetsData} />
    </>
  );
}
