import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { originFor } from '@/lib/site-domain';

/**
 * Sends an announcement to subscribed users.
 *
 * Sends one message per recipient rather than one message with everyone in
 * BCC. That costs more API calls but is the only way to give each person their
 * own unsubscribe link — and a shared BCC blast is what makes mail providers
 * treat you as bulk. The admin page's mailto: shortcut has the opposite
 * problem: 64 addresses URL-encoded overflows what mail clients accept, and
 * the overflow is silent.
 */

const ADMIN_EMAIL = 'erickkosysu@gmail.com';

// Resend's free tier allows 2 requests/second. Anything faster gets 429s and
// a partially-sent announcement, which is worse than a slow one.
const DELAY_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Turns the admin's plain text into paragraphs. Never trust it as markup. */
function renderBody(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map(
      (para) =>
        `<p style="font-size:16px;line-height:1.6;color:#171717;margin:0 0 20px">${escapeHtml(
          para
        ).replace(/\n/g, '<br>')}</p>`
    )
    .join('');
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not configured' }, { status: 500 });
  }

  const { subject, body, testOnly } = await request.json();

  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Subject and message are both required' }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || 'IntoBrick <hello@intobrick.com>';
  const origin = originFor('en');

  // testOnly sends to the admin alone. Always do this first from a domain with
  // no sending history -- the first real blast is not the moment to discover
  // the template renders badly or lands in Promotions.
  const recipients = testOnly
    ? await prisma.user.findMany({
        where: { email: ADMIN_EMAIL },
        select: { id: true, email: true, unsubscribeToken: true },
      })
    : await prisma.user.findMany({
        where: { emailSubscribed: true },
        select: { id: true, email: true, unsubscribeToken: true },
      });

  if (recipients.length === 0) {
    return NextResponse.json({ error: 'No subscribed recipients' }, { status: 400 });
  }

  const html = renderBody(body);
  let sent = 0;
  const failures: string[] = [];

  for (const user of recipients) {
    // Tokens are minted on first send rather than at signup, so existing rows
    // do not need a backfill.
    let token = user.unsubscribeToken;
    if (!token) {
      token = crypto.randomBytes(24).toString('hex');
      await prisma.user.update({ where: { id: user.id }, data: { unsubscribeToken: token } });
    }
    const unsubscribeUrl = `${origin}/unsubscribe?token=${token}`;

    try {
      await resend.emails.send({
        from,
        to: user.email,
        subject: subject.trim(),
        // List-Unsubscribe lets Gmail and Outlook show their own native
        // unsubscribe button. People use that button instead of the spam
        // button, which is the entire point.
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
  ${html}
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0 16px">
  <p style="font-size:12px;color:#a3a3a3;line-height:1.6;margin:0">
    You are receiving this because you have an IntoBrick account.
    <a href="${unsubscribeUrl}" style="color:#737373">Unsubscribe from announcements</a>.
    Emails about your own account will still be sent.
  </p>
</div>`,
      });
      sent++;
    } catch (error) {
      failures.push(String((error as Error).message).slice(0, 120));
    }

    if (recipients.length > 1) await sleep(DELAY_MS);
  }

  return NextResponse.json({
    sent,
    total: recipients.length,
    failed: failures.length,
    testOnly: Boolean(testOnly),
    errors: failures.slice(0, 5),
  });
}
