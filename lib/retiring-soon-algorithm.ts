// Core retirement prediction algorithm for LEGO sets
import { loadAllBoxes } from '@/lib/boxes-data';
import type { LegoBox } from '@/types';
import { prisma } from '@/lib/prisma';

export interface RetirementPrediction {
  boxNo: string;
  name: string;
  theme: string;
  yearReleased: number;
  imageUrl?: string;
  availabilityStatus: 'available' | 'retiring_soon' | 'retired';
  retirementScore: number; // 0-100, higher = more urgent
  confidence: 'low' | 'medium' | 'high';
  signals: {
    ageScore: number;
    priceScore: number;
    manualOverride: boolean;
  };
  estimatedRetirementQuarter?: string; // "Q4 2026"
  estimatedRetirementDate?: Date;
  reasoning: string;
  ageYears: number;
  priceIncrease?: number | null; // Percentage price increase in last 90 days
}

// Check BrickLink availability to detect if set is actually retired
async function checkBrickLinkAvailability(boxNo: string): Promise<{
  isRetired: boolean;
  availabilityScore: number; // 0-40 points
  confidence: 'high' | 'medium' | 'low';
  signal: string;
}> {
  try {
    // Skip if no database connection
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('postgresql://')) {
      return {
        isRetired: false,
        availabilityScore: 0,
        confidence: 'low',
        signal: 'no_database'
      };
    }

    const priceData = await prisma.priceCache.findFirst({
      where: {
        item_no: boxNo,
        item_type: 'SET',
        condition: 'N' // New condition
      },
      orderBy: { cached_at: 'desc' },
      select: {
        current_avg: true,
        six_month_avg: true,
        current_lowest: true,
        cached_at: true
      }
    });

    if (!priceData) {
      return {
        isRetired: false,
        availabilityScore: 0,
        confidence: 'low',
        signal: 'no_price_data'
      };
    }

    const priceRatio = priceData.current_avg / priceData.six_month_avg;
    const dataAge = Date.now() - priceData.cached_at.getTime();
    const daysOld = dataAge / (1000 * 60 * 60 * 24);

    // Signal 1: No price data for 60+ days = Likely retired
    if (daysOld > 60) {
      return {
        isRetired: true,
        availabilityScore: 35,
        confidence: 'high',
        signal: 'stale_data_likely_retired'
      };
    }

    // Signal 2: Massive price spike (2x+) = Likely retired
    if (priceRatio > 2.0) {
      return {
        isRetired: true,
        availabilityScore: 40,
        confidence: 'high',
        signal: 'massive_price_spike'
      };
    }

    // Signal 3: Large price spike (1.8x+) = Retiring or retired
    if (priceRatio > 1.8) {
      return {
        isRetired: true,
        availabilityScore: 30,
        confidence: 'medium',
        signal: 'large_price_spike'
      };
    }

    // Signal 4: Moderate price spike (1.5x+) = Likely retiring soon
    if (priceRatio > 1.5) {
      return {
        isRetired: false,
        availabilityScore: 20,
        confidence: 'medium',
        signal: 'moderate_price_spike'
      };
    }

    // Signal 5: Price dropping = Still available
    if (priceRatio < 0.9) {
      return {
        isRetired: false,
        availabilityScore: -10, // Negative score reduces retirement likelihood
        confidence: 'medium',
        signal: 'price_dropping'
      };
    }

    // Normal availability
    return {
      isRetired: false,
      availabilityScore: 0,
      confidence: 'low',
      signal: 'normal_availability'
    };

  } catch (error) {
    console.error(`[RETIREMENT] Availability check error for ${boxNo}:`, error);
    return {
      isRetired: false,
      availabilityScore: 0,
      confidence: 'low',
      signal: 'error'
    };
  }
}

