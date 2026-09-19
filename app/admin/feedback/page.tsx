import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { isAdminEmail } from '@/lib/admin-auth';
import { rankFeedback, type FeedbackRow } from '@/lib/feedback-ranking';
import FeedbackQueueClient from './feedback-client';

// Same gate as the other admin pages: there is no admin layout and no
// middleware rule, so every page does this for itself.

export const dynamic = 'force-dynamic';

export default async function AdminFeedbackPage() {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    redirect('/');
  }

  const rows = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    // Enough to hold every report this site will see for a long while, and a
    // ceiling so the page cannot be made unloadable by a spam run that got
    // past the Turnstile check.
    take: 500,
    include: { User: { select: { name: true, email: true } } },
  });

  const clusters = rankFeedback(rows as unknown as FeedbackRow[]);

  // Names for display. Kept separate from the ranking input so the ranking
  // library stays free of Prisma types and can be reused by the export script.
  const reporters: Record<string, string> = {};
  for (const row of rows) {
    if (row.User?.name) reporters[row.id] = row.User.name;
    else if (row.User?.email) reporters[row.id] = row.User.email;
    else if (row.email) reporters[row.id] = row.email;
  }

  const open = clusters.filter((c) => c.status === 'new' || c.status === 'in_progress').length;
  const unread = rows.filter((r) => !r.readAt).length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <a
        href="/admin/stats"
        style={{
          display: 'inline-block',
          fontSize: '14px',
          color: '#737373',
          textDecoration: 'none',
          marginBottom: '16px',
        }}
      >
        &larr; Admin dashboard
      </a>

      <h1
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#171717',
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        Feedback
      </h1>
      <p style={{ fontSize: '15px', color: '#525252', margin: '0 0 32px', lineHeight: 1.6 }}>
        {rows.length === 0
          ? 'Nothing yet. The widget is on every page, bottom left.'
          : `${rows.length} report${rows.length === 1 ? '' : 's'}, ${open} still open, ${unread} unread. In-progress items stay pinned to the top.`}
      </p>

      <FeedbackQueueClient clusters={clusters} reporters={reporters} />
    </div>
  );
}
