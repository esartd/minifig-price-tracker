import { downloadCatalogWithBrowser, CatalogDownloadOptions } from './bricklink-automation';

/**
 * High-level manager for BrickLink catalog downloads
 * Handles orchestration, retries, and error handling
 */

export interface CatalogType {
  code: string;
  filename: string;
  displayName: string;
  required: boolean;
}

/**
 * All BrickLink catalog types
 */
export const CATALOG_TYPES: Record<string, CatalogType> = {
  minifigures: {
    code: 'M',
    filename: 'Minifigures.txt',
    displayName: 'Minifigures',
    required: true,
  },
  sets: {
    code: 'S',
    filename: 'Sets.txt',
    displayName: 'Sets',
    required: true,
  },
  parts: {
    code: 'P',
    filename: 'Parts.txt',
    displayName: 'Parts',
    required: false,
  },
  books: {
    code: 'B',
    filename: 'Books.txt',
    displayName: 'Books',
    required: false,
  },
  gear: {
    code: 'G',
    filename: 'Gear.txt',
    displayName: 'Gear',
    required: false,
  },
  catalogs: {
    code: 'C',
    filename: 'Catalogs.txt',
    displayName: 'Catalogs',
    required: false,
  },
  instructions: {
    code: 'I',
    filename: 'Instructions.txt',
    displayName: 'Instructions',
    required: false,
  },
  originalBoxes: {
    code: 'O',
    filename: 'Original Boxes.txt',
    displayName: 'Original Boxes',
    required: false,
  },
};

export interface DownloadResult {
  type: string;
  filename: string;
  success: boolean;
  content?: string;
  error?: string;
  size?: number;
  duration?: number;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt < maxRetries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

/**
 * Download a single catalog file
 */
export async function downloadCatalogFile(
  catalogType: CatalogType,
  options: {
    includeYear?: boolean;
    includeWeight?: boolean;
    includeDimensions?: boolean;
    maxRetries?: number;
  } = {}
): Promise<DownloadResult> {
  const {
    includeYear = true,
    includeWeight = true,
    includeDimensions = true,
    maxRetries = 3,
  } = options;

  const startTime = Date.now();

  try {
    console.log(`Starting download for ${catalogType.displayName}...`);

    const downloadOptions: CatalogDownloadOptions = {
      itemType: catalogType.code,
      includeYear,
      includeWeight,
      includeDimensions,
    };

    // Download with retry logic
    const content = await retryWithBackoff(
      () => downloadCatalogWithBrowser(downloadOptions),
      maxRetries
    );

    const duration = Date.now() - startTime;
    const size = Buffer.byteLength(content, 'utf8');

    console.log(`✓ Downloaded ${catalogType.displayName}: ${(size / 1024).toFixed(2)} KB in ${duration}ms`);

    return {
      type: catalogType.code,
      filename: catalogType.filename,
      success: true,
      content,
      size,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error(`✗ Failed to download ${catalogType.displayName}:`, errorMessage);

    return {
      type: catalogType.code,
      filename: catalogType.filename,
      success: false,
      error: errorMessage,
      duration,
    };
  }
}

/**
 * Download all catalog files sequentially
 * Returns array of download results
 */
export async function downloadAllCatalogs(
  options: {
    includeYear?: boolean;
    includeWeight?: boolean;
    includeDimensions?: boolean;
    includeOptional?: boolean;
    maxRetries?: number;
  } = {}
): Promise<DownloadResult[]> {
  const { includeOptional = true } = options;

  const catalogsToDownload = Object.values(CATALOG_TYPES).filter(
    catalog => catalog.required || includeOptional
  );

  console.log(`Starting download of ${catalogsToDownload.length} catalog files...`);

  const results: DownloadResult[] = [];

  // Download sequentially to avoid overwhelming BrickLink
  for (const catalog of catalogsToDownload) {
    const result = await downloadCatalogFile(catalog, options);
    results.push(result);

    // Small delay between downloads to be respectful to BrickLink servers
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalSize = results
    .filter(r => r.success && r.size)
    .reduce((sum, r) => sum + (r.size || 0), 0);

  console.log('\n=== Download Summary ===');
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  return results;
}

/**
 * Get catalog type by code or name
 */
export function getCatalogType(identifier: string): CatalogType | null {
  // Try by code
  const byCode = Object.values(CATALOG_TYPES).find(c => c.code === identifier.toUpperCase());
  if (byCode) return byCode;

  // Try by key
  const byKey = CATALOG_TYPES[identifier.toLowerCase()];
  if (byKey) return byKey;

  return null;
}

/**
 * Validate catalog file content
 * Returns true if content looks valid
 */
export function validateCatalogContent(content: string, catalogType: CatalogType): boolean {
  if (!content || content.length < 100) {
    return false;
  }

  // Check for tab-separated format (BrickLink catalogs are TSV)
  const lines = content.split('\n');
  if (lines.length < 10) {
    return false;
  }

  // First line should be header
  const header = lines[0];
  if (!header.includes('\t')) {
    return false;
  }

  // Check for expected columns based on catalog type
  const hasItemNo = header.toLowerCase().includes('item no') || header.toLowerCase().includes('itemno');
  const hasName = header.toLowerCase().includes('name');

  return hasItemNo && hasName;
}