// Analyze price trends to detect retirement signals
async function analyzePriceTrend(boxNo: string): Promise<{
  priceScore: number; // 0-30 points
  priceIncrease: number | null; // Percentage increase
  confidence: 'low' | 'medium' | 'high';
  signal: string;
}> {
  try {
    // Skip price analysis if no database connection (development mode)
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('postgresql://')) {
      return {
        priceScore: 0,
        priceIncrease: null,
        confidence: 'low',
        signal: 'no_database'
      };
    }
    // Query PriceCache for current pricing (we don't have historical data yet)
    // Future: Add a proper PriceHistory table for sets to track trends over time
    const currentPrice = await prisma.priceCache.findFirst({
      where: {
        item_no: boxNo,
        item_type: 'SET',
        condition: 'N' // New condition
      },
      orderBy: { cached_at: 'desc' },
      select: {
        current_avg: true,
        six_month_avg: true,
        cached_at: true
      }
    });

    if (!currentPrice) {
      // No price data available
      return {
        priceScore: 0,
        priceIncrease: null,
        confidence: 'low',
        signal: 'no_price_data'
      };
    }

    // Calculate price increase: current_avg vs six_month_avg
    const currentAvg = currentPrice.current_avg;
    const sixMonthAvg = currentPrice.six_month_avg;

    if (sixMonthAvg === 0 || sixMonthAvg === null) {
      return {
        priceScore: 0,
        priceIncrease: null,
        confidence: 'low',
        signal: 'no_baseline'
      };
    }

    const priceIncrease = ((currentAvg - sixMonthAvg) / sixMonthAvg) * 100;

    // Score based on price increase
    let priceScore = 0;
    let confidence: 'low' | 'medium' | 'high' = 'low';
    let signal = 'stable';

    if (priceIncrease >= 30) {
      // Major spike - very strong retirement signal
      priceScore = 30;
      confidence = 'high';
      signal = 'major_spike';
    } else if (priceIncrease >= 20) {
      // Significant spike - strong retirement signal
      priceScore = 25;
      confidence = 'high';
      signal = 'significant_spike';
    } else if (priceIncrease >= 10) {
      // Moderate increase - retirement signal
      priceScore = 15;
      confidence = 'medium';
      signal = 'moderate_increase';
    } else if (priceIncrease >= 5) {
      // Slight increase
      priceScore = 5;
      confidence = 'low';
      signal = 'slight_increase';
    } else if (priceIncrease < -10) {
      // Price dropping - likely still available
      priceScore = -10; // Negative score reduces retirement likelihood
      confidence = 'medium';
      signal = 'price_dropping';
    }

    return {
      priceScore: Math.max(-10, Math.min(30, priceScore)),
      priceIncrease,
      confidence,
      signal
    };
  } catch (error) {
    console.error(`[RETIREMENT] Price trend analysis error for ${boxNo}:`, error);
    return {
      priceScore: 0,
      priceIncrease: null,
      confidence: 'low',
      signal: 'error'
    };
  }
}

// Get set lifespan with price tier detection for better accuracy
async function getSetLifespanByPriceAndTheme(theme: string, boxNo: string): Promise<number> {
  const themeLower = theme.toLowerCase();

  // Try to get price from PriceCache
  let price = 0;
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('postgresql://')) {
      // Development mode - use theme-only
      return getSetLifespanByThemeOnly(theme);
    }

    const priceData = await prisma.priceCache.findFirst({
      where: {
        item_no: boxNo,
        item_type: 'SET',
        condition: 'N'
      },
      orderBy: { cached_at: 'desc' },
      select: { current_avg: true }
    });

    price = priceData ? priceData.current_avg : 0;
  } catch (error) {
    // Fallback to theme-only if price lookup fails
    return getSetLifespanByThemeOnly(theme);
  }

  // UCS/Icons with price tiers
  if (themeLower.includes('icons') || themeLower.includes('ucs') || themeLower.includes('ultimate collector')) {
    if (price > 500) return 5.5; // Massive UCS (Falcon, Star Destroyer)
    if (price > 300) return 4.5;
    if (price > 200) return 4;
    return 3.5;
  }

  // Creator Expert with price tiers
  if (themeLower.includes('creator expert') || themeLower.includes('creator')) {
    if (price > 300) return 4.5; // Large flagship sets
    if (price > 200) return 4;
    if (price > 100) return 3.5;
    if (price > 0) return 2.5; // Small Creator sets
    return 3.5; // Unknown price, use default
  }

  // Architecture with price tiers
  if (themeLower.includes('architecture')) {
    if (price > 200) return 4;
    if (price > 100) return 3.5;
    return 3;
  }

  // Licensed themes with price tiers
  if (themeLower.includes('star wars') || themeLower.includes('marvel') ||
      themeLower.includes('dc') || themeLower.includes('harry potter')) {
    if (price > 400) return 4.5; // UCS or flagship
    if (price > 200) return 3;
    if (price > 100) return 2.5;
    return 2;
  }

  // Default price tiers for other themes
  if (price > 200) return 4;
  if (price > 100) return 3;
  if (price > 50) return 2.5;
  if (price > 0) return 1.5;

  // No price data - use theme default
  return getSetLifespanByThemeOnly(theme);
}

