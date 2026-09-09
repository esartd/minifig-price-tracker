import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { LOCALES } from '@/lib/catalog-descriptions.mjs';

/**
 * Coverage of catalog descriptions, per catalog and per locale.
 *
 * Two things were wrong here and both made the admin page report fiction.
 *
 * 1. It counted FOUR locales -- `withDescriptions * 4`, with a comment saying
 *    "4 languages per minifig" -- so after the columns went to ten it was
 *    understating coverage by more than half, and a locale could be completely
 *    empty without the number moving. It now counts each locale for real
 *    rather than multiplying by a constant, so adding locale eleven cannot
 *    silently invalidate it.
 *
 * 2. It only looked at MinifigCatalog. SetsCatalog has the same columns and
 *    the same backfill, and was simply absent from the dashboard.
 *
 * It also had no auth guard at all: GET returned catalogue totals to anyone
 * who asked. Not user data, but it is not public information either, and every
 * neighbouring admin route already gates itself.
 */
export async function GET() {
  const { authorized, error } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error }, { status: error === 'Unauthorized' ? 401 : 403 });
  }

  try {
    const anyDescription = {
      OR: LOCALES.map((l) => ({ [`description_${l}`]: { not: null } })),
    };

    // One count per locale, so an empty locale shows as an empty locale
    // instead of disappearing into an average.
    async function coverage(
      table: { count: (args?: any) => Promise<number> },
      label: string
    ) {
      const total = await table.count();
      const withAny = await table.count({ where: anyDescription });

      const perLocale: Record<string, number> = {};
      for (const locale of LOCALES) {
        perLocale[locale] = await table.count({
          where: { [`description_${locale}`]: { not: null } },
        });
      }

      const filled = Object.values(perLocale).reduce((a, b) => a + b, 0);

      return {
        catalog: label,
        total,
        generated: withAny,
        pending: total - withAny,
        percentage: total ? ((withAny / total) * 100).toFixed(2) + '%' : '0.00%',
        // Actual filled cells, not rows x a hard-coded locale count.
        descriptionsFilled: filled,
        descriptionsPossible: total * LOCALES.length,
        perLocale,
      };
    }

    const minifigs = await coverage(prisma.minifigCatalog as any, 'MinifigCatalog');
    const sets = await coverage(prisma.setsCatalog as any, 'SetsCatalog');

    return NextResponse.json({
      locales: LOCALES,
      minifigs,
      sets,
      // Kept so anything already reading these keys does not break, but now
      // spanning both catalogs and all ten locales.
      total: minifigs.total + sets.total,
      generated: minifigs.generated + sets.generated,
      pending: minifigs.pending + sets.pending,
      errors: 0,
      totalLanguages: minifigs.descriptionsFilled + sets.descriptionsFilled,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
