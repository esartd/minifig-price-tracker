/**
 * One-off: copy registered users into a Resend Audience so the IntoBrick
 * rename can go out as a Broadcast.
 *
 * Why a Broadcast rather than a loop over resend.emails.send(): the User model
 * has no unsubscribe field, so a hand-rolled bulk send would give recipients
 * no way out. Resend Broadcasts attach an unsubscribe link and keep the
 * opt-out list themselves, which is both the polite answer and the one that
 * keeps a brand-new sending domain out of spam folders.
 *
 * Run ON THE SERVER, where DATABASE_URL and RESEND_API_KEY already exist:
 *
 *   cd /var/www/figtracker
 *   set -a && . ./.env.production && . ./.env && set +a
 *   node scripts/sync-users-to-resend-audience.mjs
 *
 * Safe to re-run: Resend treats a repeat contact as an update, and this only
 * ever creates or updates. It never sends anything -- you compose and send the
 * Broadcast yourself in the Resend dashboard.
 */

import { PrismaClient } from '@prisma/client';

const AUDIENCE_NAME = 'IntoBrick users';
const API = 'https://api.resend.com';

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('RESEND_API_KEY is not set. Source .env.production first.');
  process.exit(1);
}

async function resend(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${options.method || 'GET'} ${path} -> ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

async function findOrCreateAudience() {
  const { data } = await resend('/audiences');
  const existing = (data || []).find((a) => a.name === AUDIENCE_NAME);
  if (existing) {
    console.log(`Reusing audience "${AUDIENCE_NAME}" (${existing.id})`);
    return existing.id;
  }
  const created = await resend('/audiences', {
    method: 'POST',
    body: JSON.stringify({ name: AUDIENCE_NAME }),
  });
  console.log(`Created audience "${AUDIENCE_NAME}" (${created.id})`);
  return created.id;
}

const prisma = new PrismaClient();

try {
  const audienceId = await findOrCreateAudience();

  const users = await prisma.user.findMany({
    select: { email: true, name: true },
    where: { email: { not: '' } },
  });
  console.log(`${users.length} users to sync`);

  let added = 0;
  let failed = 0;

  for (const user of users) {
    // Resend wants first/last separately. Most names here are a single word,
    // so anything after the first space becomes the last name and a
    // one-word name simply has no last name -- better than guessing.
    const [firstName, ...rest] = (user.name || '').trim().split(/\s+/);

    try {
      await resend(`/audiences/${audienceId}/contacts`, {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          first_name: firstName || undefined,
          last_name: rest.length ? rest.join(' ') : undefined,
          unsubscribed: false,
        }),
      });
      added++;
    } catch (error) {
      failed++;
      // Log the failure without the address -- the whole point of this script
      // is that nobody has to eyeball 64 email addresses.
      console.error(`  contact failed: ${String(error.message).slice(0, 120)}`);
    }
  }

  console.log(`\nDone. ${added} synced, ${failed} failed.`);
  console.log(`Audience ID: ${audienceId}`);
  console.log('\nNext: Resend dashboard -> Broadcasts -> create one against this');
  console.log('audience, paste the email body, send yourself a test, then send.');
} finally {
  await prisma.$disconnect();
}
