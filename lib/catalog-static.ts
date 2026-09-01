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
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours - catalog rarely changes
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
 *
 * PHASE 1 TEST CASES:
 * ✓ "din" → Din Djarin only, NOT "Riding" or "Dinkley"
 * ✓ "ale" → should NOT match "Male" or "Female"
 * ✓ "yoda" → Yoda only, NOT "Young"
 * ✓ "clone" → Clone Troopers
 * ✓ "sw1219" → Exact ID match
 * ✓ "captain rex" → Multi-word match
 */
export async function searchMinifigs(query: string, limit = 50): Promise<MinifigCatalogItem[]> {
  const catalog = await loadCatalog();
  const queryL = query.toLowerCase().trim();

  if (!queryL) return catalog.slice(0, limit);

  console.log(`[searchMinifigs] Query: "${query}", Catalog size: ${catalog.length}`);

  // 1. Intent detection: Is this an ID or name search?
  const isItemNumber = /^[a-z]{2,4}\d{3,4}[a-z]?$/i.test(queryL);

  // 2. Exact ID match (fast path)
  if (isItemNumber) {
    const exact = catalog.find(m => m.minifigure_no.toLowerCase() === queryL);
    if (exact) {
      console.log(`[searchMinifigs] Exact ID match: ${exact.minifigure_no}`);
      return [exact];
    }
  }

  // 3. Scoring function with word boundary matching
  function calculateScore(minifig: MinifigCatalogItem): number {
    const nameLower = minifig.name.toLowerCase();
    const idLower = minifig.minifigure_no.toLowerCase();
    const categoryLower = minifig.category_name.toLowerCase();

    // Normalize: remove hyphens/special chars for comparison (e.g., "N-1" → "n1")
    // Whitespace is stripped too, so the way someone types a name doesn't
    // matter: "u wing", "u-wing" and "uwing" all normalise to "uwing".
    const nameNormalized = nameLower.replace(/[\-'\s]/g, '');
    const queryNormalized = queryL.replace(/[\-'\s]/g, '');

    // Exact matches
    if (nameLower === queryL || nameNormalized === queryNormalized) return 1000;
    if (idLower === queryL) return 1000;

    // Name starts with query
    if (nameLower.startsWith(queryL) || nameNormalized.startsWith(queryNormalized)) return 500;

    // Tokenize and check word boundaries
    const nameWords = nameLower.split(/[\s\/\-]+/);
    const categoryWords = categoryLower.split(/[\s\/\-]+/);

    // Word boundary exact match (prevents "din" matching "riding")
    if (nameWords.some(word => word === queryL)) return 400;

    // Word starts with query (with length ratio check)
    if (nameWords.some(word => {
      if (!word.startsWith(queryL)) return false;
      const lengthRatio = queryL.length / word.length;
      return lengthRatio >= 0.6 || word.length <= queryL.length + 2;
    })) return 300;

    // ID matching
    if (idLower.startsWith(queryL)) return 250;
    if (idLower.includes(queryL)) return 200;

    // Multi-word queries: all words must match
    const queryWords = queryL.split(/\s+/).filter(w => w.length >= 2);
    if (queryWords.length > 1) {
      // Try matching against normalized name (handles "n1" matching "n-1")
      const queryWordsNormalized = queryWords.map(w => w.replace(/[\-']/g, ''));
      const nameWordsNormalized = nameWords.map(w => w.replace(/[\-']/g, ''));

      const allMatchNormalized = queryWordsNormalized.every(qWord =>
        nameWordsNormalized.some(nWord => nWord.includes(qWord) || qWord.includes(nWord))
      );
      if (allMatchNormalized) return 85;

      // Fallback to regular word matching
      const allMatch = queryWords.every(qWord =>
        nameWords.some(nWord => nWord.startsWith(qWord))
      );
      if (allMatch) return 85;
    }

    // Category matching ONLY if nothing else matched - prevents pollution
    // Only match if query is very specific (>6 chars) to avoid "clone" matching "Clone Wars" series
    if (queryL.length > 6) {
      if (categoryWords.some(word => word === queryL)) return 30;
      if (categoryWords.some(word => word.startsWith(queryL) && word.length >= 8)) return 15;
    }

    // Match the query against a run of consecutive words, anchored to a word
    // start. "uwing" matches "Rebel [U] [Wing] Fighter" because the run
    // "u"+"wing" begins at a word boundary, while "ewing" correctly does NOT
    // match "Sewing Machine" or "The Winged Keys" — a plain substring test
    // matched both, which is why unanchored substring matching was avoided
    // here originally. Gated at 4+ characters so short queries stay precise.
    if (queryNormalized.length >= 4) {
      const normWords = nameWords.map(w => w.replace(/[\-']/g, ''));
      for (let i = 0; i < normWords.length; i++) {
        if (normWords.slice(i).join('').startsWith(queryNormalized)) return 120;
      }
    }

    return 0; // NO unguarded substring matching
  }

  // 4. Score, filter, and sort
  const results = catalog
    .map(m => ({ ...m, score: calculateScore(m) }))
    .filter(m => m.score > 0)
    .sort((a, b) => {
      // Primary: Score
      if (b.score !== a.score) return b.score - a.score;

      // Secondary: Year (newer first)
      const aYear = parseInt(a.year_released || '0') || 0;
      const bYear = parseInt(b.year_released || '0') || 0;
      if (bYear !== aYear) return bYear - aYear;

      // Tertiary: ID
      return b.minifigure_no.localeCompare(a.minifigure_no);
    })
    .slice(0, limit);

  console.log(`[searchMinifigs] Found ${results.length} matches for "${query}"`);

  // Debug: Log first 3 results
  if (results.length > 0) {
    console.log(`[searchMinifigs] Top 3 results:`);
    results.slice(0, 3).forEach((m, i) => {
      console.log(`  ${i + 1}. [Score: ${m.score}] ${m.year_released} | ${m.minifigure_no} | ${m.name.substring(0, 40)}`);
    });
  }

  return results;
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
