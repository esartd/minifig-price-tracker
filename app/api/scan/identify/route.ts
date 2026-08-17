import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { auth } from '@/auth';
import { isPremiumUser } from '@/lib/premium';
import { prisma } from '@/lib/prisma';
import { identifyMinifig, type GuessCandidate, type IdentifyResult } from '@/lib/gemini-vision';
import { findMinifigByNumber, searchMinifigs } from '@/lib/catalog-static';
import { pricingOrchestrator, LOGGED_IN_TTL_HOURS } from '@/lib/pricing-orchestrator';

const DAILY_LIMIT = parseInt(process.env.SCAN_DAILY_LIMIT || '30', 10);

interface ResolvedGuess {
  itemNo: string;
  name: string;
  confidence: number;
  category_name: string;
  image_url: string | null;
}

/**
 * Resolves an AI guess against the real catalog -- exact item-number match
 * first, falling back to a fuzzy name search. Never returns a BrickLink ID
 * that isn't actually in our catalog.
 */
async function resolveGuess(guess: GuessCandidate): Promise<ResolvedGuess | null> {
  const exact = await findMinifigByNumber(guess.itemNo);
  if (exact) {
    return {
      itemNo: exact.minifigure_no,
      name: exact.name,
      confidence: guess.confidence,
      category_name: exact.category_name,
      image_url: exact.image_url,
    };
  }

  const fuzzyMatches = await searchMinifigs(guess.name, 3);
  if (fuzzyMatches.length > 0) {
    const top = fuzzyMatches[0];
    return {
      itemNo: top.minifigure_no,
      name: top.name,
      // Lower confidence since the AI's item number didn't exist and this is a fallback name match
      confidence: guess.confidence * 0.7,
      category_name: top.category_name,
      image_url: top.image_url,
    };
  }

  return null;
}

function buildPartsResponse(parts: Extract<IdentifyResult, { isMixed: true }>['parts']) {
  const out: Record<string, { itemNo: string; name: string; confidence: number; bricklinkUrl: string }> = {};
  (['head', 'torso', 'legs', 'hair'] as const).forEach((key) => {
    const guess = parts[key];
    if (guess) {
      out[key] = {
        itemNo: guess.itemNo,
        name: guess.name,
        confidence: guess.confidence,
        bricklinkUrl: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${encodeURIComponent(guess.itemNo)}`,
      };
    }
  });
  return out;
}

/**
 * POST /api/scan/identify
 *
 * Premium-only: identify a LEGO minifigure (or its individual parts, for a
 * custom/mixed figure) from an uploaded photo via the Gemini API, resolve
 * the guess(es) against the real catalog, and return the BrickLink ID(s)
 * plus current market value (complete-figure case only -- there's no
 * internal catalog/pricing for individual parts).
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await isPremiumUser(session.user.id))) {
      return NextResponse.json(
        { error: 'Premium subscription required', code: 'PREMIUM_REQUIRED' },
        { status: 403 }
      );
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const scansToday = await prisma.scanHistory.count({
      where: { userId: session.user.id, scannedAt: { gte: since } },
    });
    if (scansToday >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: `Daily scan limit reached (${DAILY_LIMIT}/day). Try again tomorrow.`,
          code: 'DAILY_LIMIT_REACHED',
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const optimizedBuffer = await sharp(rawBuffer)
      .resize(1024, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 85 })
      .toBuffer();

    let aiResult: IdentifyResult;
    try {
      aiResult = await identifyMinifig(optimizedBuffer, 'image/webp');
    } catch (err) {
      console.error('[Scan Identify] Gemini call failed:', err);
      return NextResponse.json(
        { error: "Couldn't analyze that photo. Please try again.", code: 'IDENTIFY_FAILED' },
        { status: 502 }
      );
    }

    // Save the (compressed) photo regardless of outcome -- useful for
    // reviewing misidentifications and improving the feature later.
    const imageFilename = `${randomUUID()}.webp`;
    const scansDir = path.join(process.cwd(), 'public', 'uploads', 'scans');
    await mkdir(scansDir, { recursive: true });
    await writeFile(path.join(scansDir, imageFilename), optimizedBuffer);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const imageUrl = `${baseUrl}/uploads/scans/${imageFilename}`;

    if (aiResult.isMixed) {
      const parts = buildPartsResponse(aiResult.parts);
      const scanRecord = await prisma.scanHistory.create({
        data: {
          userId: session.user.id,
          imageUrl,
          isMixed: true,
          topMatches: parts,
        },
      });

      return NextResponse.json({
        success: true,
        scanId: scanRecord.id,
        isMixed: true,
        matched: Object.keys(parts).length > 0,
        parts,
      });
    }

    // Complete-figure case: resolve primary + alternates against the catalog
    const completeResult = aiResult as Extract<IdentifyResult, { isMixed: false }>;
    const resolvedPrimary = await resolveGuess(completeResult.primary);
    const resolvedAlternates = (
      await Promise.all(completeResult.alternates.map(resolveGuess))
    ).filter((g): g is ResolvedGuess => g !== null);

    let finalPrimary = resolvedPrimary;
    let finalAlternates = resolvedAlternates;
    if (!finalPrimary && finalAlternates.length > 0) {
      [finalPrimary, ...finalAlternates] = finalAlternates;
    }

    const scanRecord = await prisma.scanHistory.create({
      data: {
        userId: session.user.id,
        imageUrl,
        isMixed: false,
        detectedItemNo: finalPrimary?.itemNo ?? null,
        detectedName: finalPrimary?.name ?? completeResult.primary.name,
        confidence: finalPrimary?.confidence ?? completeResult.primary.confidence,
        topMatches: finalAlternates.map((a) => ({ itemNo: a.itemNo, name: a.name, confidence: a.confidence })),
      },
    });

    if (!finalPrimary) {
      return NextResponse.json({
        success: true,
        scanId: scanRecord.id,
        isMixed: false,
        matched: false,
        message: "Couldn't confidently identify this minifigure. Try a clearer or closer photo.",
      });
    }

    const countryCode = session.user.preferredCountryCode || 'US';
    const region = session.user.preferredRegion || 'north_america';
    const pricing = await pricingOrchestrator.getMinifigPrice(
      finalPrimary.itemNo,
      'new',
      countryCode,
      region,
      session.user.id,
      'api-endpoint',
      false,
      finalPrimary.name,
      LOGGED_IN_TTL_HOURS,
    );

    return NextResponse.json({
      success: true,
      scanId: scanRecord.id,
      isMixed: false,
      matched: true,
      primary: {
        itemNo: finalPrimary.itemNo,
        name: finalPrimary.name,
        confidence: finalPrimary.confidence,
        image_url: finalPrimary.image_url,
        category_name: finalPrimary.category_name,
      },
      pricing,
      alternates: finalAlternates.map((a) => ({ itemNo: a.itemNo, name: a.name, confidence: a.confidence })),
    });
  } catch (error) {
    console.error('[Scan Identify] Error:', error);
    return NextResponse.json({ error: 'Failed to identify photo' }, { status: 500 });
  }
}
