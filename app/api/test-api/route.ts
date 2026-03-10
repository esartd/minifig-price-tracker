import { NextResponse } from 'next/server';
import crypto from 'crypto';

function encodeRFC3986(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

export async function GET() {
  try {
    const consumerKey = process.env.BRICKLINK_CONSUMER_KEY || '';
    const consumerSecret = process.env.BRICKLINK_CONSUMER_SECRET || '';
    const tokenValue = process.env.BRICKLINK_TOKEN_VALUE || '';
    const tokenSecret = process.env.BRICKLINK_TOKEN_SECRET || '';

    const url = 'https://api.bricklink.com/api/store/v1/items/MINIFIG/sw0001a';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');

    const oauthParams: Record<string, string> = {
      oauth_consumer_key: consumerKey,
      oauth_token: tokenValue,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: '1.0',
    };

    // Create signature
    const sortedParams = Object.keys(oauthParams)
      .sort()
      .map((key) => `${encodeRFC3986(key)}=${encodeRFC3986(oauthParams[key])}`)
      .join('&');

    const signatureBaseString = [
      'GET',
      encodeRFC3986(url),
      encodeRFC3986(sortedParams),
    ].join('&');

    const signingKey = `${encodeRFC3986(consumerSecret)}&${encodeRFC3986(tokenSecret)}`;
    const hmac = crypto.createHmac('sha1', signingKey);
    hmac.update(signatureBaseString);
    const signature = hmac.digest('base64');

    oauthParams.oauth_signature = signature;

    const authHeader =
      'OAuth ' +
      Object.keys(oauthParams)
        .map((key) => `${key}="${encodeRFC3986(oauthParams[key])}"`)
        .join(', ');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      credentialsSet: {
        consumerKey: !!consumerKey,
        consumerSecret: !!consumerSecret,
        tokenValue: !!tokenValue,
        tokenSecret: !!tokenSecret,
      },
      response: responseData,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
