import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const categoryIdNum = parseInt(categoryId);

    if (isNaN(categoryIdNum)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', 'catalog', 'minifigs.json');

    // Read file and parse
    const content = fs.readFileSync(filePath, 'utf-8');
    const catalog = JSON.parse(content);

    // Filter by category
    const minifigs = catalog.filter((m: any) => m.category_id === categoryIdNum);

    return NextResponse.json(minifigs, {
      headers: {
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving category:', error);
    return NextResponse.json(
      { error: 'Failed to load category' },
      { status: 500 }
    );
  }
}
