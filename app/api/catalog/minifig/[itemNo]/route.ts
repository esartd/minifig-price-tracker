import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours

export async function GET(
  request: Request,
  { params }: { params: Promise<{ itemNo: string }> }
) {
  try {
    const { itemNo } = await params;
    const filePath = path.join(process.cwd(), 'public', 'catalog', 'minifigs.json');

    // Read file and parse
    const content = fs.readFileSync(filePath, 'utf-8');
    const catalog = JSON.parse(content);

    // Find specific minifig
    const minifig = catalog.find((m: any) => m.minifigure_no === itemNo);

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
