import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const VALID_PARTS = ['head', 'torso', 'legs', 'hair'] as const;
type Part = (typeof VALID_PARTS)[number];

/**
 * POST /api/scan/[scanId]/feedback
 *
 * Lets the user confirm or correct the AI's guess from a prior
 * /api/scan/identify call. Two body shapes depending on the scan's kind:
 *   - complete figure: { wasCorrect: boolean, correctedItemNo?: string }
 *   - mixed figure:    { part: 'head'|'torso'|'legs'|'hair', wasCorrect: boolean, correctedItemNo?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scanId } = await params;
    const scan = await prisma.scanHistory.findUnique({ where: { id: scanId } });
    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }
    if (scan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const wasCorrect = body?.wasCorrect;
    if (typeof wasCorrect !== 'boolean') {
      return NextResponse.json({ error: 'wasCorrect (boolean) is required' }, { status: 400 });
    }
    const correctedItemNo: string | undefined =
      typeof body?.correctedItemNo === 'string' && body.correctedItemNo.trim().length > 0
        ? body.correctedItemNo.trim()
        : undefined;

    if (scan.isMixed) {
      const part = body?.part;
      if (!VALID_PARTS.includes(part)) {
        return NextResponse.json(
          { error: `part must be one of: ${VALID_PARTS.join(', ')}` },
          { status: 400 }
        );
      }

      const existing = (scan.partFeedback as Record<Part, unknown> | null) || {};
      const updated = {
        ...existing,
        [part as Part]: { wasCorrect, correctedItemNo: correctedItemNo ?? null },
      };

      await prisma.scanHistory.update({
        where: { id: scanId },
        data: { partFeedback: updated, feedbackAt: new Date() },
      });

      return NextResponse.json({ success: true, partFeedback: updated });
    }

    await prisma.scanHistory.update({
      where: { id: scanId },
      data: {
        wasCorrect,
        correctedItemNo: correctedItemNo ?? null,
        feedbackAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, wasCorrect, correctedItemNo: correctedItemNo ?? null });
  } catch (error) {
    console.error('[Scan Feedback] Error:', error);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
