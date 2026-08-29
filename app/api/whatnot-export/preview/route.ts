import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { buildExportRows, parseExportRequest } from '@/lib/whatnot-export';

/**
 * Preview the rows a Whatnot export would produce.
 *
 * Deliberately does no image work, so the tool can re-render instantly whenever
 * the seller changes an option. Mirroring only happens on the real export.
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

    return NextResponse.json({
      success: true,
      data: {
        rows: result.rows,
        totalSelected: result.items.length,
        exportable: result.rows.length,
        warnings: result.items
          .filter((item) => item.warnings.length > 0)
          .map((item) => ({
            itemNo: item.itemNo,
            name: item.name,
            messages: item.warnings,
          })),
        skipped: result.skipped.map((item) => ({
          itemNo: item.itemNo,
          name: item.name,
          reason: item.skippedReason,
        })),
      },
    });
  } catch (error) {
    console.error('[whatnot-export/preview]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to build preview' },
      { status: 500 }
    );
  }
}
