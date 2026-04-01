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
      // First, try to find it in local catalog (instant, no API call)
      const catalogMatch = minifigCatalog.find(item =>
        item.no.toLowerCase() === searchTerm.toLowerCase()
      );

      if (catalogMatch) {
        // Found in catalog - return immediately
        return NextResponse.json({
          success: true,
          data: [{
            no: catalogMatch.no,
            name: catalogMatch.name,
            category_id: 0,
            image_url: `https://img.bricklink.com/ItemImage/MN/0/${catalogMatch.no}.png`
          }],
          source: 'catalog_exact_match'
        });
      }

      // Not in catalog - try Bricklink API as fallback
      try {
        const exactMatch = await bricklinkAPI.getMinifigureByNumber(searchTerm);
        if (exactMatch) {
          return NextResponse.json({
            success: true,
            data: [exactMatch],
            source: 'api_exact_match'
          });
        }
      } catch (error) {
        console.error('Bricklink API error for exact match:', error);
      }

      // Not found anywhere
      return NextResponse.json({
        success: false,
        error: `Minifigure "${searchTerm}" not found. Please verify the item number is correct.`,
      }, { status: 404 });
    }

    // Try full phrase match first
    const phraseResults = fuse.search(searchTerm);
    let matchedItems: typeof minifigCatalog = phraseResults.map(result => result.item);

    // If multi-word search and few results, also include results matching ALL words
    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length >= 2);

    if (searchWords.length > 1 && matchedItems.length < 20) {
      // Multi-word search - find minifigs matching ALL words individually
      const resultsPerWord = searchWords.map(word => {
        const results = fuse.search(word);
        return new Set(results.map(r => r.item.no));
      });

      // Find minifigs that appear in ALL word searches (intersection)
      const intersection = minifigCatalog.filter(item => {
        return resultsPerWord.every(wordSet => wordSet.has(item.no));
      });

      // Combine phrase results with word intersection, remove duplicates
      const combinedSet = new Set([
        ...matchedItems.map(item => item.no),
        ...intersection.map(item => item.no)
      ]);

      matchedItems = minifigCatalog.filter(item => combinedSet.has(item.no));
    }

    if (matchedItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No minifigures found matching "${searchTerm}". Try searching by exact item number (e.g., sw0002) or browse popular characters.`,
      }, { status: 404 });
    }

    // Use catalog data directly with predictable image URLs (instant, no API calls)
    const results = matchedItems.map(item => ({
      no: item.no,
      name: item.name,
      category_id: 0,
      image_url: `https://img.bricklink.com/ItemImage/MN/0/${item.no}.png`
    }));

    const searchLower = searchTerm.toLowerCase();

    // Sort with exact matches first, then starts-with, then by item number descending
    results.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();
      const aNoLower = a.no.toLowerCase();
      const bNoLower = b.no.toLowerCase();

      // Check for exact matches
      const aExactName = aNameLower === searchLower;
      const bExactName = bNameLower === searchLower;
      const aExactNo = aNoLower === searchLower;
      const bExactNo = bNoLower === searchLower;

      // Check for starts-with matches
      const aStartsWithName = aNameLower.startsWith(searchLower);
      const bStartsWithName = bNameLower.startsWith(searchLower);
      const aStartsWithNo = aNoLower.startsWith(searchLower);
      const bStartsWithNo = bNoLower.startsWith(searchLower);

      // Priority 1: Exact name match
      if (aExactName && !bExactName) return -1;
      if (!aExactName && bExactName) return 1;

      // Priority 2: Exact item number match
      if (aExactNo && !bExactNo) return -1;
      if (!aExactNo && bExactNo) return 1;

      // Priority 3: Name starts with search term
      if (aStartsWithName && !bStartsWithName) return -1;
      if (!aStartsWithName && bStartsWithName) return 1;

      // Priority 4: Item number starts with search term
      if (aStartsWithNo && !bStartsWithNo) return -1;
      if (!aStartsWithNo && bStartsWithNo) return 1;

      // Priority 5: Sort by item number descending (newer items first)
      const extractNum = (no: string) => {
        const match = no.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      return extractNum(b.no) - extractNum(a.no);
    });

    // Return search results instantly
    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      source: 'catalog',
    });

  } catch (error) {
    console.error('Error searching minifigures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search minifigures' },
      { status: 500 }
    );
  }
}
