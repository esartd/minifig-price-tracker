import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'catalog', 'minifigs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

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
