import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPayPalWebhook } from '@/lib/paypal';
import { getCurrentSeason } from '@/lib/donations';

/**
 * PayPal Webhooks API Handler (Modern approach)
 * Receives and processes donation notifications from PayPal
 *
 * Setup: https://developer.paypal.com/dashboard/
 * Subscribe to event: PAYMENT.CAPTURE.COMPLETED
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook payload
    const payload = await request.json();

    // Get PayPal headers for verification
    const headers = {
      'paypal-transmission-id': request.headers.get('paypal-transmission-id') || '',
      'paypal-transmission-time': request.headers.get('paypal-transmission-time') || '',
      'paypal-transmission-sig': request.headers.get('paypal-transmission-sig') || '',
      'paypal-cert-url': request.headers.get('paypal-cert-url') || '',
      'paypal-auth-algo': request.headers.get('paypal-auth-algo') || '',
    };

    // Verify webhook signature (optional but recommended for production)
    // For now, we'll skip verification in development
    // In production, uncomment this:
    // const isVerified = await verifyPayPalWebhook(payload, headers);
    // if (!isVerified) {
    //   console.error('[PayPal Webhook] Verification failed');
    //   return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 });
    // }

    // Log webhook event
    console.log('[PayPal Webhook] Event:', payload.event_type);

    // Handle different event types
    const eventType = payload.event_type;

    // We only care about completed payments
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = payload.resource;

      // Extract donation details
      const txnId = resource.id; // PayPal capture ID
      const amount = parseFloat(resource.amount?.value || '0');
      const currency = resource.amount?.currency_code || 'USD';

      // Extract payer info
      const payer = resource.payer || {};
      const payerEmail = payer.email_address || '';
      const payerName = payer.name
        ? `${payer.name.given_name || ''} ${payer.name.surname || ''}`.trim()
        : '';

      console.log('[PayPal Webhook] Payment captured:', {
        txnId,
        amount,
        currency,
        payerEmail,
      });

      // Check if donation already exists
      const existing = await prisma.donation.findUnique({
        where: { paypalTxnId: txnId },
      });

      if (existing) {
        console.log('[PayPal Webhook] Donation already exists:', txnId);
        return NextResponse.json({ success: true, message: 'Already recorded' });
      }

      // Calculate current season
      const season = getCurrentSeason();

      // Create donation record
      const donation = await prisma.donation.create({
        data: {
          paypalTxnId: txnId,
          amount,
          currency,
          donorEmail: payerEmail,
          donorName: payerName || null,
          season,
          status: 'completed',
        },
      });

      console.log('[PayPal Webhook] Donation recorded:', donation.id);

      return NextResponse.json({
        success: true,
        message: 'Donation recorded',
        donationId: donation.id,
      });
    }

    // Other event types - just acknowledge
    return NextResponse.json({ success: true, message: 'Event acknowledged' });

  } catch (error) {
    console.error('[PayPal Webhook] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
