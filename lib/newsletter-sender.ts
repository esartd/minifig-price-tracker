import { NewsletterCampaign, NewsletterSubscriber } from '@prisma/client';
import { Resend } from 'resend';
import { prisma } from './prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send newsletter campaign to all recipients
 * Uses batch processing to avoid rate limits
 */
export async function sendNewsletterCampaign(
  campaign: NewsletterCampaign,
  recipients: NewsletterSubscriber[]
) {
  const batchSize = 50; // Resend allows 50 emails per batch
  const batches = chunkArray(recipients, batchSize);

  let sentCount = 0;
  let bouncedCount = 0;

  for (const batch of batches) {
    try {
      // Prepare emails for batch
      const emails = batch.map(subscriber => ({
        from: process.env.EMAIL_FROM || 'FigTracker <hello@figtracker.ericksu.com>',
        to: subscriber.email,
        subject: campaign.subject,
        html: renderEmailTemplate(campaign.content, subscriber),
      }));

      // Development mode: Override recipient to avoid sending real emails
      if (process.env.NODE_ENV === 'development' && process.env.DEV_EMAIL_OVERRIDE) {
        console.log('📧 DEV MODE: Redirecting emails to', process.env.DEV_EMAIL_OVERRIDE);
        emails.forEach(email => {
          email.to = process.env.DEV_EMAIL_OVERRIDE!;
        });
      }

      // Send batch via Resend
      const result = await resend.batch.send(emails);

      sentCount += batch.length;

      // Update subscriber last email sent
      await Promise.all(
        batch.map(subscriber =>
          prisma.newsletterSubscriber.update({
            where: { id: subscriber.id },
            data: {
              lastEmailSent: new Date(),
              lastEmailType: campaign.type
            }
          })
        )
      );

      // Wait between batches to respect rate limits
      await sleep(1000); // 1 second delay

    } catch (error) {
      console.error(`Batch send error:`, error);
      bouncedCount += batch.length;
    }
  }

  // Update campaign final statistics
  await prisma.newsletterCampaign.update({
    where: { id: campaign.id },
    data: {
      status: 'sent',
      sentCount,
      bouncedCount
    }
  });

  console.log(`✅ Campaign sent: ${sentCount} emails, ${bouncedCount} bounced`);
}

/**
 * Render email template with subscriber-specific data
 */
function renderEmailTemplate(content: string, subscriber: NewsletterSubscriber): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const preferencesUrl = `${baseUrl}/newsletter/preferences?token=${subscriber.unsubscribeToken}`;
  const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;

  // Replace merge tags
  let html = content
    .replace(/{{email}}/g, subscriber.email)
    .replace(/{{preferencesUrl}}/g, preferencesUrl)
    .replace(/{{unsubscribeUrl}}/g, unsubscribeUrl);

  // Wrap in email layout with footer
  html = wrapEmailLayout(html, preferencesUrl, unsubscribeUrl);

  return html;
}

/**
 * Wrap content in standard email layout
 */
function wrapEmailLayout(content: string, preferencesUrl: string, unsubscribeUrl: string): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #171717;
        margin: 0;
        padding: 0;
        background-color: #fafafa;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      .card {
        background: #ffffff;
        border-radius: 12px;
        padding: 48px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e5e5e5;
        font-size: 14px;
        color: #737373;
        text-align: center;
      }
      .footer a {
        color: #3b82f6;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        ${content}
      </div>
      <div class="footer">
        <p>
          You're receiving this email because you subscribed to FigTracker updates.
        </p>
        <p>
          <a href="${unsubscribeUrl}">Unsubscribe</a> |
          <a href="${preferencesUrl}">Manage Preferences</a>
        </p>
        <p>
          © ${new Date().getFullYear()} FigTracker. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}

// Utility functions
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
