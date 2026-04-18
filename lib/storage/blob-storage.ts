import { put, list, del } from '@vercel/blob';

/**
 * Vercel Blob Storage integration for catalog files
 * Provides abstraction layer for saving/reading catalog files
 */

const CATALOG_PREFIX = 'catalogs/';

export interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}

/**
 * Save catalog file to Vercel Blob Storage
 * Returns the blob URL
 */
export async function saveCatalogFile(
  filename: string,
  content: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
  }

  try {
    const blob = await put(`${CATALOG_PREFIX}${filename}`, content, {
      access: 'public',
      token,
      contentType: 'text/plain',
    });

    console.log(`✓ Saved ${filename} to Blob Storage: ${blob.url}`);

    return blob.url;
  } catch (error) {
    console.error(`Failed to save ${filename} to Blob Storage:`, error);
    throw error;
  }
}

/**
 * Get catalog file from Vercel Blob Storage
 * Returns file content as string, or null if not found
 */
export async function getCatalogFile(filename: string): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    console.warn('BLOB_READ_WRITE_TOKEN not set, cannot read from Blob Storage');
    return null;
  }

  try {
    const { blobs } = await list({
      prefix: `${CATALOG_PREFIX}${filename}`,
      token,
    });

    if (blobs.length === 0) {
      console.log(`File not found in Blob Storage: ${filename}`);
      return null;
    }

    // Get the most recent file (in case of duplicates)
    const latestBlob = blobs.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];

    const response = await fetch(latestBlob.url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const content = await response.text();

    console.log(`✓ Retrieved ${filename} from Blob Storage (${(content.length / 1024).toFixed(2)} KB)`);

    return content;
  } catch (error) {
    console.error(`Error reading ${filename} from Blob Storage:`, error);
    return null;
  }
}

/**
 * List all catalog files in Blob Storage
 */
export async function listCatalogFiles(): Promise<BlobFile[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
  }

  try {
    const { blobs } = await list({
      prefix: CATALOG_PREFIX,
      token,
    });

    return blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: new Date(blob.uploadedAt),
    }));
  } catch (error) {
    console.error('Error listing catalog files:', error);
    throw error;
  }
}

/**
 * Delete a catalog file from Blob Storage
 */
export async function deleteCatalogFile(filename: string): Promise<boolean> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
  }

  try {
    const { blobs } = await list({
      prefix: `${CATALOG_PREFIX}${filename}`,
      token,
    });

    if (blobs.length === 0) {
      console.log(`File not found: ${filename}`);
      return false;
    }

    // Delete all matching files
    for (const blob of blobs) {
      await del(blob.url, { token });
      console.log(`✓ Deleted ${filename} from Blob Storage`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting ${filename}:`, error);
    throw error;
  }
}

/**
 * Delete all catalog files from Blob Storage
 */
export async function deleteAllCatalogFiles(): Promise<number> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
  }

  try {
    const { blobs } = await list({
      prefix: CATALOG_PREFIX,
      token,
    });

    let deletedCount = 0;

    for (const blob of blobs) {
      await del(blob.url, { token });
      deletedCount++;
    }

    console.log(`✓ Deleted ${deletedCount} catalog files from Blob Storage`);

    return deletedCount;
  } catch (error) {
    console.error('Error deleting catalog files:', error);
    throw error;
  }
}

/**
 * Get storage stats for catalog files
 */
export async function getCatalogStorageStats(): Promise<{
  totalFiles: number;
  totalSize: number;
  files: Array<{ filename: string; size: number; uploadedAt: Date }>;
}> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
  }

  try {
    const { blobs } = await list({
      prefix: CATALOG_PREFIX,
      token,
    });

    const totalSize = blobs.reduce((sum, blob) => sum + blob.size, 0);

    const files = blobs.map(blob => ({
      filename: blob.pathname.replace(CATALOG_PREFIX, ''),
      size: blob.size,
      uploadedAt: new Date(blob.uploadedAt),
    }));

    return {
      totalFiles: blobs.length,
      totalSize,
      files,
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    throw error;
  }
}
