import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOwnedMinifigQuantities, getOwnedSetQuantities } from '@/lib/owned-quantities';

// Lets minifig/set detail pages show a small "you own N of these" badge on
// related-item cards. Pages that use this data (e.g. /minifigs/[itemNo],
// /sets/[boxNo]) are ISR-cached and shared across all visitors, so this
// lookup can't happen in those server components - it has to be a
// client-side call scoped to the logged-in user's own session.
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    // Not logged in - nothing to show, but not an error
    return NextResponse.json({ minifigs: {}, sets: {} });
  }

  try {
    const body = await request.json();
    const minifigNos: string[] = Array.isArray(body.minifigNos) ? body.minifigNos : [];
    const boxNos: string[] = Array.isArray(body.boxNos) ? body.boxNos : [];

    const [minifigs, sets] = await Promise.all([
      getOwnedMinifigQuantities(session.user.id, minifigNos),
      getOwnedSetQuantities(session.user.id, boxNos)
    ]);

    return NextResponse.json({ minifigs, sets });
  } catch (error) {
    console.error('Owned quantities lookup error:', error);
    return NextResponse.json({ minifigs: {}, sets: {} }, { status: 500 });
  }
}
