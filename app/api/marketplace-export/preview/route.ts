import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  collectExportItems,
  collectExportItemsFromRows,
  guestRowsFromItems,
  parseExportRequest,
} from '@/lib/marketplace/export';
import { getAdapter, MARKETPLACE_IDS } from '@/lib/marketplace/registry';

/**
 * Preview what an export would produce, for every ticked marketplace.
 *
 * Deliberately does no image work, so the tool can re-render instantly whenever
 * the seller changes an option. Mirroring only happens on the real export.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const parsed = parseExportRequest(body, MARKETPLACE_IDS);
    if (parsed.error || !parsed.value) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }

    const { source, itemIds, marketplaces, optionsByMarketplace } = parsed.value;

    // Same guest path as the export route — see the note there.
    const collected = session?.user?.id
      ? await collectExportItems(session.user.id, source, itemIds)
      : await collectExportItemsFromRows(
          await guestRowsFromItems(Array.isArray(body?.guestItems) ? body.guestItems : [], source),
          source,
          itemIds
        );

    const perMarketplace = marketplaces.map((id) => {
      const adapter = getAdapter(id);
      if (!adapter) return null;

      const options = adapter.parseOptions(optionsByMarketplace[id]);
      const warningsByItem = new Map<string, string[]>();
      let rowCount = 0;

      for (const item of collected.items) {
        const result = adapter.toRow(item, options);
        if (!result) continue;
        rowCount++;
        const existing = collected.warningsByItemNo.get(item.itemNo) ?? [];
        const all = [...existing, ...result.warnings];
        if (all.length) warningsByItem.set(item.itemNo, all);
      }

      return {
        marketplace: id,
        label: adapter.label,
        fileExtension: adapter.fileExtension,
        exportable: rowCount,
        warnings: [...warningsByItem.entries()].map(([itemNo, messages]) => ({
          itemNo,
          name: collected.items.find((i) => i.itemNo === itemNo)?.name ?? itemNo,
          messages,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalSelected: collected.totalSelected,
        skipped: collected.skipped.map((s) => ({
          itemNo: s.itemNo,
          name: s.name,
          reason: s.reason,
        })),
        marketplaces: perMarketplace.filter(Boolean),
      },
    });
  } catch (error) {
    console.error('[marketplace-export/preview]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to build preview' },
      { status: 500 }
    );
  }
}
