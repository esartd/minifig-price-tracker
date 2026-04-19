/**
 * Static catalog service - reads from JSON files instead of database
 * This eliminates database bandwidth usage for catalog queries
 */

export interface MinifigCatalogItem {
  minifigure_no: string;
  name: string;
  category_id: number;
  category_name: string;
  year_released: string | null;
  weight: string | null;
  size: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  updated_at: string;
}

let catalogCache: MinifigCatalogItem[] | null = null;
let categoriesCache: Map<number, { name: string; count: number }> | null = null;

/**
 * Load catalog from JSON file (works both server and client side)
 */
async function loadCatalog(): Promise<MinifigCatalogItem[]> {
  if (catalogCache) return catalogCache;

  try {
    // Server-side: read from file
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'catalog', 'minifigs.json');
      const content = fs.readFileSync(filePath, 'utf-8');
      catalogCache = JSON.parse(content);
      return catalogCache!;
    }

    // Client-side: fetch from public folder
    const response = await fetch('/catalog/minifigs.json');
    if (!response.ok) {
      throw new Error('Failed to load catalog');
    }
    catalogCache = await response.json();
    return catalogCache!;
  } catch (error) {
    console.error('Error loading catalog:', error);
    return [];
  }
}

/**
 * Get all minifigs
 */
export async function getAllMinifigs(): Promise<MinifigCatalogItem[]> {
  return loadCatalog();
}

/**
 * Find minifig by number
 */
export async function findMinifigByNumber(minifigure_no: string): Promise<MinifigCatalogItem | null> {
  const catalog = await loadCatalog();
  return catalog.find(m => m.minifigure_no === minifigure_no) || null;
}

/**
 * Search minifigs by query
 */
export async function searchMinifigs(query: string, limit = 50): Promise<MinifigCatalogItem[]> {
  const catalog = await loadCatalog();
  const lowerQuery = query.toLowerCase();

  return catalog
    .filter(m =>
      m.minifigure_no.toLowerCase().includes(lowerQuery) ||
      m.name.toLowerCase().includes(lowerQuery) ||
      m.category_name.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}

/**
 * Get minifigs by category
 */
export async function getMinifigsByCategory(categoryName: string): Promise<MinifigCatalogItem[]> {
  const catalog = await loadCatalog();
  return catalog.filter(m => m.category_name === categoryName);
}

/**
 * Get minifigs by category ID
 */
export async function getMinifigsByCategoryId(categoryId: number): Promise<MinifigCatalogItem[]> {
  const catalog = await loadCatalog();
  return catalog.filter(m => m.category_id === categoryId);
}

/**
 * Get all categories with counts
 */
export async function getAllCategories(): Promise<Array<{ id: number; name: string; count: number }>> {
  const catalog = await loadCatalog();

  const categoryMap = new Map<number, { name: string; count: number }>();

  for (const minifig of catalog) {
    const existing = categoryMap.get(minifig.category_id);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(minifig.category_id, {
        name: minifig.category_name,
        count: 1
      });
    }
  }

  return Array.from(categoryMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    count: data.count
  }));
}

/**
 * Get recent minifigs (for current themes detection)
 */
export async function getRecentMinifigs(yearsSince: number): Promise<MinifigCatalogItem[]> {
  const catalog = await loadCatalog();
  const currentYear = new Date().getFullYear();
  const cutoffYear = currentYear - yearsSince;

  return catalog.filter(m => {
    if (!m.year_released) return false;
    const year = parseInt(m.year_released);
    return !isNaN(year) && year >= cutoffYear;
  });
}

/**
 * Export catalog from database to JSON (run this after BrickLink download)
 */
export async function exportCatalogToJSON() {
  // This will be called by the cron job after downloading from BrickLink
  const { prismaPublic } = await import('./prisma');

  const minifigs = await prismaPublic.minifigCatalog.findMany({
    orderBy: { minifigure_no: 'asc' }
  });

  return minifigs;
}
