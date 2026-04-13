import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { prisma } from '@/lib/prisma';

/**
 * SEARCH IMPLEMENTATION
 *
 * This endpoint provides two search methods:
 * 1. Exact ID search: Checks cache, then fetches from BrickLink API if needed
 * 2. Name-based search: Searches the full MinifigCatalog (downloaded from BrickLink)
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

// Helper: Check if search query matches cached item
function matchesSearch(item: { name: string; keywords: string[] }, searchTerm: string): boolean {
  const searchLower = searchTerm.toLowerCase();
  const searchWords = generateKeywords(searchTerm);

  // Exact match on name
  if (item.name.toLowerCase() === searchLower) return true;

  // Name starts with search term
  if (item.name.toLowerCase().startsWith(searchLower)) return true;

  // All search words appear in keywords
  if (searchWords.length > 1) {
    return searchWords.every(word =>
      item.keywords.some(keyword => keyword.includes(word))
    );
  }

  // Single word matches any keyword
  return item.keywords.some(keyword => keyword.includes(searchLower));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

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

    // NAME-BASED SEARCH: Search full catalog (from downloaded Bricklink data)
    const catalogItems = await prisma.minifigCatalog.findMany({
      where: {
        search_name: {
          contains: searchTerm.toLowerCase(),
          mode: 'insensitive'
        }
      },
      take: 50 // Limit results
    });

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

    // Sort results: exact matches first, then starts-with
    const searchLower = searchTerm.toLowerCase();
    matchedItems.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();

      // Exact match
      if (aNameLower === searchLower && bNameLower !== searchLower) return -1;
      if (bNameLower === searchLower && aNameLower !== searchLower) return 1;

      // Starts with
      const aStarts = aNameLower.startsWith(searchLower);
      const bStarts = bNameLower.startsWith(searchLower);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;

      // Sort alphabetically
      return aNameLower.localeCompare(bNameLower);
    });

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
