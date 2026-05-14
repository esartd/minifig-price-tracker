import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';


export async function GET(request: NextRequest) {
  try {
    const stats = await prisma.minifigCatalog.groupBy({
      by: ['description_status'],
      _count: true
    });

    const total = 18769;
    const pending = stats.find(s => s.description_status === 'pending')?._count || 0;
    const generated = stats.find(s => s.description_status === 'generated')?._count || 0;
    const errors = stats.find(s => s.description_status === 'error')?._count || 0;

    return NextResponse.json({
      total,
      pending,
      generated,
      errors,
      percentage: ((generated / total) * 100).toFixed(2) + '%',
      totalLanguages: generated * 4, // 4 languages per minifig
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
