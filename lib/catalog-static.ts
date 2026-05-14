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
let cacheTimestamp: number = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes - matches typical Vercel lambda lifetime
let categoriesCache: Map<number, { name: string; count: number }> | null = null;

/**
 * Load catalog from JSON file (works both server and client side)
 * ONLY loads on server-side from filesystem - client uses direct API calls
 */
async function loadCatalog(): Promise<MinifigCatalogItem[]> {
  const now = Date.now();

  // Check if cache is still valid
  if (catalogCache && (now - cacheTimestamp) < CACHE_TTL) {
    console.log('[CATALOG] Using cached data:', catalogCache.length, 'minifigs');
    return catalogCache;
  }

  // Server-side ONLY - load from filesystem OR database fallback
  if (typeof window === 'undefined') {
    console.log('[CATALOG] Server-side loading started...');
    try {
      const fs = await import('fs');
      const path = await import('path');

      // Try multiple possible paths where the file might be
      const possiblePaths = [
        path.join(process.cwd(), 'public', 'catalog', 'minifigs.json'),
        path.join(process.cwd(), '.next', 'static', 'catalog', 'minifigs.json'),
        '/var/task/public/catalog/minifigs.json', // Vercel Lambda path
        path.join(__dirname, '..', 'public', 'catalog', 'minifigs.json'),
      ];

      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          console.log('[CATALOG] Found file at:', filePath);
          const content = fs.readFileSync(filePath, 'utf-8');
          catalogCache = JSON.parse(content);
          cacheTimestamp = now;
          console.log('[CATALOG] Loaded from filesystem:', catalogCache?.length || 0, 'minifigs');
          return catalogCache!;
        }
      }

      // File not found in any location - fall back to database
      console.warn('[CATALOG] File not found in any location, falling back to database...');
      const { prismaPublic } = await import('./prisma');
      const minifigs = await prismaPublic.minifigCatalog.findMany({
        select: {
          minifigure_no: true,
          name: true,
          category_id: true,
          category_name: true,
          year_released: true,
          weight_grams: true,
          updated_at: true,
        }
      });

      // Transform to match expected format
      catalogCache = minifigs.map(m => ({
        minifigure_no: m.minifigure_no,
        name: m.name,
        category_id: m.category_id,
        category_name: m.category_name,
        year_released: m.year_released,
        weight: m.weight_grams?.toString() || null,
        size: null,
        image_url: `/api/images/minifig/${m.minifigure_no}`,
        thumbnail_url: `/api/images/minifig/${m.minifigure_no}`,
        updated_at: m.updated_at.toISOString(),
      }));

      cacheTimestamp = now;
      console.log('[CATALOG] Loaded from database fallback:', catalogCache.length, 'minifigs');
      return catalogCache;

    } catch (error) {
      console.error('[CATALOG] Fatal error loading catalog:', error);
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

  const matches = catalog.filter(m => {
    // Only include minifigs with valid IDs
    if (!m.minifigure_no) return false;

    return (
      m.minifigure_no.toLowerCase().includes(lowerQuery) ||
      m.name.toLowerCase().includes(lowerQuery) ||
      m.category_name.toLowerCase().includes(lowerQuery)
    );
  });

  // Sort by year (newest first), then by ID (highest first) BEFORE limiting
  matches.sort((a, b) => {
    // Parse years, treating invalid values as 0 to sort them last
    const yearA = !a.year_released || isNaN(parseInt(a.year_released)) ? 0 : parseInt(a.year_released);
    const yearB = !b.year_released || isNaN(parseInt(b.year_released)) ? 0 : parseInt(b.year_released);

    // Primary sort: year descending (newest first, unknown last)
    if (yearB !== yearA) return yearB - yearA;

    // Secondary sort: minifigure ID descending (higher IDs are usually newer)
    return b.minifigure_no.localeCompare(a.minifigure_no);
  });

  // Debug: Log first 3 results after sort
  if (matches.length > 0) {
    console.log(`[searchMinifigs] Query: "${query}", Top 3 after sort:`);
    matches.slice(0, 3).forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.year_released} | ${m.minifigure_no} | ${m.name.substring(0, 40)}`);
    });
  }

  return matches.slice(0, limit);
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
