/**
 * Bricklink Catalog Downloader
 *
 * Attempts to download the minifigure catalog directly from Bricklink.
 */

interface DownloadResult {
  success: boolean;
  data?: string;
  error?: string;
  source?: string;
}

/**
 * Download catalog from Bricklink
 *
 * Bricklink's catalog download page: https://www.bricklink.com/catalogDownload.asp
 * The page generates download links, but they may require authentication or have dynamic URLs.
 *
 * This function tries multiple strategies:
 * 1. Direct download from known URL pattern
 * 2. Fetch from custom CATALOG_URL if set
 * 3. Parse the download page to find the actual file link
 */
export async function downloadBricklinkCatalog(): Promise<DownloadResult> {
  // Strategy 1: Use custom CATALOG_URL if provided
  const customUrl = process.env.CATALOG_URL;
  if (customUrl) {
    try {
      console.log(`📥 Attempting download from custom URL: ${customUrl}`);
      const response = await fetch(customUrl, {
        headers: {
          'User-Agent': 'FigTracker-CatalogSync/1.0'
        }
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 1000) {
          return {
            success: true,
            data: text,
            source: 'custom_url'
          };
        }
      }
    } catch (error) {
      console.warn('Custom URL failed:', error);
    }
  }

  // Strategy 2: Try common Bricklink download URL patterns
  const possibleUrls = [
    'https://www.bricklink.com/catalogDownload.asp?a=a&viewType=2&itemType=M',
    'https://www.bricklink.com/catalogDownload.asp?viewType=2&itemType=M&downloadType=X',
    'https://img.bricklink.com/library/catalogDownload/minifigs.txt',
    'https://static.bricklink.com/library/minifigures.txt',
  ];

  for (const url of possibleUrls) {
    try {
      console.log(`📥 Trying: ${url}`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'FigTracker-CatalogSync/1.0',
          'Accept': 'text/plain, text/tab-separated-values, application/octet-stream',
        },
        redirect: 'follow'
      });

      if (response.ok) {
        const text = await response.text();
        // Validate it looks like catalog data (should have tabs and multiple lines)
        if (text.includes('\t') && text.split('\n').length > 100) {
          console.log(`✅ Successfully downloaded from: ${url}`);
          return {
            success: true,
            data: text,
            source: url
          };
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
    }
  }

  // Strategy 3: Try to parse the download page
  try {
    console.log('📥 Attempting to parse Bricklink download page...');
    const response = await fetch('https://www.bricklink.com/catalogDownload.asp', {
      headers: {
        'User-Agent': 'FigTracker-CatalogSync/1.0'
      }
    });

    if (response.ok) {
      const html = await response.text();

      // Look for download links in the HTML
      // Pattern: href="..." that contains "minifig" or "MINIFIG" and ends with common file extensions
      const linkPatterns = [
        /href=["']([^"']*[Mm]inifig[^"']*\.txt)["']/,
        /href=["']([^"']*[Mm]inifig[^"']*\.tsv)["']/,
        /href=["']([^"']*catalogDownload[^"']*itemType=M[^"']*)["']/,
      ];

      for (const pattern of linkPatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          let fileUrl = match[1];

          // Make absolute URL if relative
          if (fileUrl.startsWith('/')) {
            fileUrl = `https://www.bricklink.com${fileUrl}`;
          } else if (!fileUrl.startsWith('http')) {
            fileUrl = `https://www.bricklink.com/${fileUrl}`;
          }

          console.log(`📥 Found potential download link: ${fileUrl}`);

          // Try to fetch it
          const fileResponse = await fetch(fileUrl, {
            headers: {
              'User-Agent': 'FigTracker-CatalogSync/1.0'
            }
          });

          if (fileResponse.ok) {
            const text = await fileResponse.text();
            if (text.includes('\t') && text.split('\n').length > 100) {
              console.log(`✅ Successfully downloaded from parsed link`);
              return {
                success: true,
                data: text,
                source: fileUrl
              };
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to parse download page:', error);
  }

  // All strategies failed
  return {
    success: false,
    error: 'Unable to download catalog from Bricklink. Please set CATALOG_URL to a manual download location, or use the manual upload API.'
  };
}

/**
 * Parse catalog text into structured data
 */
export function parseCatalogData(catalogText: string) {
  const lines = catalogText.split('\n');
  const items: any[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip first line (header) and empty lines
    if (i === 0 || line.trim() === '') {
      continue;
    }

    // Split by tabs
    const columns = line.split('\t');

    if (columns.length < 5) {
      continue;
    }

    const categoryId = parseInt(columns[0]);
    const categoryName = columns[1];
    const number = columns[2];
    const name = columns[3];
    const yearReleased = columns[4] === '?' ? null : columns[4];
    const weightGrams = columns[5] ? parseFloat(columns[5]) : null;

    if (!number || !name) {
      continue;
    }

    items.push({
      categoryId,
      categoryName,
      number,
      name,
      yearReleased,
      weightGrams,
    });
  }

  return items;
}

/**
 * Import catalog items into database
 */
export async function importCatalogItems(items: any[], prisma: any) {
  let created = 0;
  let updated = 0;

  const batchSize = 100;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const promises = batch.map(async (item) => {
      const existing = await prisma.minifigCatalog.findUnique({
        where: { minifigure_no: item.number }
      });

      await prisma.minifigCatalog.upsert({
        where: { minifigure_no: item.number },
        update: {
          name: item.name,
          category_id: item.categoryId,
          category_name: item.categoryName,
          year_released: item.yearReleased,
          weight_grams: item.weightGrams,
          search_name: item.name.toLowerCase(),
        },
        create: {
          minifigure_no: item.number,
          name: item.name,
          category_id: item.categoryId,
          category_name: item.categoryName,
          year_released: item.yearReleased,
          weight_grams: item.weightGrams,
          search_name: item.name.toLowerCase(),
        },
      });

      if (existing) {
        updated++;
      } else {
        created++;
      }
    });

    await Promise.all(promises);
  }

  return { created, updated };
}
