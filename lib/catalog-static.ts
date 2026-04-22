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
 * ONLY loads on server-side from filesystem - client uses direct API calls
 */
async function loadCatalog(): Promise<MinifigCatalogItem[]> {
  if (catalogCache) return catalogCache;

  // Server-side ONLY - load from filesystem
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'catalog', 'minifigs.json');

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        catalogCache = JSON.parse(content);
        console.log('[CATALOG] Loaded from filesystem:', catalogCache?.length || 0, 'minifigs');
        return catalogCache!;
      } else {
        console.error('[CATALOG] File not found:', filePath);
        return [];
      }
    } catch (fsError) {
      console.error('[CATALOG] Filesystem error:', fsError);
      return [];
    }
  }

  // Client-side: Don't load full catalog - return empty and use specific lookups
  console.warn('[CATALOG] Client-side should not load full catalog');
  return [];
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
  // Server-side: use filesystem
  if (typeof window === 'undefined') {
    const catalog = await loadCatalog();
    return catalog.find(m => m.minifigure_no === minifigure_no) || null;
  }

  // Client-side: use API route
  try {
    const response = await fetch(`/api/catalog/minifig/${minifigure_no}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Search minifigs by query
 */
export async function searchMinifigs(query: string, limit = 50): Promise<MinifigCatalogItem[]> {
  const catalog = await loadCatalog();
  const lowerQuery = query.toLowerCase();

  return catalog
    .filter(m =>
      m.minifigure_no && ( // Skip entries with null minifigure_no
        m.minifigure_no.toLowerCase().includes(lowerQuery) ||
        m.name.toLowerCase().includes(lowerQuery) ||
        m.category_name.toLowerCase().includes(lowerQuery)
      )
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
  // Server-side: use filesystem
  if (typeof window === 'undefined') {
    const catalog = await loadCatalog();
    return catalog.filter(m => m.category_id === categoryId);
  }

  // Client-side: use API route
  try {
    const response = await fetch(`/api/catalog/category/${categoryId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

/**
 * Get all categories with counts
 */
export async function getAllCategories(): Promise<Array<{ id: number; name: string; count: number }>> {
  const catalog = await loadCatalog();

  // Group by category_name instead of category_id
  // (BrickLink uses same category_id for parent theme and all subcategories)
  const categoryMap = new Map<string, { id: number; count: number }>();

  for (const minifig of catalog) {
    const existing = categoryMap.get(minifig.category_name);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(minifig.category_name, {
        id: minifig.category_id,
        count: 1
      });
    }
  }

  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    id: data.id,
    name: name,
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
