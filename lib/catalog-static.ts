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

/**
 * Per-item strings that searchMinifigs() needs, computed once per catalog load
 * instead of once per item per keystroke.
 *
 * Measured before this existed: searchMinifigs() took 18-49ms per call on a
 * fast laptop, and the autocomplete endpoint spent 0.25-0.85s of server time
 * per request on the VPS. calculateScore() was doing three .toLowerCase()
 * calls, a .replace(), and two .split() calls on EVERY one of 19,147 items,
 * for every keystroke -- roughly 150k throwaway strings per request. None of
 * it depends on the query, so none of it needed to be in the loop.
 *
 * `normJoined` and `wordOffsets` exist to kill the one quadratic step:
 * the scorer used to run `normWords.slice(i).join('')` for every word
 * position, allocating a fresh array and a fresh string each time. That is
 * exactly `normJoined.startsWith(query, wordOffsets[i])`, which allocates
 * nothing.
 */
interface SearchIndexEntry {
  nameLower: string;
  idLower: string;
  categoryLower: string;
  nameNormalized: string;
  nameWords: string[];
  categoryWords: string[];
  normWords: string[];
  /** normWords joined; with wordOffsets, replaces slice().join() entirely. */
  normJoined: string;
  /** Start of each normWords entry inside normJoined. */
  wordOffsets: number[];
}

let searchIndex: SearchIndexEntry[] | null = null;

function buildSearchIndex(catalog: MinifigCatalogItem[]): SearchIndexEntry[] {
  return catalog.map((m) => {
    const nameLower = m.name.toLowerCase();
    const nameWords = nameLower.split(/[\s\/\-]+/);
    const normWords = nameWords.map((w) => w.replace(/[\-']/g, ''));

    const wordOffsets: number[] = [];
    let offset = 0;
    for (const w of normWords) {
      wordOffsets.push(offset);
      offset += w.length;
    }

    return {
      nameLower,
      idLower: m.minifigure_no.toLowerCase(),
      categoryLower: m.category_name.toLowerCase(),
      nameNormalized: nameLower.replace(/[\-'\s]/g, ''),
      nameWords,
      categoryWords: m.category_name.toLowerCase().split(/[\s\/\-]+/),
      normWords,
      normJoined: normWords.join(''),
      wordOffsets,
    };
  });
}

/** The index, built on first use and thrown away whenever the catalog reloads. */
function getSearchIndex(catalog: MinifigCatalogItem[]): SearchIndexEntry[] {
  if (!searchIndex || searchIndex.length !== catalog.length) {
    searchIndex = buildSearchIndex(catalog);
  }
  return searchIndex;
}
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
          searchIndex = null; // catalog replaced -- rebuild lazily
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
      searchIndex = null; // catalog replaced -- rebuild lazily
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

  // 3. Scoring function with word boundary matching.
  //
  // Everything derived from the QUERY is computed once, here, instead of once
  // per item inside the loop -- queryNormalized alone was being recomputed
  // 19,147 times per keystroke to produce the same string every time.
  //
  // Everything derived from the ITEM comes from the prebuilt search index
  // (see SearchIndexEntry above), so the loop does comparisons only and
  // allocates nothing.
  //
  // Scores and their order are unchanged; this is the same ladder, reading
  // precomputed strings.
  const queryNormalized = queryL.replace(/[\-'\s]/g, '');
  const queryWords = queryL.split(/\s+/).filter(w => w.length >= 2);
  const queryWordsNormalized = queryWords.map(w => w.replace(/[\-']/g, ''));
  const isMultiWord = queryWords.length > 1;
  const checkCategory = queryL.length > 6;
  const checkWordRun = queryNormalized.length >= 4;

  function calculateScore(idx: SearchIndexEntry): number {
    const { nameLower, idLower, nameNormalized, nameWords, categoryWords } = idx;

    // Exact matches
    if (nameLower === queryL || nameNormalized === queryNormalized) return 1000;
    if (idLower === queryL) return 1000;

    // Name starts with query
    if (nameLower.startsWith(queryL) || nameNormalized.startsWith(queryNormalized)) return 500;

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
    if (isMultiWord) {
      const nameWordsNormalized = idx.normWords;

      const allMatchNormalized = queryWordsNormalized.every(qWord =>
        nameWordsNormalized.some(nWord => nWord.includes(qWord) || qWord.includes(nWord))
      );
      if (allMatchNormalized) return 85;

      const allMatch = queryWords.every(qWord =>
        nameWords.some(nWord => nWord.startsWith(qWord))
      );
      if (allMatch) return 85;
    }

    // Category matching ONLY if nothing else matched - prevents pollution
    // Only match if query is very specific (>6 chars) to avoid "clone" matching "Clone Wars" series
    if (checkCategory) {
      if (categoryWords.some(word => word === queryL)) return 30;
      if (categoryWords.some(word => word.startsWith(queryL) && word.length >= 8)) return 15;
    }

    // Match the query against a run of consecutive words, anchored to a word
    // start. "uwing" matches "Rebel [U] [Wing] Fighter" because the run
    // "u"+"wing" begins at a word boundary, while "ewing" correctly does NOT
    // match "Sewing Machine" or "The Winged Keys" -- a plain substring test
    // matched both, which is why unanchored substring matching was avoided
    // here originally. Gated at 4+ characters so short queries stay precise.
    //
    // Was `normWords.slice(i).join('').startsWith(q)` per position, which
    // built a new array and a new string each time. normJoined.startsWith at
    // the word's offset is the identical test with no allocation.
    if (checkWordRun) {
      const { normJoined, wordOffsets } = idx;
      for (let i = 0; i < wordOffsets.length; i++) {
        if (normJoined.startsWith(queryNormalized, wordOffsets[i])) return 120;
      }
    }

    return 0; // NO unguarded substring matching
  }

  // 4. Score, filter, and sort.
  //
  // One pass that only allocates for items that actually score. The old
  // `.map(m => ({ ...m, score }))` spread all 19,147 catalog objects into
  // copies and then threw away the ~19,140 that scored zero.
  const index = getSearchIndex(catalog);
  const scored: Array<MinifigCatalogItem & { score: number }> = [];
  for (let i = 0; i < catalog.length; i++) {
    const score = calculateScore(index[i]);
    if (score > 0) scored.push({ ...catalog[i], score });
  }

  const results = scored
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
