import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * ADMIN ENDPOINT: Manual Catalog Upload
 *
 * Upload Minifigures.txt directly via POST request.
 *
 * Usage:
 * curl -X POST https://figtracker.ericksu.com/api/admin/upload-catalog \
 *   -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
 *   -H "Content-Type: text/plain" \
 *   --data-binary @Minifigures.txt
 */

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET;

    // Simple auth check
    if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const catalogText = await request.text();

    if (!catalogText || catalogText.length < 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid catalog data' },
        { status: 400 }
      );
    }

    console.log('📥 Processing uploaded catalog...');

    const lines = catalogText.split('\n');

    let imported = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    const batchSize = 100;
    let batch: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip first line (header) and empty lines
      if (i === 0 || line.trim() === '') {
        continue;
      }

      try {
        // Split by tabs
        const columns = line.split('\t');

        if (columns.length < 5) {
          skipped++;
          continue;
        }

        const categoryId = parseInt(columns[0]);
        const categoryName = columns[1];
        const number = columns[2];
        const name = columns[3];
        const yearReleased = columns[4] === '?' ? null : columns[4];
        const weightGrams = columns[5] ? parseFloat(columns[5]) : null;

        if (!number || !name) {
          skipped++;
          continue;
        }

        batch.push({
          categoryId,
          categoryName,
          number,
          name,
          yearReleased,
          weightGrams,
        });

        // When batch is full, insert into database
        if (batch.length >= batchSize) {
          const result = await insertBatch(batch);
          imported += result.created;
          updated += result.updated;
          console.log(`✅ Processed ${imported + updated} minifigures...`);
          batch = [];
        }
      } catch (error) {
        console.error(`Error on line ${i + 1}:`, error);
        errors++;
      }
    }

    // Insert remaining items
    if (batch.length > 0) {
      const result = await insertBatch(batch);
      imported += result.created;
      updated += result.updated;
    }

    console.log('✨ Catalog upload complete:', { imported, updated, skipped, errors });

    return NextResponse.json({
      success: true,
      message: 'Catalog uploaded and processed successfully',
      stats: {
        created: imported,
        updated,
        skipped,
        errors,
        total: imported + updated
      }
    });

  } catch (error) {
    console.error('Catalog upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process catalog', details: String(error) },
      { status: 500 }
    );
  }
}

async function insertBatch(batch: any[]) {
  let created = 0;
  let updated = 0;

  const promises = batch.map(async (item) => {
    const existing = await prisma.minifigCatalog.findUnique({
      where: { minifigure_no: item.number }
    });

    const result = await prisma.minifigCatalog.upsert({
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
        updated_at: new Date(),
      },
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }

    return result;
  });

  await Promise.all(promises);

  return { created, updated };
}

// Also support GET to show upload instructions
export async function GET() {
  return NextResponse.json({
    message: 'Manual Catalog Upload Endpoint',
    instructions: {
      step1: 'Download catalog from: https://www.bricklink.com/catalogDownload.asp',
      step2: 'Upload via curl command:',
      command: 'curl -X POST https://figtracker.ericksu.com/api/admin/upload-catalog -H "Authorization: Bearer YOUR_ADMIN_SECRET" -H "Content-Type: text/plain" --data-binary @Minifigures.txt',
      note: 'Set ADMIN_SECRET in your environment variables for authentication'
    }
  });
}
