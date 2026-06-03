/**
 * Bricklink Catalog Files Downloader
 *
 * Downloads essential catalog files from Bricklink:
 * - Minifigures.txt (for minifig search/pricing)
 * - Sets.txt (for Amazon affiliate ads)
 * - categories.txt (for theme organization)
 */

import fs from 'fs';
import path from 'path';

export interface BricklinkFile {
  name: string;
  filename: string;
  required: boolean;
  description: string;
}

export const BRICKLINK_FILES: BricklinkFile[] = [
  {
    name: 'Minifigures',
    filename: 'Minifigures.txt',
    required: true,
    description: 'Minifigure catalog for search and pricing'
  },
  {
    name: 'Sets',
    filename: 'Sets.txt',
    required: true,
    description: 'LEGO sets catalog for Amazon affiliate ads'
  },
  {
    name: 'Categories',
    filename: 'categories.txt',
    required: false,
    description: 'Category/theme hierarchy data'
  }
];

interface DownloadResult {
  success: boolean;
  data?: string;
  error?: string;
  source?: string;
}

/**
 * Download a specific catalog file from Bricklink
 */
export async function downloadBricklinkFile(file: BricklinkFile): Promise<DownloadResult> {
  console.log(`📥 Downloading ${file.name}...`);

  // Strategy 1: Try direct download URLs (Bricklink catalog download page patterns)
  const possibleUrls = generateBricklinkUrls(file.filename);

  for (const url of possibleUrls) {
    try {
      console.log(`  Trying: ${url}`);
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
        if (text.includes('\t') && text.split('\n').length > 10) {
          console.log(`  ✅ Successfully downloaded from: ${url}`);
          return {
            success: true,
            data: text,
            source: url
          };
        }
      }
    } catch (error) {
      console.warn(`  Failed: ${url}`);
    }
  }

  // Strategy 2: Try environment variable fallback
  const envVar = `BRICKLINK_${file.name.toUpperCase()}_URL`;
  const customUrl = process.env[envVar];

  if (customUrl) {
    try {
      console.log(`  Trying custom URL from ${envVar}`);
      const response = await fetch(customUrl, {
        headers: {
          'User-Agent': 'FigTracker-CatalogSync/1.0'
        }
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 100) {
          console.log(`  ✅ Downloaded from custom URL`);
          return {
            success: true,
            data: text,
            source: 'custom_url'
          };
        }
      }
    } catch (error) {
      console.warn(`  Custom URL failed:`, error);
    }
  }

  return {
    success: false,
    error: `Failed to download ${file.name} from all attempted sources`
  };
}

/**
 * Generate possible Bricklink URLs for a given filename
 */
function generateBricklinkUrls(filename: string): string[] {
  const baseName = filename.replace('.txt', '');

  // Bricklink catalog download patterns
  return [
    // Direct static file URLs
    `https://img.bricklink.com/library/catalogDownload/${filename.toLowerCase()}`,
    `https://static.bricklink.com/library/${filename.toLowerCase()}`,

    // Catalog download page with item type
    `https://www.bricklink.com/catalogDownload.asp?a=a&viewType=2&downloadType=T&itemType=${getItemTypeCode(baseName)}`,

    // Alternative patterns
    `https://www.bricklink.com/library/${filename}`,
  ];
}

/**
 * Get Bricklink item type code for catalog download URLs
 */
function getItemTypeCode(baseName: string): string {
  const typeMap: Record<string, string> = {
    'minifigures': 'M',
    'sets': 'S',
    'parts': 'P',
    'books': 'B',
    'catalogs': 'C',
    'instructions': 'I',
    'original boxes': 'O',
    'categories': 'C'
  };

  return typeMap[baseName.toLowerCase()] || 'M';
}

/**
 * Save downloaded file to disk
 */
export async function saveBricklinkFile(filename: string, data: string): Promise<boolean> {
  try {
    const filePath = path.join(process.cwd(), filename);
    fs.writeFileSync(filePath, data, 'utf-8');
    console.log(`💾 Saved ${filename} (${(data.length / 1024 / 1024).toFixed(2)} MB)`);
    return true;
  } catch (error) {
    console.error(`Failed to save ${filename}:`, error);
    return false;
  }
}

/**
 * Download all required Bricklink catalog files
 */
export async function downloadAllBricklinkFiles(): Promise<{
  success: boolean;
  results: Record<string, { success: boolean; error?: string; size?: number }>;
}> {
  console.log('🔄 Starting Bricklink catalog download...\n');

  const results: Record<string, { success: boolean; error?: string; size?: number }> = {};
  let allSuccess = true;

  for (const file of BRICKLINK_FILES) {
    const downloadResult = await downloadBricklinkFile(file);

    if (downloadResult.success && downloadResult.data) {
      const saved = await saveBricklinkFile(file.filename, downloadResult.data);

      results[file.name] = {
        success: saved,
        size: downloadResult.data.length
      };

      if (!saved) {
        allSuccess = false;
      }
    } else {
      results[file.name] = {
        success: false,
        error: downloadResult.error
      };

      if (file.required) {
        allSuccess = false;
      }
    }

    console.log(''); // Blank line between files
  }

  return {
    success: allSuccess,
    results
  };
}
