import { resend, EMAIL_FROM } from '../lib/email/resend-client';
import { PriceAlertEmail } from '../lib/email/templates/price-alert';

async function sendTestEmail() {
  console.log('Sending test price alert email...');

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: 'erickkosysu@gmail.com',
      subject: '🎯 Price Alert: Captain Rex - Now $89.99 (TEST EMAIL)',
      react: PriceAlertEmail({
        userName: 'Erick',
        itemName: 'Captain Rex - Phase 2 with Pauldron',
        itemNo: 'sw0274',
        itemType: 'MINIFIG',
        condition: 'new',
        targetPrice: 120.00,
        currentPrice: 89.99,
        currencyCode: 'USD',
        itemUrl: 'https://figtracker.ericksu.com/minifigs/sw0274',
        ebayUrl: 'https://www.ebay.com/sch/i.html?_nkw=Captain+Rex+LEGO+Minifigure',
        bricklinkUrl: 'https://www.bricklink.com/v2/catalog/catalogitem.page?M=sw0274',
        amazonUrl: 'https://www.amazon.com/s?k=Captain+Rex+lego',
        unsubscribeUrl: 'https://figtracker.ericksu.com/account/alerts',
      }),
    });

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', result.data?.id);
    console.log('Check your inbox at erickkosysu@gmail.com');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendTestEmail();
