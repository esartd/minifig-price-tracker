import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBoxByNumber, loadAllBoxes } from '@/lib/boxes-data';
import SetDetailClient from '@/components/set-detail-client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Disable pre-rendering at build time
export async function generateStaticParams() {
  return [];
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ boxNo: string }>
}): Promise<Metadata> {
  const { boxNo } = await params;

  const set = getBoxByNumber(boxNo);

  if (!set) {
    return {
      title: 'Set Not Found',
    };
  }

  return {
    title: `${set.name} (${set.box_no}) - LEGO Set Price Guide`,
    description: `${set.category_name} - ${set.name}. Track current BrickLink prices and manage your LEGO set inventory. Released ${set.year_released || 'date unknown'}. Weight: ${set.weight}g.`,
    keywords: [
      'LEGO set',
      set.name,
      set.box_no,
      set.category_name,
      'BrickLink price',
      'set price guide',
      'LEGO price tracker',
      'collectible sets',
      'LEGO inventory'
    ],
    openGraph: {
      title: `${set.name} - ${set.category_name}`,
      description: `LEGO Set ${set.box_no} - Price tracking and inventory management`,
      images: [set.image_url],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${set.name}`,
      description: `${set.category_name} set price guide`,
      images: [set.image_url],
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

  // Transform to expected format
  const setData = {
    box_no: set.box_no,
    name: set.name,
    category_id: set.category_id,
    category_name: set.category_name,
    year_released: set.year_released,
    weight: set.weight,
    image_url: set.image_url
  };

  // Fetch sets from the same theme
  const allBoxes = loadAllBoxes();
  const parentTheme = set.category_name.split(' / ')[0].trim();

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
    .slice(0, 12);

  const themeSetsData = themeSets.map(b => ({
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
    weight: {
      '@type': 'QuantitativeValue',
      value: set.weight,
      unitCode: 'GRM'
    },
    ...(set.year_released && {
      releaseDate: set.year_released
    }),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };

  // BreadcrumbList schema for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://figtracker.ericksu.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sets',
        item: 'https://figtracker.ericksu.com/sets/browse'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: parentTheme,
        item: `https://figtracker.ericksu.com/sets-themes/${encodeURIComponent(parentTheme.toLowerCase().replace(/\s+/g, '-'))}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: set.name,
        item: `https://figtracker.ericksu.com/sets/${set.box_no}`
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
      <SetDetailClient
        set={setData}
        themeSets={themeSetsData}
        sameYearSets={sameYearData}
      />
    </>
  );
}
