import { clusterTokens, similar } from '@/lib/feedback-cluster';

/**
 * Turn a flat list of feedback rows into a ranked queue.
 *
 * Shared by /admin/feedback and scripts/export-feedback.ts so the page and the
 * export agree on what "top priority" means. Computed on read rather than
 * stored in a column: it is cheap over a few hundred rows, and a stored score
 * goes stale the moment a duplicate arrives or a week passes.
 */

export type FeedbackStatus = 'new' | 'in_progress' | 'done' | 'declined';

export interface FeedbackRow {
  id: string;
  type: string;
  message: string;
  email: string | null;
  userId: string | null;
  pageUrl: string | null;
  userAgent?: string | null;
  locale: string | null;
  status: string;
  clusterId: string | null;
  createdAt: Date;
  readAt: Date | null;
}

export interface FeedbackCluster {
  key: string;
  items: FeedbackRow[];
  /** The most recent item — what the admin page shows as the headline. */
  latest: FeedbackRow;
  reports: number;
  signedInReports: number;
  unread: number;
  /** The strongest status in the group; drives pinning. */
  status: FeedbackStatus;
  score: number;
  /** Why these were grouped. An opaque hash is impossible to argue with. */
  tokens: string[];
}

const STATUS_RANK: Record<string, number> = {
  in_progress: 4,
  new: 3,
  done: 2,
  declined: 1,
};

/**
 * How recent counts as recent. Seven days, matching the "recency bonus" in the
 * plan — long enough that a report filed last weekend still ranks, short
 * enough that a month-old item stops crowding out this week's.
 */
const RECENT_DAYS = 7;

export function scoreCluster(items: FeedbackRow[], now: number): number {
  const reports = items.length;
  const signedIn = items.filter((i) => i.userId).length;
  const isBug = items.some((i) => i.type === 'bug');
  const newest = Math.max(...items.map((i) => i.createdAt.getTime()));
  const ageDays = (now - newest) / (1000 * 60 * 60 * 24);

  // A report from a real account is a stronger signal than an anonymous one:
  // they have something invested, and we can actually reply.
  let score = reports * 3 + signedIn * 2;
  if (ageDays <= RECENT_DAYS) score += 2;
  if (isBug) score += 2;

  return score;
}

/**
 * Group, score and sort.
 *
 * In-progress clusters pin to the top as a SORT rule, not a score bonus. That
 * is the "don't let what I'm working on move away from me" requirement, and
 * keeping it out of the score means starting work on something never changes
 * what it was actually worth.
 *
 * Done and declined sink below everything else for the same reason, in
 * reverse: they are kept for the record, not for the queue.
 */
export function rankFeedback(rows: FeedbackRow[], now = Date.now()): FeedbackCluster[] {
  // Newest first, so the representative each group is compared against — and
  // the headline the admin page shows — is the most recent report.
  const ordered = [...rows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Greedy agglomeration on token overlap rather than a plain group-by on the
  // stored clusterId. The hash catches only identical token sets, which in
  // testing split three reports of the same wrong price into two groups over a
  // single differing word. Two passes, cheapest first:
  //
  //   1. an exact clusterId match is accepted outright — it is what the hash
  //      is for, and it is free;
  //   2. otherwise compare tokens against each existing group's representative.
  //
  // O(n²) in the number of GROUPS, over sets of at most six short strings, on
  // a page capped at 500 rows. Immeasurable at any volume this site will see.
  const groups: { key: string; tokens: string[]; clusterId: string | null; items: FeedbackRow[] }[] = [];

  for (const row of ordered) {
    const tokens = clusterTokens(row.message);

    const match = groups.find(
      (g) =>
        (row.clusterId !== null && g.clusterId === row.clusterId) ||
        similar(tokens, g.tokens)
    );

    if (match) {
      match.items.push(row);
    } else {
      groups.push({
        // The first (newest) row's id names the group. Stable for a given set
        // of rows, and unique without a counter.
        key: `g:${row.id}`,
        tokens,
        clusterId: row.clusterId,
        items: [row],
      });
    }
  }

  const clusters: FeedbackCluster[] = [];

  for (const { key, tokens, items } of groups) {

    let status: FeedbackStatus = 'new';
    let best = 0;
    for (const item of items) {
      const rank = STATUS_RANK[item.status] ?? 0;
      if (rank > best) {
        best = rank;
        status = item.status as FeedbackStatus;
      }
    }

    clusters.push({
      key,
      items,
      latest: items[0],
      reports: items.length,
      signedInReports: items.filter((i) => i.userId).length,
      unread: items.filter((i) => !i.readAt).length,
      status,
      score: scoreCluster(items, now),
      tokens,
    });
  }

  const PIN: Record<FeedbackStatus, number> = {
    in_progress: 0,
    new: 1,
    done: 2,
    declined: 3,
  };

  clusters.sort((a, b) => {
    const pin = PIN[a.status] - PIN[b.status];
    if (pin !== 0) return pin;
    if (b.score !== a.score) return b.score - a.score;
    return b.latest.createdAt.getTime() - a.latest.createdAt.getTime();
  });

  return clusters;
}
