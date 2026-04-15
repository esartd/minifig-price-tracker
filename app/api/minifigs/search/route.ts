import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { prisma } from '@/lib/prisma';
import { runMigrations } from '@/lib/run-migrations';

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

      // Check catalog first (instant)
      const catalogItem = await prisma.minifigCatalog.findUnique({
        where: { minifigure_no: itemNo }
      });

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
          source: 'catalog_exact_match'
        });
      }

      // Not in catalog - check cache
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

      // Not in catalog or cache - fetch from BrickLink API as last resort (user-driven request)
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

    // NAME-BASED SEARCH: Use unaccented column for accent-insensitive search
    // Handles: "padme" finds "padmé", "naive" finds "naïve", etc.
    const searchLower = searchTerm.toLowerCase();

    // Build WHERE clause for category filter
    const categoryFilter = categoryId ? `AND category_id = ${parseInt(categoryId)}` : '';

    // Try exact substring match first - unaccent inline to avoid extra query
    let rawResults = await prisma.$queryRawUnsafe<Array<{
      minifigure_no: string;
      name: string;
      category_id: number;
      category_name: string;
      year_released: string | null;
    }>>(
      `SELECT
        minifigure_no,
        name,
        category_id,
        category_name,
        year_released
      FROM "MinifigCatalog"
      WHERE search_name_unaccent LIKE '%' || unaccent($1) || '%' ${categoryFilter}
      ORDER BY
        CASE WHEN year_released IS NULL OR year_released = '' THEN 9999 ELSE CAST(year_released AS INTEGER) END DESC,
        CAST(regexp_replace(minifigure_no, '[^0-9]', '', 'g') AS INTEGER) DESC,
        minifigure_no
      LIMIT 200`,
      searchLower
    );

    // If exact match finds nothing, try fuzzy search for typos
    // e.g., "luke skywaker" → "Luke Skywalker"
    if (rawResults.length === 0) {
      rawResults = await prisma.$queryRawUnsafe<Array<{
        minifigure_no: string;
        name: string;
        category_id: number;
        category_name: string;
        year_released: string | null;
      }>>(
        `SELECT
          minifigure_no,
          name,
          category_id,
          category_name,
          year_released,
          similarity(search_name_unaccent, unaccent($1)) as sim
        FROM "MinifigCatalog"
        WHERE similarity(search_name_unaccent, unaccent($1)) > 0.2 ${categoryFilter}
        ORDER BY
          sim DESC,
          CASE WHEN year_released IS NULL OR year_released = '' THEN 9999 ELSE CAST(year_released AS INTEGER) END DESC
        LIMIT 200`,
        searchLower
      );
    }

    // Map to common response format
    const catalogItems = rawResults;

    // Map catalog items to response format (sorting already done in SQL)
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
