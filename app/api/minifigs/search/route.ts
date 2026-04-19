import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import { prismaPublic } from '@/lib/prisma';
import { getAllMinifigs, findMinifigByNumber } from '@/lib/catalog-static';

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
      const allMinifigs = await getAllMinifigs();
      const catalogItems = allMinifigs
        .filter(m => m.category_name === subcategory)
        .sort((a, b) => {
          const aYear = a.year_released ? parseInt(a.year_released) : 0;
          const bYear = b.year_released ? parseInt(b.year_released) : 0;
          if (bYear !== aYear) return bYear - aYear;
          return b.minifigure_no.localeCompare(a.minifigure_no);
        })
        .slice(0, 500);

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
      const allMinifigs = await getAllMinifigs();

      const catalogItems = allMinifigs
        .filter(m => m.category_id === categoryIdNum)
        .sort((a, b) => {
          const aYear = a.year_released ? parseInt(a.year_released) : 0;
          const bYear = b.year_released ? parseInt(b.year_released) : 0;
          if (bYear !== aYear) return bYear - aYear;
          return b.minifigure_no.localeCompare(a.minifigure_no);
        })
        .slice(0, 500);

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
          source: 'catalog_exact_match'
        });
      }

      // Not in static catalog (has all 18,732 minifigs) - not found
      return NextResponse.json({
        success: false,
        error: `Minifigure "${searchTerm}" not found. Please verify the item number is correct.`,
      }, { status: 404 });
    }

    // NAME-BASED SEARCH: Search from static catalog
    const searchLower = searchTerm.toLowerCase();
    const categoryIdNum = categoryId ? parseInt(categoryId) : null;
    const allMinifigs = await getAllMinifigs();

    // Filter and sort catalog items
    const catalogItems = allMinifigs
      .filter(m => {
        const matchesSearch =
          m.minifigure_no.toLowerCase().includes(searchLower) ||
          m.name.toLowerCase().includes(searchLower) ||
          m.category_name.toLowerCase().includes(searchLower);
        const matchesCategory = !categoryIdNum || m.category_id === categoryIdNum;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const aYear = a.year_released ? parseInt(a.year_released) : 0;
        const bYear = b.year_released ? parseInt(b.year_released) : 0;
        if (bYear !== aYear) return bYear - aYear;
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
