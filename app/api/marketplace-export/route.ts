import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  collectExportItems,
  collectExportItemsFromRows,
  guestRowsFromItems,
  parseExportRequest,
} from '@/lib/marketplace/export';
import { getAdapter, MARKETPLACE_IDS } from '@/lib/marketplace/registry';
import { resolvePublicBaseUrl, warmListingImages } from '@/lib/marketplace/images';
import { itemTypeForSource } from '@/lib/marketplace/types';

/**
 * Build every requested marketplace file for one selection.
 *
 * Returns the files as JSON rather than a single download, because one
 * selection can produce several files — two marketplaces, or one marketplace
 * whose file-size cap forces a split. The client turns each into its own
 * download button, which also means every download is a real user gesture and
 * nothing gets blocked by the browser.
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

    /**
     * Signed-out visitors keep their collection in localStorage, so they post
     * the rows with the request instead of us loading them by user id. There
     * is nothing to authorise: the response contains only what the caller sent,
     * and prices are re-read server-side rather than taken from the body.
     *
     * Turning these visitors away was costing us the warmest ones — someone who
     * has already added items and reached the export page is as close to
     * converting as a visitor gets.
     */
    const collected = session?.user?.id
      ? await collectExportItems(session.user.id, source, itemIds)
      : await collectExportItemsFromRows(
          await guestRowsFromItems(Array.isArray(body?.guestItems) ? body.guestItems : [], source),
          source,
          itemIds
        );

    if (collected.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            collected.totalSelected === 0
              ? 'No items selected.'
              : 'None of the selected items could be exported. Most likely they have no price yet.',
        },
        { status: 400 }
      );
    }

    const adapters = marketplaces.map((id) => getAdapter(id)).filter(Boolean);
    const notes: string[] = [];

    // --- images ------------------------------------------------------------
    // Only mirror when some adapter actually emits image URLs. BrickLink uses
    // its own catalog photos, so a BrickLink-only export skips this entirely.
    const optionsById = new Map(
      adapters.map((a) => [a!.id, a!.parseOptions(optionsByMarketplace[a!.id])])
    );

    const anyWantsImages = adapters.some((a) => {
      if (!a!.needsImages) return false;
      const opts = optionsById.get(a!.id) as any;
      return opts?.includeImages !== false;
    });

    if (anyWantsImages) {
      const baseUrl = resolvePublicBaseUrl(request.headers.get('host'));

      if (!baseUrl) {
        // Local dev: emitting http://localhost URLs would give the marketplace
        // dead links, so leave them out and say why rather than shipping bad data.
        notes.push(
          'Image links were left out because this export was generated from a local environment, where the URLs would not be reachable by the marketplace.'
        );
      } else {
        const itemType = itemTypeForSource(source);
        const mirrored = await warmListingImages(
          collected.items.map((item) => ({ type: itemType, itemNo: item.itemNo })),
          { delayMs: 250 }
        );

        let missing = 0;
        for (const item of collected.items) {
          const found = mirrored.get(`${itemType}:${item.itemNo}`);
          if (found?.urlPath) item.imageUrl = `${baseUrl}${found.urlPath}`;
          else missing++;
        }

        if (missing > 0) {
          notes.push(
            `${missing} item${missing === 1 ? '' : 's'} had no catalog image available. Add a photo to those drafts before publishing.`
          );
        }
      }
    }

    // --- build each marketplace's files ------------------------------------
    const stamp = new Date().toISOString().slice(0, 10);
    const files: Array<Record<string, any>> = [];

    for (const adapter of adapters) {
      const options = optionsById.get(adapter!.id);
      const rows: any[] = [];

      for (const item of collected.items) {
        const result = adapter!.toRow(item, options);
        if (result) rows.push(result.row);
      }

      if (rows.length === 0) continue;

      const produced = adapter!.serialise(rows, options);

      produced.forEach((file, index) => {
        const part =
          produced.length > 1 ? `-part-${index + 1}-of-${produced.length}` : '';
        files.push({
          marketplace: adapter!.id,
          label: adapter!.label,
          filename: `${file.nameHint}-${source}-${stamp}${part}.${adapter!.fileExtension}`,
          mimeType: adapter!.mimeType,
          bytes: Buffer.byteLength(file.content, 'utf8'),
          rowCount: rows.length,
          partIndex: index + 1,
          partCount: produced.length,
          content: file.content,
        });
      });
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nothing could be exported for the marketplaces you picked.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        files,
        totalSelected: collected.totalSelected,
        exportable: collected.items.length,
        skipped: collected.skipped.map((s) => ({
          itemNo: s.itemNo,
          name: s.name,
          reason: s.reason,
        })),
        notes,
      },
    });
  } catch (error) {
    console.error('[marketplace-export]', error);
    return NextResponse.json({ success: false, error: 'Failed to build export' }, { status: 500 });
  }
}
