import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import Fuse from 'fuse.js';
import { minifigCatalog } from '@/lib/minifig-catalog';

// Configure Fuse.js for fuzzy searching
const fuse = new Fuse(minifigCatalog, {
  keys: ['name', 'no', 'keywords'],
  threshold: 0.3, // Stricter matching for better results
  includeScore: true,
  minMatchCharLength: 2,
});

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

    // Check if it looks like an exact item number (e.g., sw0002, hp001)
    const isItemNumber = /^[a-z]{2,3}\d{3,4}[a-z]?$/i.test(searchTerm);

    if (isItemNumber) {
      // Try exact item number match with Bricklink API first
      const exactMatch = await bricklinkAPI.getMinifigureByNumber(searchTerm);
      if (exactMatch) {
        return NextResponse.json({
          success: true,
          data: [exactMatch],
          source: 'exact_match'
        });
      } else {
        // Item number format is correct but not found
        return NextResponse.json({
          success: false,
          error: `Minifigure "${searchTerm}" not found on Bricklink. Please verify the item number is correct.`,
        }, { status: 404 });
      }
    }

    // Use fuzzy search on catalog for name-based searches
    const fuzzyResults = fuse.search(searchTerm);

    if (fuzzyResults.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No minifigures found matching "${searchTerm}". Try searching by exact item number (e.g., sw0002) or browse popular characters.`,
      }, { status: 404 });
    }

    // Get all matching results (not just top 10)
    const matchedItems = fuzzyResults.map(result => result.item);

    // Fetch full details from Bricklink API for each result to get images and verify existence
    const detailsPromises = matchedItems.map(item =>
      bricklinkAPI.getMinifigureByNumber(item.no)
    );
    const detailedResults = await Promise.all(detailsPromises);
    const validResults = detailedResults.filter(r => r !== null);

    // Return search results with images from Bricklink
    return NextResponse.json({
      success: true,
      data: validResults,
      total: validResults.length,
      source: 'catalog_search',
    });

  } catch (error) {
    console.error('Error searching minifigures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search minifigures' },
      { status: 500 }
    );
  }
}
