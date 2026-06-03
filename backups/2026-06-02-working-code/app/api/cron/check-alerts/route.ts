import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend, EMAIL_FROM } from '@/lib/email/resend-client';
import { PriceAlertEmail } from '@/lib/email/templates/price-alert';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Check all active alerts and send emails if triggered
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[check-alerts] Starting price alert check...');

    // Get all active alerts
    const alerts = await prisma.priceAlert.findMany({
      where: {
        active: true,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredCurrency: true,
            preferredCountryCode: true,
          },
        },
      },
    });

    console.log(`[check-alerts] Found ${alerts.length} active alerts to check`);

    let triggeredCount = 0;
    let errorCount = 0;

    // Check each alert against current pricing
    for (const alert of alerts) {
      try {
        // Get current price from priceCache
        const pricing = await prisma.priceCache.findUnique({
          where: {
            item_no_item_type_condition_country_code_region: {
              item_no: alert.item_no,
              item_type: alert.item_type,
              condition: alert.condition,
              country_code: alert.User.preferredCountryCode || 'US',
              region: '',
            },
          },
        });

        // Update last_checked timestamp
        await prisma.priceAlert.update({
          where: { id: alert.id },
          data: { last_checked: new Date() },
        });

        // Skip if no pricing data or expired
        if (!pricing || pricing.expires_at < new Date()) {
          console.log(`[check-alerts] No valid pricing for ${alert.item_no}, skipping`);
          continue;
        }

        // Skip if price is $0 (unavailable)
        if (pricing.current_lowest <= 0) {
          console.log(`[check-alerts] Price unavailable for ${alert.item_no}, skipping`);
          continue;
        }

        // Check if current lowest price is at or below target
        if (pricing.current_lowest <= alert.target_price) {
          console.log(`[check-alerts] ✅ Alert triggered for ${alert.item_no}: ${pricing.current_lowest} <= ${alert.target_price}`);

          // Generate URLs
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';
          const itemUrl = alert.item_type === 'MINIFIG'
            ? `${baseUrl}/minifigs/${alert.item_no}`
            : `${baseUrl}/sets/${alert.item_no}`;

          const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(alert.item_name)}`;
          const bricklinkUrl = `https://www.bricklink.com/v2/catalog/catalogitem.page?${alert.item_type === 'MINIFIG' ? 'M' : 'S'}=${alert.item_no}`;
          const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(alert.item_name + ' lego')}`;
          const unsubscribeUrl = `${baseUrl}/account/alerts`;

          // Send email using Resend
          await resend.emails.send({
            from: EMAIL_FROM,
            to: alert.User.email,
            subject: `🎯 Price Alert: ${alert.item_name} - Now ${pricing.currency_code === 'USD' ? '$' : pricing.currency_code}${pricing.current_lowest.toFixed(2)}`,
            react: PriceAlertEmail({
              userName: alert.User.name || 'Collector',
              itemName: alert.item_name,
              itemNo: alert.item_no,
              itemType: alert.item_type as 'MINIFIG' | 'SET',
              condition: alert.condition as 'new' | 'used',
              targetPrice: alert.target_price,
              currentPrice: pricing.current_lowest,
              currencyCode: pricing.currency_code,
              itemUrl,
              ebayUrl,
              bricklinkUrl,
              amazonUrl,
              unsubscribeUrl,
            }),
          });

          // Mark alert as triggered and deactivate
          await prisma.priceAlert.update({
            where: { id: alert.id },
            data: {
              triggered_at: new Date(),
              active: false,
            },
          });

          triggeredCount++;
          console.log(`[check-alerts] Email sent to ${alert.User.email} for ${alert.item_no}`);
        }
      } catch (error) {
        console.error(`[check-alerts] Error processing alert ${alert.id}:`, error);
        errorCount++;
      }
    }

    console.log(`[check-alerts] Completed: ${triggeredCount} triggered, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      checked: alerts.length,
      triggered: triggeredCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error('[check-alerts] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check alerts' },
      { status: 500 }
    );
  }
}
