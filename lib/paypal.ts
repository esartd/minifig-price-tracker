/**
 * PayPal Webhooks API verification (Modern approach)
 */

interface PayPalWebhookHeaders {
  'paypal-transmission-id': string;
  'paypal-transmission-time': string;
  'paypal-transmission-sig': string;
  'paypal-cert-url': string;
  'paypal-auth-algo': string;
}

/**
 * Verify PayPal webhook signature
 * Uses PayPal's Webhooks API verification endpoint
 *
 * @param payload - The webhook payload object
 * @param headers - PayPal webhook headers
 * @returns true if verified, false otherwise
 */
export async function verifyPayPalWebhook(
  payload: any,
  headers: PayPalWebhookHeaders
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    console.warn('[PayPal] PAYPAL_WEBHOOK_ID not configured, skipping verification');
    return true; // Skip verification in development
  }

  const verifyUrl = process.env.PAYPAL_MODE === 'live'
    ? 'https://api.paypal.com/v1/notifications/verify-webhook-signature'
    : 'https://api.sandbox.paypal.com/v1/notifications/verify-webhook-signature';

  try {
    // Get OAuth token first
    const authToken = await getPayPalAccessToken();

    if (!authToken) {
      console.error('[PayPal] Failed to get access token');
      return false;
    }

    // Verify webhook signature
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        transmission_id: headers['paypal-transmission-id'],
        transmission_time: headers['paypal-transmission-time'],
        cert_url: headers['paypal-cert-url'],
        auth_algo: headers['paypal-auth-algo'],
        transmission_sig: headers['paypal-transmission-sig'],
        webhook_id: webhookId,
        webhook_event: payload,
      }),
    });

    const result = await response.json();
    return result.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('[PayPal] Webhook verification error:', error);
    return false;
  }
}

/**
 * Get PayPal OAuth access token
 * Required for webhook verification
 */
async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[PayPal] Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET');
    return null;
  }

  const authUrl = process.env.PAYPAL_MODE === 'live'
    ? 'https://api.paypal.com/v1/oauth2/token'
    : 'https://api.sandbox.paypal.com/v1/oauth2/token';

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('[PayPal] OAuth token error:', error);
    return null;
  }
}
