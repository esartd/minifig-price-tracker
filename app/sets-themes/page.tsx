import SetsThemesClient from './sets-themes-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse LEGO Sets by Theme',
  description: 'Explore LEGO sets organized by theme. Browse Star Wars, Harry Potter, Friends, and 170+ other themes.',
};

interface Theme {
  parent: string;
  subcategories: Array<{
    name: string;
    fullName: string;
    count: number;
  }>;
  totalCount: number;
  representativeImage: string | null;
  fallbackImages: string[];
  isCurrent: boolean;
}

async function getThemes(): Promise<{ themes: Theme[]; currentThemes: Theme[] }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/boxes/themes`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch themes');
    }

    const data = await response.json();
    return {
      themes: data.data.themes || [],
      currentThemes: data.data.currentThemes || []
    };
  } catch (error) {
    console.error('Error fetching themes:', error);
    return { themes: [], currentThemes: [] };
  }
}

export default async function SetsThemesPage() {
  const { themes, currentThemes } = await getThemes();

  return <SetsThemesClient themes={themes} currentThemes={currentThemes} />;
}
