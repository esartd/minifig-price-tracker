import { NextRequest, NextResponse } from 'next/server';
import { bricklinkAPI } from '@/lib/bricklink';
import Fuse from 'fuse.js';
import { minifigCatalog } from '@/lib/minifig-catalog';

// Configure Fuse.js for fuzzy searching
const fuse = new Fuse(minifigCatalog, {
  keys: ['name', 'no', 'keywords'],
  threshold: 0.2, // Much stricter - prevents false matches like "Luke" matching "Blue"
  includeScore: true,
  minMatchCharLength: 3, // Require at least 3 characters to match
  distance: 50, // Limit how far apart matched characters can be
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

    // Split search into words for better multi-word matching
    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length >= 2);

    let matchedItems: typeof minifigCatalog = [];

    if (searchWords.length === 1) {
      // Single word search - use Fuse.js directly
      const fuzzyResults = fuse.search(searchTerm);
      matchedItems = fuzzyResults.map(result => result.item);
    } else {
      // Multi-word search - find minifigs matching ALL words
      // For each word, get matching minifigs
      const resultsPerWord = searchWords.map(word => {
        const results = fuse.search(word);
        return new Set(results.map(r => r.item.no));
      });

      // Find minifigs that appear in ALL word searches (intersection)
      const intersection = minifigCatalog.filter(item => {
        return resultsPerWord.every(wordSet => wordSet.has(item.no));
      });

      matchedItems = intersection;
    }

    if (matchedItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No minifigures found matching "${searchTerm}". Try searching by exact item number (e.g., sw0002) or browse popular characters.`,
      }, { status: 404 });
    }

    // Fetch full details from Bricklink API for each result to get images and verify existence
    const detailsPromises = matchedItems.map(item =>
      bricklinkAPI.getMinifigureByNumber(item.no)
    );
    const detailedResults = await Promise.all(detailsPromises);
    const validResults = detailedResults.filter(r => r !== null);

    // Sort by item number descending (newer/higher numbers first)
    validResults.sort((a, b) => {
      const extractNum = (no: string) => {
        const match = no.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      return extractNum(b.no) - extractNum(a.no);
    });

    // Return search results with images from Bricklink
    return NextResponse.json({
      success: true,
      data: validResults,
      total: validResults.length,
      source: 'catalog_fallback',
    });

  } catch (error) {
    console.error('Error searching minifigures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search minifigures' },
      { status: 500 }
    );
  }
}
