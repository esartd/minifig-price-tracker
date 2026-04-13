import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { prisma } from '@/lib/prisma';

/**
 * SEARCH IMPLEMENTATION
 *
 * This endpoint provides two search methods:
 * 1. Exact ID search: Checks cache, then fetches from BrickLink API if needed
 * 2. Name-based search: Uses PostgreSQL trigram fuzzy search on MinifigCatalog
 *
 * This complies with BrickLink API Terms:
 * - Catalog data is from their official download, not systematic API enumeration
 * - API calls only for exact ID lookups (user-driven requests)
 * - Pricing still fetched via API with proper caching
 */

// Helper: Generate search keywords from text
function generateKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Remove special chars
    .split(/\s+/)
    .filter(word => word.length >= 2); // Min 2 chars
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category');
    const subcategory = searchParams.get('subcategory'); // Full category_name for subcategory filtering

    // Subcategory browsing (by full category_name)
    if (!query && subcategory) {
      const catalogItems = await prisma.minifigCatalog.findMany({
        where: {
          category_name: subcategory
        },
        orderBy: [
          { year_released: 'desc' },
          { minifigure_no: 'desc' }
        ],
        take: 500
      });

      const matchedItems = catalogItems.map(item => ({
        no: item.minifigure_no,
        name: item.name,
        category_id: item.category_id,
        category_name: item.category_name,
        year_released: item.year_released,
        image_url: `https://img.bricklink.com/ItemImage/MN/0/${item.minifigure_no}.png`
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

      const catalogItems = await prisma.minifigCatalog.findMany({
        where: {
          category_id: categoryIdNum
        },
        orderBy: [
          { year_released: 'desc' },
          { minifigure_no: 'desc' }
        ],
        take: 500 // Show up to 500 minifigs per category
      });

      const matchedItems = catalogItems.map(item => ({
        no: item.minifigure_no,
        name: item.name,
        category_id: item.category_id,
        category_name: item.category_name,
        year_released: item.year_released,
        image_url: `https://img.bricklink.com/ItemImage/MN/0/${item.minifigure_no}.png`
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

    // Check if it's an exact item number (e.g., sw0002, dis134, hp001)
    const isItemNumber = /^[a-z]{2,4}\d{3,4}[a-z]?$/i.test(searchTerm);

    if (isItemNumber) {
      const itemNo = searchTerm.toLowerCase();

      // Check cache first
      const cached = await prisma.minifigCache.findUnique({
        where: { minifigure_no: itemNo }
      });

      if (cached && cached.expires_at > new Date()) {
        // Update last_searched_at to track usage
        await prisma.minifigCache.update({
          where: { minifigure_no: itemNo },
          data: { last_searched_at: new Date() }
        });

        return NextResponse.json({
          success: true,
          data: [{
            no: cached.minifigure_no,
            name: cached.name,
            category_id: cached.category_id,
            image_url: cached.image_url
          }],
          source: 'cache_exact_match'
        });
      }

      // Not in cache - fetch from BrickLink API (user-driven request)
      try {
        const minifig = await bricklinkAPI.getMinifigureByNumber(itemNo);

        if (minifig) {
          // Store in cache for future searches (user-driven caching)
          const keywords = generateKeywords(minifig.name);
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour TTL (per BrickLink "other content" rule)

          await prisma.minifigCache.upsert({
            where: { minifigure_no: itemNo },
            create: {
              minifigure_no: itemNo,
              name: minifig.name,
              category_id: minifig.category_id || 0,
              image_url: minifig.image_url || `https://img.bricklink.com/ItemImage/MN/0/${itemNo}.png`,
              keywords,
              expires_at: expiresAt,
              last_searched_at: new Date()
            },
            update: {
              last_searched_at: new Date(),
              expires_at: expiresAt // Refresh TTL on re-search
            }
          });

          return NextResponse.json({
            success: true,
            data: [minifig],
            source: 'api_exact_match'
          });
        }
      } catch (error) {
        console.error('BrickLink API error for exact match:', error);
      }

      // Not found anywhere
      return NextResponse.json({
        success: false,
        error: `Minifigure "${searchTerm}" not found. Please verify the item number is correct.`,
      }, { status: 404 });
    }

    // NAME-BASED SEARCH: Use PostgreSQL trigram fuzzy search with fallback
    // This helps users find minifigs even with typos (e.g., "luke skywaker" finds "Luke Skywalker")
    const searchLower = searchTerm.toLowerCase();

    // Set similarity threshold (0.2 = 20% match - allows for typos and partial matches)
    await prisma.$executeRawUnsafe('SELECT set_limit(0.2)');

    // Build WHERE clause for category filter
    const categoryFilter = categoryId ? `AND category_id = ${parseInt(categoryId)}` : '';

    // Try fuzzy search first
    let catalogItems = await prisma.$queryRawUnsafe<Array<{
      minifigure_no: string;
      name: string;
      category_id: number;
      category_name: string;
      year_released: string | null;
      similarity: number;
    }>>(
      `SELECT
        minifigure_no,
        name,
        category_id,
        category_name,
        year_released,
        similarity(search_name, $1) as similarity
      FROM "MinifigCatalog"
      WHERE search_name % $1 ${categoryFilter}
      ORDER BY similarity DESC
      LIMIT 200`,
      searchLower
    );

    // Fallback: If fuzzy search finds nothing, use regular ILIKE search
    // This handles cases like accented characters (padmé vs padme)
    if (catalogItems.length === 0) {
      const whereClause: any = {
        search_name: {
          contains: searchLower,
          mode: 'insensitive'
        }
      };

      if (categoryId) {
        whereClause.category_id = parseInt(categoryId);
      }

      const fallbackResults = await prisma.minifigCatalog.findMany({
        where: whereClause,
        take: 200
      });

      catalogItems = fallbackResults.map(item => ({
        minifigure_no: item.minifigure_no,
        name: item.name,
        category_id: item.category_id,
        category_name: item.category_name,
        year_released: item.year_released,
        similarity: 0 // Not from fuzzy search
      }));
    }

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

    // Re-sort results by ID number (newest first)
    // Fuzzy search finds matches despite typos, then we rank by ID for newest minifigs first
    matchedItems.sort((a, b) => {
      // Parse full ID: sw1500a → prefix="sw", num=1500, suffix="a"
      const parseId = (id: string) => {
        const match = id.match(/^([a-z]+)(\d+)([a-z])?$/i);
        if (!match) return { prefix: id, num: 0, suffix: '' };
        return {
          prefix: match[1],
          num: parseInt(match[2]),
          suffix: match[3] || ''
        };
      };

      const aParsed = parseId(a.no);
      const bParsed = parseId(b.no);

      // PRIMARY SORT: By item number (descending - higher = newer)
      // sw1507 > sw0106a (1507 > 106)
      if (aParsed.num !== bParsed.num) {
        return bParsed.num - aParsed.num;
      }

      // SECONDARY SORT: Same number - sort by year if both have valid years
      // sw0106 (2010) > sw0106a (unknown)
      const aYear = a.year_released ? parseInt(a.year_released) : 0;
      const bYear = b.year_released ? parseInt(b.year_released) : 0;
      const aYearValid = !isNaN(aYear) && aYear > 0;
      const bYearValid = !isNaN(bYear) && bYear > 0;

      if (aYearValid && bYearValid && aYear !== bYear) {
        return bYear - aYear; // Newer year first
      }

      // If only one has valid year, put it first
      if (aYearValid && !bYearValid) return -1;
      if (bYearValid && !aYearValid) return 1;

      // TERTIARY SORT: Same number, same/unknown year - sort by suffix
      // sw0106 comes before sw0106a, sw0106b, etc.
      return aParsed.suffix.localeCompare(bParsed.suffix);
    });

    // Group by year for easier browsing
    const groupedByYear: Record<string, typeof matchedItems> = {};
    matchedItems.forEach(item => {
      const year = item.year_released || 'Unknown';
      if (!groupedByYear[year]) {
        groupedByYear[year] = [];
      }
      groupedByYear[year].push(item);
    });

    return NextResponse.json({
      success: true,
      data: matchedItems,
      grouped_by_year: groupedByYear,
      total: matchedItems.length,
      source: 'catalog'
    });

  } catch (error) {
    console.error('Error searching minifigures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search minifigures' },
      { status: 500 }
    );
  }
}
