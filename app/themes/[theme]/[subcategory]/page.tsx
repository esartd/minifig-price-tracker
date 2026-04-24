import { Metadata } from 'next';
import SubcategoryPageClient from '@/components/subcategory-page-client';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ theme: string; subcategory: string }>
}): Promise<Metadata> {
  const { theme, subcategory } = await params;
  const decodedTheme = decodeURIComponent(theme);
  const decodedSubcategory = decodeURIComponent(subcategory);

  // Fetch minifigs count
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';
  let minifigCount = 0;

  try {
    const fullCategoryName = decodedSubcategory === 'Uncategorized'
      ? decodedTheme
      : `${decodedTheme} / ${decodedSubcategory}`;

    const response = await fetch(
      `${baseUrl}/api/minifigs/search?subcategory=${encodeURIComponent(fullCategoryName)}`,
      { cache: 'no-store' }
    );
    const data = await response.json();

    if (data.success && data.data) {
      minifigCount = data.data.length;
    }
  } catch (error) {
    console.error('Failed to fetch metadata for subcategory:', error);
  }

  // Build appropriate title and description
  const isUncategorized = decodedSubcategory === 'Uncategorized';
  const displayName = isUncategorized ? decodedTheme : decodedSubcategory;
  const fullName = isUncategorized ? decodedTheme : `${decodedTheme} ${decodedSubcategory}`;

  const title = `${displayName} LEGO Minifigures${minifigCount > 0 ? ` (${minifigCount.toLocaleString()})` : ''} | FigTracker`;
  const description = minifigCount > 0
    ? `Browse all ${minifigCount.toLocaleString()} ${fullName} LEGO minifigures with real-time BrickLink pricing. Track prices, manage your collection, and discover rare variants.`
    : `Browse ${fullName} LEGO minifigures with real-time BrickLink pricing. Track prices and manage your collection.`;

  return {
    title,
    description,
    keywords: [
      `${fullName} LEGO minifigures`,
      `${displayName} LEGO`,
      `${displayName} minifig price`,
      `${decodedTheme} ${decodedSubcategory}`,
      'BrickLink prices',
      'LEGO price guide',
      'minifigure collection'
    ],
    openGraph: {
      title: `${displayName} LEGO Minifigures | FigTracker`,
      description,
      url: `https://figtracker.ericksu.com/themes/${theme}/${subcategory}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${displayName} LEGO Minifigures`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} LEGO Minifigures`,
      description,
    },
    alternates: {
      canonical: `https://figtracker.ericksu.com/themes/${theme}/${subcategory}`,
    },
  };
}

export default async function SubcategoryPage({
  params
}: {
  params: Promise<{ theme: string; subcategory: string }>
}) {
  const resolvedParams = await params;

  return <SubcategoryPageClient params={Promise.resolve(resolvedParams)} />;
}
