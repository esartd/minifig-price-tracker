/**
 * Dump every feedback row, already grouped and ranked, so it can be read and
 * audited in a Claude Code session.
 *
 * `ANTHROPIC_API_KEY` is empty, so there is no model to call from the server
 * to summarise the queue. There does not need to be: the ranking in
 * lib/feedback-ranking.ts runs on every page load for free, and when a real
 * judgement call is wanted -- "what should I actually work on next?" -- the
 * assistant already in the session reads this output and answers. That is
 * strictly better than an API summary nobody reads, and costs nothing.
 *
 * Same ranking the admin page uses, deliberately: if this and /admin/feedback
 * disagreed about the top item, neither could be trusted.
 *
 *   npx tsx --env-file=.env.local scripts/export-feedback.ts            # text
 *   npx tsx --env-file=.env.local scripts/export-feedback.ts --json     # machine-readable
 *   npx tsx --env-file=.env.local scripts/export-feedback.ts --open     # hide done/declined
 */

import { PrismaClient } from '@prisma/client';
import { rankFeedback, type FeedbackRow } from '../lib/feedback-ranking';

const prisma = new PrismaClient();
const AS_JSON = process.argv.includes('--json');
const OPEN_ONLY = process.argv.includes('--open');

const STATUS_LABEL: Record<string, string> = {
  new: 'NEW',
  in_progress: 'WORKING ON IT',
  done: 'done',
  declined: "won't do",
};

async function main() {
  const rows = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    include: { User: { select: { name: true, email: true } } },
  });

  const filtered = OPEN_ONLY
    ? rows.filter((r) => r.status === 'new' || r.status === 'in_progress')
    : rows;

  const clusters = rankFeedback(filtered as unknown as FeedbackRow[]);

  if (AS_JSON) {
    console.log(
      JSON.stringify(
        clusters.map((c) => ({
          status: c.status,
          score: c.score,
          reports: c.reports,
          signedInReports: c.signedInReports,
          unread: c.unread,
          groupedOn: c.tokens,
          items: c.items.map((i) => {
            const user = rows.find((r) => r.id === i.id)?.User;
            return {
              id: i.id,
              type: i.type,
              message: i.message,
              from: user?.name || user?.email || i.email || null,
              signedIn: !!i.userId,
              pageUrl: i.pageUrl,
              locale: i.locale,
              createdAt: i.createdAt.toISOString(),
              status: i.status,
            };
          }),
        })),
        null,
        2
      )
    );
    await prisma.$disconnect();
    return;
  }

  if (clusters.length === 0) {
    console.log(OPEN_ONLY ? '\nNothing open.\n' : '\nNo feedback yet.\n');
    await prisma.$disconnect();
    return;
  }

  const unread = filtered.filter((r) => !r.readAt).length;
  console.log(
    `\n${filtered.length} report${filtered.length === 1 ? '' : 's'} in ` +
      `${clusters.length} group${clusters.length === 1 ? '' : 's'}, ${unread} unread.\n` +
      `Ranked: in-progress pinned first, then priority score.\n`
  );

  clusters.forEach((c, i) => {
    const user = rows.find((r) => r.id === c.latest.id)?.User;
    const from = user?.name || user?.email || c.latest.email || 'anonymous';

    console.log(`${'─'.repeat(72)}`);
    console.log(
      `${i + 1}. [${STATUS_LABEL[c.status] ?? c.status}] ${c.latest.type} · priority ${c.score}` +
        (c.reports > 1 ? ` · reported ${c.reports}×` : '') +
        (c.unread > 0 ? ` · ${c.unread} unread` : '')
    );
    console.log(`   ${from} · ${c.latest.createdAt.toISOString().slice(0, 16).replace('T', ' ')}`);
    if (c.latest.pageUrl) console.log(`   ${c.latest.pageUrl}`);
    console.log();
    console.log(
      c.latest.message
        .split('\n')
        .map((l) => '   ' + l)
        .join('\n')
    );

    if (c.reports > 1) {
      console.log(`\n   -- also reported as (grouped on: ${c.tokens.join(', ')}) --`);
      for (const item of c.items.slice(1)) {
        console.log(`   · ${item.message.replace(/\s+/g, ' ').slice(0, 160)}`);
      }
    }
    console.log();
  });

  console.log('─'.repeat(72));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
