import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { database } from '@/lib/database';

type CollectionType = 'inventory' | 'collection' | 'sets-inventory' | 'sets-collection';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // SHARING FEATURE DISABLED - Share tokens removed from database schema
    // This endpoint returns 503 Service Unavailable
    return NextResponse.json(
      { success: false, error: 'Sharing feature is currently unavailable' },
      { status: 503 }
    );

    /* DISABLED CODE - Share tokens no longer exist in schema */
  } catch (error) {
    console.error('Error loading shared collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load collection' },
      { status: 500 }
    );
  }
}