// Fallback: Theme-only lifespan (used when price not available)
function getSetLifespanByThemeOnly(theme: string): number {
  const themeLower = theme.toLowerCase();

  if (themeLower.includes('icons') || themeLower.includes('ucs')) return 4;
  if (themeLower.includes('creator expert') || themeLower.includes('architecture')) return 3.5;
  if (themeLower.includes('star wars') || themeLower.includes('marvel')) return 2;

  return 2.5;
}

// Calculate retirement score for a set
function calculateRetirementScore(set: LegoBox): {
  score: number;
  ageScore: number;
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;
} {
  const currentYear = new Date().getFullYear();
  const yearReleased = parseInt(set.year_released);
  const age = currentYear - yearReleased;
  const expectedLifespan = getSetLifespanByThemeOnly(set.category_name);
  const ageRatio = age / expectedLifespan;

  // Age component (0-100 points)
  let ageScore = Math.min(100, ageRatio * 100);

  // Don't show sets that are too old (likely already retired)
  if (age > expectedLifespan + 1) {
    ageScore = 0; // Filter out very old sets
  }

  // Don't show sets that are too new
  if (age < 1.5) {
    ageScore = 0; // Filter out very new sets
  }

  const score = ageScore;

  // Determine confidence level
  let confidence: 'low' | 'medium' | 'high';
  if (age >= expectedLifespan * 0.9) {
    confidence = 'high';
  } else if (age >= expectedLifespan * 0.7) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Generate reasoning
  const reasoning = age >= expectedLifespan
    ? `This set is ${age} years old, past the typical ${expectedLifespan}-year lifespan for ${set.category_name.split(' / ')[0]} sets.`
    : `This set is ${age} years old, approaching the typical ${expectedLifespan}-year lifespan for ${set.category_name.split(' / ')[0]} sets.`;

  return { score, ageScore, confidence, reasoning };
}

// Estimate retirement quarter based on age and expected lifespan
function estimateRetirementQuarter(yearReleased: string, theme: string): {
  quarter: string;
  date: Date;
} {
  const expectedLifespan = getSetLifespanByThemeOnly(theme);
  const year = parseInt(yearReleased);
  const estimatedRetirementYear = year + Math.ceil(expectedLifespan);

  // Assume Q4 retirement (most common)
  const quarter = `Q4 ${estimatedRetirementYear}`;
  const date = new Date(estimatedRetirementYear, 11, 31); // December 31

  return { quarter, date };
}

// Filter sets by timeline (0-3 months, 3-9 months, 9-18 months)
function filterByTimeline(
  predictions: RetirementPrediction[],
  timeline: string
): RetirementPrediction[] {
  if (timeline === 'all') return predictions;

  const now = new Date();
  const threeMonths = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const nineMonths = new Date(now.getTime() + 270 * 24 * 60 * 60 * 1000);
  const eighteenMonths = new Date(now.getTime() + 540 * 24 * 60 * 60 * 1000);

  return predictions.filter(p => {
    if (!p.estimatedRetirementDate) return false;

    switch (timeline) {
      case '0-3':
        return p.estimatedRetirementDate <= threeMonths;
      case '3-9':
        return p.estimatedRetirementDate > threeMonths &&
               p.estimatedRetirementDate <= nineMonths;
      case '9-18':
        return p.estimatedRetirementDate > nineMonths &&
               p.estimatedRetirementDate <= eighteenMonths;
      default:
        return true;
    }
  });
}

