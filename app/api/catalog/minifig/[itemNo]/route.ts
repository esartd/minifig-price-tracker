import { NextResponse } from 'next/server';
import { findMinifigByNumber } from '@/lib/catalog-static';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours

export async function GET(
  request: Request,
  { params }: { params: Promise<{ itemNo: string }> }
) {
  try {
    const { itemNo } = await params;

    // Use cached lookup function instead of reading file
    const minifig = await findMinifigByNumber(itemNo);

    if (!minifig) {
      return NextResponse.json(
        { error: 'Minifig not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(minifig, {
      headers: {
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving minifig:', error);
    return NextResponse.json(
      { error: 'Failed to load minifig' },
      { status: 500 }
    );
  }
}
