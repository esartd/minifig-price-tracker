import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Count total minifigs
    const total = await prisma.minifigCatalog.count();

    // Count minifigs with at least one description
    const withDescriptions = await prisma.minifigCatalog.count({
      where: {
        OR: [
          { description_en: { not: null } },
          { description_de: { not: null } },
          { description_fr: { not: null } },
          { description_es: { not: null } },
        ]
      }
    });

    const pending = total - withDescriptions;

    return NextResponse.json({
      total,
      pending,
      generated: withDescriptions,
      errors: 0,
      percentage: ((withDescriptions / total) * 100).toFixed(2) + '%',
      totalLanguages: withDescriptions * 4, // 4 languages per minifig
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