// Main function to get retiring soon sets
export async function getRetiringSoonSets(options: {
  theme?: string;
  timeline?: string;
  limit?: number;
  minScore?: number;
  includePriceTrends?: boolean;
}): Promise<RetirementPrediction[]> {
  const {
    theme,
    timeline = 'all',
    limit = 50,
    minScore = 50,
    includePriceTrends = true
  } = options;

  // Load all sets from catalog
  const allBoxes = loadAllBoxes();

  // Filter by theme if specified
  let boxes = theme && theme !== 'all'
    ? allBoxes.filter(b => {
        const parentTheme = b.category_name.split(' / ')[0].trim();
        return parentTheme.toLowerCase() === theme.toLowerCase();
      })
    : allBoxes;

  // Filter to valid sets
  boxes = boxes.filter(box => box.year_released && !isNaN(parseInt(box.year_released)));

  // Calculate base retirement predictions for all sets
  const now = new Date();

  // Calculate base scores (synchronous)
  const basePredictions = boxes.map(box => {
    const { score, ageScore, confidence, reasoning } = calculateRetirementScore(box);
    const { quarter, date } = estimateRetirementQuarter(box.year_released, box.category_name);

    return {
      boxNo: box.box_no,
      name: box.name,
      theme: box.category_name.split(' / ')[0].trim(),
      yearReleased: parseInt(box.year_released),
      imageUrl: box.image_url,
      baseScore: score,
      ageScore,
      baseConfidence: confidence,
      baseReasoning: reasoning,
      quarter,
      date,
      ageYears: new Date().getFullYear() - parseInt(box.year_released)
    };
  });

  // Filter by min score and date first to reduce DB queries
  const candidatePredictions = basePredictions.filter(p => {
    if (p.baseScore < minScore || p.baseScore === 0) return false;
    if (p.date && p.date < now) return false;
    return true;
  });

  // Limit candidates to reduce DB load (only analyze top 100 by age score)
  const topCandidates = candidatePredictions
    .sort((a, b) => b.baseScore - a.baseScore)
    .slice(0, 100);

  // Add price trend analysis + availability checking for top candidates (async)
  const predictions: RetirementPrediction[] = await Promise.all(
    topCandidates.map(async (pred) => {
      let priceScore = 0;
      let availabilityScore = 0;
      let priceIncrease: number | null = null;
      let confidence = pred.baseConfidence;
      let reasoning = pred.baseReasoning;

      // Get price-adjusted lifespan for more accurate scoring
      const priceAdjustedLifespan = await getSetLifespanByPriceAndTheme(pred.theme, pred.boxNo);
      const ageRatio = pred.ageYears / priceAdjustedLifespan;
      let adjustedAgeScore = Math.min(100, ageRatio * 100);

      // Don't show sets too old or too new
      if (pred.ageYears > priceAdjustedLifespan + 1 || pred.ageYears < 1.5) {
        adjustedAgeScore = 0;
      }

      if (includePriceTrends) {
        const priceTrend = await analyzePriceTrend(pred.boxNo);
        priceScore = priceTrend.priceScore;
        priceIncrease = priceTrend.priceIncrease;

        // Check BrickLink availability signals
        const availability = await checkBrickLinkAvailability(pred.boxNo);
        availabilityScore = availability.availabilityScore;

        // Boost confidence based on availability signals
        if (availability.isRetired) {
          confidence = 'high';
          reasoning += ` BrickLink signals indicate retirement (${availability.signal}).`;
        } else if (availability.signal === 'moderate_price_spike') {
          if (confidence === 'low') confidence = 'medium';
        }

        // Boost confidence if price is spiking
        if (priceTrend.signal === 'major_spike' || priceTrend.signal === 'significant_spike') {
          confidence = 'high';
          reasoning += ` Price has increased ${priceTrend.priceIncrease?.toFixed(0)}% in the last 90 days, indicating high demand and likely retirement.`;
        } else if (priceTrend.signal === 'moderate_increase') {
          if (confidence === 'low') confidence = 'medium';
          reasoning += ` Price trending up ${priceTrend.priceIncrease?.toFixed(0)}% recently.`;
        } else if (priceTrend.signal === 'price_dropping') {
          confidence = 'low';
          reasoning += ` Price has dropped ${Math.abs(priceTrend.priceIncrease || 0).toFixed(0)}%, suggesting set is still widely available.`;
        }
      }

      // Calculate final score (price-adjusted age + price trend + availability)
      const finalScore = Math.min(100, adjustedAgeScore + priceScore + availabilityScore);

      return {
        boxNo: pred.boxNo,
        name: pred.name,
        theme: pred.theme,
        yearReleased: pred.yearReleased,
        imageUrl: pred.imageUrl,
        availabilityStatus: (finalScore > 70 ? 'retiring_soon' : 'available') as 'available' | 'retiring_soon' | 'retired',
        retirementScore: finalScore,
        confidence,
        signals: {
          ageScore: pred.ageScore,
          priceScore,
          manualOverride: false
        },
        estimatedRetirementQuarter: pred.quarter,
        estimatedRetirementDate: pred.date,
        reasoning,
        ageYears: pred.ageYears,
        priceIncrease // Add for display
      } as RetirementPrediction & { priceIncrease?: number | null };
    })
  );

  // Sort by final score
  predictions.sort((a, b) => b.retirementScore - a.retirementScore);

  // Filter by timeline if specified
  const filteredPredictions = filterByTimeline(predictions, timeline);

  // Return top N
  return filteredPredictions.slice(0, limit);
}

// Get count of retiring sets by theme
export async function getRetiringCountByTheme(theme: string): Promise<number> {
  const predictions = await getRetiringSoonSets({ theme, minScore: 60 });
  return predictions.length;
}
