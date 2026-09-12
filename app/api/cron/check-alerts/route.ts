import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend, EMAIL_FROM } from '@/lib/email/resend-client';
import { PriceAlertEmail } from '@/lib/email/templates/price-alert';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Shared logic for checking alerts
async function checkAlerts(request: NextRequest) {
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
            subscriptionStatus: true,
          },
        },
      },
    });

    console.log(`[check-alerts] Found ${alerts.length} active alerts to check`);

    /**
     * Walmart prices for every set under alert, fetched once rather than per
     * alert. This is the Premium perk: the deals themselves are free and
     * public on /deals, but being TOLD the moment one of your sets drops past
     * your own threshold is what a subscription buys.
     *
     * Sets only -- WalmartDeal is keyed by box number and the Impact catalogue
     * matches boxed sets, not minifigures.
     */
    const PREMIUM_STATUSES = new Set(['active', 'trialing']);
    const premiumSetItemNos = alerts
      .filter(
        (a) =>
          a.item_type === 'SET' &&
          !!a.User.subscriptionStatus &&
          PREMIUM_STATUSES.has(a.User.subscriptionStatus)
      )
      .map((a) => a.item_no);

    const walmartByBoxNo = new Map<string, { currentPrice: number; productUrl: string }>();
    if (premiumSetItemNos.length > 0) {
      try {
        const rows = await prisma.walmartDeal.findMany({
          where: { boxNo: { in: Array.from(new Set(premiumSetItemNos)) }, inStock: true },
          select: { boxNo: true, currentPrice: true, productUrl: true },
        });
        for (const r of rows) {
          walmartByBoxNo.set(r.boxNo, { currentPrice: r.currentPrice, productUrl: r.productUrl });
        }
      } catch (error) {
        // Alerts still run on market prices alone. A failed Walmart read must
        // not stop every alert on the site from being checked.
        console.error('[check-alerts] Walmart lookup failed, continuing without it:', error);
      }
    }
    console.log(`[check-alerts] Walmart prices available for ${walmartByBoxNo.size} set(s)`);

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

        /**
         * Two possible sources now: our own market blend, and -- for Premium
         * subscribers on a set -- the current Walmart shelf price.
         *
         * The alert fires on whichever is LOWER, provided it clears the
         * target. A market price is deliberately no longer a precondition:
         * before, a set with no cached market price hit `continue` and a
         * Walmart drop on it could never have been noticed.
         */
        const isPremium =
          !!alert.User.subscriptionStatus &&
          PREMIUM_STATUSES.has(alert.User.subscriptionStatus);

        // Re-checked per alert, not taken from the map: the map is keyed by box
        // number, so a free user with an alert on the same set as a subscriber
        // would otherwise be handed the paid perk.
        const walmart =
          isPremium && alert.item_type === 'SET'
            ? walmartByBoxNo.get(alert.item_no)
            : undefined;

        const marketPrice =
          pricing && pricing.expires_at >= new Date() && pricing.current_lowest > 0
            ? pricing.current_lowest
            : null;
        const walmartPrice = walmart && walmart.currentPrice > 0 ? walmart.currentPrice : null;

        if (marketPrice === null && walmartPrice === null) {
          console.log(`[check-alerts] No valid pricing for ${alert.item_no}, skipping`);
          continue;
        }

        // Lowest price that actually clears the target decides both whether we
        // send and which retailer the email points at.
        const fromWalmart =
          walmartPrice !== null &&
          walmartPrice <= alert.target_price &&
          (marketPrice === null || walmartPrice <= marketPrice);

        const triggerPrice = fromWalmart ? walmartPrice! : marketPrice;

        if (triggerPrice !== null && triggerPrice <= alert.target_price) {
          console.log(
            `[check-alerts] ✅ Alert triggered for ${alert.item_no}: ${triggerPrice} <= ${alert.target_price}` +
              (fromWalmart ? ' (Walmart)' : ' (market)')
          );

          // Generate URLs
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';
          const itemUrl = alert.item_type === 'MINIFIG'
            ? `${baseUrl}/minifigs/${alert.item_no}`
            : `${baseUrl}/sets/${alert.item_no}`;

          const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(alert.item_name)}`;
          const bricklinkUrl = `https://www.bricklink.com/v2/catalog/catalogitem.page?${alert.item_type === 'MINIFIG' ? 'M' : 'S'}=${alert.item_no}`;
          const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(alert.item_name + ' lego')}`;
          const unsubscribeUrl = `${baseUrl}/account/alerts`;

          // Walmart's feed is the US store, priced in USD. The market blend
          // carries whatever currency it was cached in.
          const currencyCode = fromWalmart ? 'USD' : pricing?.currency_code || 'USD';

          // Send email using Resend
          await resend.emails.send({
            from: EMAIL_FROM,
            to: alert.User.email,
            subject: `🎯 Price Alert: ${alert.item_name} - Now ${currencyCode === 'USD' ? '$' : currencyCode}${triggerPrice.toFixed(2)}`,
            react: PriceAlertEmail({
              userName: alert.User.name || 'Collector',
              itemName: alert.item_name,
              itemNo: alert.item_no,
              itemType: alert.item_type as 'MINIFIG' | 'SET',
              condition: alert.condition as 'new' | 'used',
              targetPrice: alert.target_price,
              currentPrice: triggerPrice,
              currencyCode,
              itemUrl,
              ebayUrl,
              bricklinkUrl,
              amazonUrl,
              unsubscribeUrl,
              // Only when Walmart is the price being quoted -- otherwise the
              // email would advertise a Walmart price it did not fire on.
              walmartUrl: fromWalmart ? walmart!.productUrl : undefined,
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

// GET and POST both supported (for curl flexibility)
export async function GET(request: NextRequest) {
  return checkAlerts(request);
}

export async function POST(request: NextRequest) {
  return checkAlerts(request);
}
