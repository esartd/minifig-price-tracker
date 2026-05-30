import { NextResponse } from 'next/server';

// SHARING FEATURE DISABLED - Share tokens removed from database schema

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Sharing feature is currently unavailable' },
    { status: 503 }
  );
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Sharing feature is currently unavailable' },
    { status: 503 }
  );
}
