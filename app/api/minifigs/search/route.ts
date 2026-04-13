import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { prisma } from '@/lib/prisma';

/**
 * COMPLIANT SEARCH IMPLEMENTATION
 *
 * This search is user-driven and complies with BrickLink API Terms:
 * - NO systematic enumeration (no robot/spider behavior)
 * - Caches only what users search for (reasonable caching)
 * - API calls driven by actual user requests (not automated)
 * - 30-day cache TTL (reasonable period for minifig metadata)
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

    // NAME-BASED SEARCH: Search cached items only (user-driven, no systematic enumeration)
    // This searches only minifigs that users have previously looked up
    const cachedItems = await prisma.minifigCache.findMany({
      where: {
        expires_at: { gt: new Date() }, // Only non-expired cache
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { keywords: { has: searchTerm.toLowerCase() } }
        ]
      },
      orderBy: { last_searched_at: 'desc' }, // Popular items first
      take: 50 // Limit results
    });

    // Filter and rank results
    const matchedItems = cachedItems
      .filter(item => matchesSearch(item, searchTerm))
      .map(item => ({
        no: item.minifigure_no,
        name: item.name,
        category_id: item.category_id,
        image_url: item.image_url
      }));

    if (matchedItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No minifigures found matching "${searchTerm}". Try searching by exact BrickLink ID (e.g., dis134, sw1219) to add new items to the searchable catalog.`,
      }, { status: 404 });
    }

    // Sort results: exact matches first, then starts-with, then by popularity
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

      // Otherwise maintain order (already sorted by last_searched_at)
      return 0;
    });

    return NextResponse.json({
      success: true,
      data: matchedItems,
      total: matchedItems.length,
      source: 'cache',
      hint: matchedItems.length < 5 ? 'Search by exact BrickLink ID (e.g., dis134) to add more items to searchable catalog' : undefined
    });

  } catch (error) {
    console.error('Error searching minifigures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search minifigures' },
      { status: 500 }
    );
  }
}
