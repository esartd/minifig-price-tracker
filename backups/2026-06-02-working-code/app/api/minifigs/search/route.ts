import { NextRequest, NextResponse } from 'next/server';
import { getAllMinifigs, findMinifigByNumber } from '@/lib/catalog-static';
import { expandSynonyms } from '@/lib/search-synonyms';

/**
 * SEARCH IMPLEMENTATION
 *
 * This endpoint provides search with:
 * 1. Exact ID search: Fast lookup in catalog (e.g., sw0002)
 * 2. Name-based search: Word boundary matching with intelligent scoring
 * 3. Synonym expansion: "baby yoda" → "grogu"
 * 4. Multi-word query support: "captain rex", "n1 starfighter"
 *
 * This complies with BrickLink API Terms:
 * - Catalog data is from their official download, not systematic API enumeration
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category');
    const subcategory = searchParams.get('subcategory'); // Full category_name for subcategory filtering

    // Subcategory browsing (by full category_name)
    if (!query && subcategory) {
      const allMinifigs = await getAllMinifigs();

      // Try exact match first
      let catalogItems = allMinifigs.filter(m => m.category_name === subcategory);

      // SAFEGUARD: If no exact match, try fuzzy match (case-insensitive, ignore special chars)
      if (catalogItems.length === 0) {
        console.warn(`⚠️  No exact match for subcategory "${subcategory}", trying fuzzy match...`);

        const normalizeTheme = (str: string) =>
          str.toLowerCase()
            .replace(/[^a-z0-9]/g, '');

        const normalizedQuery = normalizeTheme(subcategory);

        catalogItems = allMinifigs.filter(m => {
          const normalizedCategory = normalizeTheme(m.category_name);
          return normalizedCategory === normalizedQuery;
        });

        if (catalogItems.length > 0) {
          console.log(`✅ Fuzzy match found: "${subcategory}" → "${catalogItems[0].category_name}"`);
        }
      }

      catalogItems = catalogItems
        .sort((a, b) => {
          // Parse years - treat invalid/missing as 0 to sort them last
          const aYear = a.year_released && !isNaN(parseInt(a.year_released)) ? parseInt(a.year_released) : 0;
          const bYear = b.year_released && !isNaN(parseInt(b.year_released)) ? parseInt(b.year_released) : 0;

          // Sort by year descending (newest first, unknown at bottom)
          if (bYear !== aYear) return bYear - aYear;

          // Within same year, sort by ID descending
          return b.minifigure_no.localeCompare(a.minifigure_no);
        })
        .slice(0, 500);

      const matchedItems = catalogItems.map(item => ({
        no: item.minifigure_no,
        name: item.name,
        category_id: item.category_id,
        category_name: item.category_name,
        year_released: item.year_released,
        image_url: `/api/images/minifig/${item.minifigure_no}`
      }));

      return NextResponse.json({
        success: true,
        data: matchedItems,
        total: matchedItems.length,
        category: subcategory,
        source: 'catalog_subcategory'
      });
    }

    // Category browsing (no search query, just category)
    if (!query && categoryId) {
      const categoryIdNum = parseInt(categoryId);
      const allMinifigs = await getAllMinifigs();

      const catalogItems = allMinifigs
        .filter(m => m.category_id === categoryIdNum)
        .sort((a, b) => {
          // Parse years - treat invalid/missing as 0 to sort them last
          const aYear = a.year_released && !isNaN(parseInt(a.year_released)) ? parseInt(a.year_released) : 0;
          const bYear = b.year_released && !isNaN(parseInt(b.year_released)) ? parseInt(b.year_released) : 0;

          // Sort by year descending (newest first, unknown at bottom)
          if (bYear !== aYear) return bYear - aYear;

          // Within same year, sort by ID descending
          return b.minifigure_no.localeCompare(a.minifigure_no);
        })
        .slice(0, 500);

      const matchedItems = catalogItems.map(item => ({
        no: item.minifigure_no,
        name: item.name,
        category_id: item.category_id,
        category_name: item.category_name,
        year_released: item.year_released,
        image_url: `/api/images/minifig/${item.minifigure_no}`
      }));

      return NextResponse.json({
        success: true,
        data: matchedItems,
        total: matchedItems.length,
        category: matchedItems[0]?.category_name || 'Unknown',
        source: 'catalog_category'
      });
    }

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Missing search query' },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();

    // Apply synonym expansion (e.g., "baby yoda" → "grogu")
    const { expanded, matched, synonym } = expandSynonyms(searchTerm);
    const finalQuery = expanded;

    // Check if it's an exact item number (e.g., sw0002, dis134, hp001)
    const isItemNumber = /^[a-z]{2,4}\d{3,4}[a-z]?$/i.test(finalQuery);

    if (isItemNumber) {
      const itemNo = searchTerm.toLowerCase();

      // Check catalog first (instant)
      const catalogItem = await findMinifigByNumber(itemNo);

      if (catalogItem) {
        return NextResponse.json({
          success: true,
          data: [{
            no: catalogItem.minifigure_no,
            name: catalogItem.name,
            category_id: catalogItem.category_id,
            category_name: catalogItem.category_name,
            year_released: catalogItem.year_released,
            image_url: `https://img.bricklink.com/ItemImage/MN/0/${catalogItem.minifigure_no}.png`
          }],
          source: 'catalog_exact_match',
          synonymExpanded: matched ? {
            original: searchTerm,
            expanded: finalQuery,
            category: synonym?.category
          } : undefined
        });
      }

      // Not in static catalog (has all 18,732 minifigs) - not found
      return NextResponse.json({
        success: false,
        error: `Minifigure "${searchTerm}" not found. Please verify the item number is correct.`,
      }, { status: 404 });
    }

    // NAME-BASED SEARCH: Search from static catalog with intelligent ranking
    const searchLower = finalQuery.toLowerCase();
    const categoryIdNum = categoryId ? parseInt(categoryId) : null;
    const allMinifigs = await getAllMinifigs();

    // Helper: Calculate relevance score (higher = better match)
    const calculateScore = (minifig: any): number => {
      const nameLower = minifig.name.toLowerCase();
      const categoryLower = minifig.category_name.toLowerCase();
      const idLower = minifig.minifigure_no.toLowerCase();

      // Exact name match = highest priority
      if (nameLower === searchLower) return 1000;

      // Name starts with search term = very high priority
      if (nameLower.startsWith(searchLower)) return 500;

      // Word boundary match in name (e.g., "Alex" matches "Alex Kidd" not "Male" or "Riding")
      const nameWords = nameLower.split(/\s+/);
      if (nameWords.some((word: string) => word === searchLower)) return 400;

      // Word starts with search - but require good match (prevent "yoda" matching "Young")
      // Only match if search term is at least 60% of the word length, or word length <= search + 2
      if (nameWords.some((word: string) => {
        if (!word.startsWith(searchLower)) return false;
        const lengthRatio = searchLower.length / word.length;
        return lengthRatio >= 0.6 || word.length <= searchLower.length + 2;
      })) return 300;

      // ID starts with search = high priority
      if (idLower.startsWith(searchLower)) return 250;

      // ID contains search = medium-high priority
      if (idLower.includes(searchLower)) return 200;

      // Category word boundary match only (no substring)
      const categoryWords = categoryLower.split(/[\s\/]+/);
      if (categoryWords.some((word: string) => word === searchLower)) return 150;
      if (categoryWords.some((word: string) => word.startsWith(searchLower))) return 100;

      // NO name substring matching - too many false positives
      // (e.g., "din" matching "Riding", "ale" matching "Male")

      return 0;
    };

    // Filter and score catalog items
    const catalogItems = allMinifigs
      .map(m => ({ ...m, score: calculateScore(m) }))
      .filter(m => {
        const matchesCategory = !categoryIdNum || m.category_id === categoryIdNum;
        return m.score > 0 && matchesCategory;
      })
      .sort((a, b) => {
        // Sort by relevance score first
        if (b.score !== a.score) return b.score - a.score;

        // Within same score, sort by year (newest first)
        const aYear = !a.year_released || isNaN(parseInt(a.year_released)) ? 0 : parseInt(a.year_released);
        const bYear = !b.year_released || isNaN(parseInt(b.year_released)) ? 0 : parseInt(b.year_released);
        if (bYear !== aYear) return bYear - aYear;

        // Within same year, sort by ID descending
        return b.minifigure_no.localeCompare(a.minifigure_no);
      })
      .slice(0, 200);

    // Map catalog items to response format
    const matchedItems = catalogItems.map(item => ({
      no: item.minifigure_no,
      name: item.name,
      category_id: item.category_id,
      category_name: item.category_name,
      year_released: item.year_released,
      image_url: `https://img.bricklink.com/ItemImage/MN/0/${item.minifigure_no}.png`
    }));

    if (matchedItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No minifigures found matching "${searchTerm}". Try a different search term or check spelling.`,
        hint: {
          message: 'Search by name (e.g., "Luke Skywalker") or BrickLink ID (e.g., "sw1219")',
          examples: ['luke skywalker', 'darth vader', 'sw1219', 'hp001']
        }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: matchedItems,
      total: matchedItems.length,
      source: 'catalog',
      synonymExpanded: matched ? {
        original: searchTerm,
        expanded: finalQuery,
        category: synonym?.category
      } : undefined
    });

  } catch (error) {
    console.error('Error searching minifigures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search minifigures' },
      { status: 500 }
    );
  }
}
