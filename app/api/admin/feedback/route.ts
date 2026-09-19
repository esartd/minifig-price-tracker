import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

/**
 * Change a feedback item's status, or mark it read.
 *
 * Admin only, via requireAdmin() -- never a hand-written address. The docstring
 * on lib/admin-auth.ts records what happened the twelve times that was typed
 * out by hand.
 */

export const dynamic = 'force-dynamic';

const VALID_STATUSES = new Set(['new', 'in_progress', 'done', 'declined']);

export async function PATCH(request: NextRequest) {
  const { authorized, error } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ success: false, error }, { status: error === 'Unauthorized' ? 401 : 403 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 });
    }

    // A status set on a cluster applies to every report in it: they are the
    // same complaint, so fixing one fixes all of them. Passing a single id
    // still works -- it is just a cluster of one.
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids.filter((i: unknown) => typeof i === 'string')
      : typeof body.id === 'string'
        ? [body.id]
        : [];

    if (ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No ids' }, { status: 400 });
    }

    const data: { status?: string; readAt?: Date } = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
      }
      data.status = body.status;
      // Acting on something is reading it. Without this the unread badge on
      // /admin/stats would keep counting items already worked.
      data.readAt = new Date();
    } else if (body.read === true) {
      data.readAt = new Date();
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 });
    }

    const result = await prisma.feedback.updateMany({ where: { id: { in: ids } }, data });

    return NextResponse.json({ success: true, updated: result.count });
  } catch (err: any) {
    console.error('[ADMIN FEEDBACK] Error:', err.message);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
