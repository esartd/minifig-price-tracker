import type { Metadata } from 'next';
import { prisma, prismaPublic } from '@/lib/prisma';
import AboutPageClient from '@/components/about-page-client';

// Force dynamic rendering to show current searchable catalog count
export const dynamic = 'force-dynamic';

// Get count of searchable minifigs from static catalog
async function getSearchableCatalogCount(): Promise<number> {
  try {
    // Static catalog has all 18,732 minifigs available
    return 18732;
  } catch (error) {
    console.error('Error getting catalog count:', error);
    return 0;
  }
}

// Format catalog count for display
function formatCatalogCount(count: number): string {
  if (count === 0) {
    return 'thousands of';
  } else if (count >= 10000) {
    const rounded = Math.floor(count / 1000) * 1000;
    return `over ${rounded.toLocaleString()}`;
  } else if (count >= 1000) {
    const rounded = Math.ceil(count / 1000) * 1000;
    return `nearly ${rounded.toLocaleString()}`;
  } else {
    return `${count.toLocaleString()}`;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const catalogCount = await getSearchableCatalogCount();
  const catalogCountText = formatCatalogCount(catalogCount);

  return {
    title: 'About FigTracker - Free LEGO Minifigure Price Tracker',
    description: `Learn how FigTracker helps LEGO resellers and collectors price minifigures accurately with real-time Bricklink marketplace data. Search ${catalogCountText} minifigs. Free to use.`,
    openGraph: {
      title: 'About FigTracker - Free LEGO Minifigure Price Tracker',
      description: `Built by sellers, for sellers. Price your LEGO minifigures with confidence using real Bricklink data. ${catalogCountText} minifigs searchable.`,
      url: 'https://figtracker.com/about',
    },
    alternates: {
      canonical: 'https://figtracker.com/about',
    },
  };
}

export default async function AboutPage() {
  const catalogCount = await getSearchableCatalogCount();
  const catalogCountText = formatCatalogCount(catalogCount);

  return <AboutPageClient catalogCountText={catalogCountText} />;
}
