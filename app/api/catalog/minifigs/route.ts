import { NextResponse } from 'next/server';
import { getAllMinifigs } from '@/lib/catalog-static';

export async function GET() {
  try {
    const data = await getAllMinifigs();

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      }
    );
  } catch (error) {
    console.error('Error serving catalog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load catalog' },
      { status: 500 }
    );
  }
}
