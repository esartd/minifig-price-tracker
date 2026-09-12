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
          },
        },
      },
    });

    console.log(`[check-alerts] Found ${alerts.length} active alerts to check`);

    /**
     * Walmart shelf prices for every set under a `walmart` alert, in one
     * query rather than one per alert.
     *
     * An alert checks ONLY its own source. A "market" alert has always meant
     * our blended price and still does, for free and paying users alike; a
     * "walmart" alert is the Premium one and watches the shelf price. The API
     * is what refuses to create a walmart alert without a subscription -- by
     * the time a row exists, it is legitimate and simply gets checked.
     */
    const walmartBoxNos = alerts
      .filter((a) => a.source === 'walmart' && a.item_type === 'SET')
      .map((a) => a.item_no);

    const walmartByBoxNo = new Map<string, { currentPrice: number; productUrl: string }>();
    if (walmartBoxNos.length > 0) {
      try {
        const rows = await prisma.walmartDeal.findMany({
          where: { boxNo: { in: Array.from(new Set(walmartBoxNos)) }, inStock: true },
          select: { boxNo: true, currentPrice: true, productUrl: true },
        });
        for (const r of rows) {
          walmartByBoxNo.set(r.boxNo, { currentPrice: r.currentPrice, productUrl: r.productUrl });
        }
      } catch (error) {
        // Market alerts must still be checked. A bad Walmart read is not a
        // reason to stop emailing everyone else.
        console.error('[check-alerts] Walmart lookup failed, continuing without it:', error);
      }
    }
    console.log(`[check-alerts] Walmart prices for ${walmartByBoxNo.size} of ${new Set(walmartBoxNos).size} watched set(s)`);

    let triggeredCount = 0;
    let errorCount = 0;

    /**
     * Alerts that fired, keyed by user + item, so that someone holding BOTH a
     * market and a Walmart alert on one set receives ONE email naming both
     * prices rather than two emails minutes apart about the same box.
     */
    type Fired = {
      alert: (typeof alerts)[number];
      price: number;
      source: string;
      currencyCode: string;
      walmartUrl?: string;
    };
    const firedByItem = new Map<string, Fired[]>();

    // Check each alert against the price its own source names
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
         * Resolve the one price this alert is about. A market alert never
         * looks at Walmart and a Walmart alert never looks at the blend --
         * two people with the same target on the same set should be able to
         * predict, from the alert they chose, what will set it off.
         */
        let currentPrice: number | null = null;
        let currencyCode = 'USD';
        let walmartUrl: string | undefined;

        if (alert.source === 'walmart') {
          const deal = walmartByBoxNo.get(alert.item_no);
          if (deal && deal.currentPrice > 0) {
            currentPrice = deal.currentPrice;
            // Walmart's feed is the US store and is priced in USD.
            currencyCode = 'USD';
            walmartUrl = deal.productUrl;
          }
        } else if (pricing && pricing.expires_at >= new Date() && pricing.current_lowest > 0) {
          currentPrice = pricing.current_lowest;
          currencyCode = pricing.currency_code;
        }

        if (currentPrice === null) {
          console.log(`[check-alerts] No valid ${alert.source} price for ${alert.item_no}, skipping`);
          continue;
        }

        if (currentPrice <= alert.target_price) {
          console.log(
            `[check-alerts] ✅ ${alert.source} alert triggered for ${alert.item_no}: ${currentPrice} <= ${alert.target_price}`
          );
          // Collected, not sent: the email goes out after the loop so that two
          // alerts on the same set become one message.
          const key = `${alert.userId}::${alert.item_type}::${alert.item_no}`;
          const group = firedByItem.get(key) || [];
          group.push({ alert, price: currentPrice, source: alert.source, currencyCode, walmartUrl });
          firedByItem.set(key, group);
        }
      } catch (error) {
        console.error(`[check-alerts] Error processing alert ${alert.id}:`, error);
        errorCount++;
      }
    }

    // One email per user per item, however many of their alerts on it fired.
    for (const group of firedByItem.values()) {
      try {
        // The lower price leads the email; if both fired, the other is named
        // alongside it rather than sent separately.
        group.sort((a, b) => a.price - b.price);
        const lead = group[0];
        const alert = lead.alert;
        const other = group.find((g) => g.source !== lead.source);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://figtracker.ericksu.com';
        const itemUrl = alert.item_type === 'MINIFIG'
          ? `${baseUrl}/minifigs/${alert.item_no}`
          : `${baseUrl}/sets/${alert.item_no}`;

        const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(alert.item_name)}`;
        const bricklinkUrl = `https://www.bricklink.com/v2/catalog/catalogitem.page?${alert.item_type === 'MINIFIG' ? 'M' : 'S'}=${alert.item_no}`;
        const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(alert.item_name + ' lego')}`;
        const unsubscribeUrl = `${baseUrl}/account/alerts`;

        const symbol = lead.currencyCode === 'USD' ? '$' : lead.currencyCode;

        await resend.emails.send({
          from: EMAIL_FROM,
          to: alert.User.email,
          subject: `🎯 Price Alert: ${alert.item_name} - Now ${symbol}${lead.price.toFixed(2)}`,
          react: PriceAlertEmail({
            userName: alert.User.name || 'Collector',
            itemName: alert.item_name,
            itemNo: alert.item_no,
            itemType: alert.item_type as 'MINIFIG' | 'SET',
            condition: alert.condition as 'new' | 'used',
            targetPrice: alert.target_price,
            currentPrice: lead.price,
            currencyCode: lead.currencyCode,
            itemUrl,
            ebayUrl,
            bricklinkUrl,
            amazonUrl,
            unsubscribeUrl,
            priceSource: lead.source as 'market' | 'walmart',
            // Present whenever EITHER alert in this group was the Walmart one,
            // so a combined email can still link the Walmart listing even when
            // the market price happened to be the lower of the two.
            walmartUrl: lead.walmartUrl || other?.walmartUrl,
            otherPrice: other ? { source: other.source as 'market' | 'walmart', price: other.price } : undefined,
          }),
        });

        // Every alert in the group is spent, not just the one that led.
        await prisma.priceAlert.updateMany({
          where: { id: { in: group.map((g) => g.alert.id) } },
          data: { triggered_at: new Date(), active: false },
        });

        triggeredCount += group.length;
        console.log(
          `[check-alerts] Email sent to ${alert.User.email} for ${alert.item_no} (${group.length} alert(s))`
        );
      } catch (error) {
        console.error('[check-alerts] Error sending grouped alert email:', error);
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
