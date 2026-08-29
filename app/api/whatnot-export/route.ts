import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { buildCsv } from '@/lib/whatnot-csv';
import {
  buildExportRows,
  itemTypeForSource,
  parseExportRequest,
} from '@/lib/whatnot-export';
import { resolvePublicBaseUrl, warmListingImages } from '@/lib/listing-images';

/**
 * Build and return the Whatnot CSV.
 *
 * Mirroring images is the slow part: each item we haven't seen before costs one
 * throttled BrickLink fetch. Repeat exports of the same items are nearly
 * instant because the mirror is permanent.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = parseExportRequest(await request.json());
    if (parsed.error || !parsed.value) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }

    const { source, itemIds, options } = parsed.value;
    const result = await buildExportRows(session.user.id, source, itemIds, options);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            result.items.length === 0
              ? 'No items selected.'
              : 'None of the selected items could be exported. Most likely they have no price yet.',
        },
        { status: 400 }
      );
    }

    // --- images ------------------------------------------------------------
    const imageWarnings: string[] = [];

    if (options.includeImages) {
      const baseUrl = resolvePublicBaseUrl(request.headers.get('host'));

      if (!baseUrl) {
        // Local dev: emitting http://localhost URLs would give Whatnot dead links,
        // so leave the column empty and say why rather than shipping bad data.
        imageWarnings.push(
          'Image links were left out because this export was generated from a local environment, where the URLs would not be reachable by Whatnot.'
        );
      } else {
        const itemType = itemTypeForSource(source);
        const exportable = result.items.filter((item) => item.row);

        const mirrored = await warmListingImages(
          exportable.map((item) => ({ type: itemType, itemNo: item.itemNo })),
          { delayMs: 250 }
        );

        let missing = 0;
        for (const item of exportable) {
          const found = mirrored.get(`${itemType}:${item.itemNo}`);
          if (found?.urlPath) {
            item.row!.imageUrls = [`${baseUrl}${found.urlPath}`];
          } else {
            missing++;
          }
        }

        if (missing > 0) {
          imageWarnings.push(
            `${missing} item${missing === 1 ? '' : 's'} had no catalog image available. Add a photo to those drafts in Whatnot before publishing.`
          );
        }
      }
    }

    const csv = buildCsv(result.rows);
    const filename = `whatnot-${source}-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
        // Surfaced by the client so the seller sees what to double-check.
        'X-Export-Rows': String(result.rows.length),
        'X-Export-Skipped': String(result.skipped.length),
        ...(imageWarnings.length > 0
          ? { 'X-Export-Notes': encodeURIComponent(imageWarnings.join(' ')) }
          : {}),
      },
    });
  } catch (error) {
    console.error('[whatnot-export]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to build CSV' },
      { status: 500 }
    );
  }
}
