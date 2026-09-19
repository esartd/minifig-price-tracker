'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FeedbackCluster, FeedbackStatus } from '@/lib/feedback-ranking';

/**
 * The triage queue.
 *
 * A status set here applies to every report in the cluster, because the
 * clusters ARE the unit of work -- three people reporting one broken page is
 * one thing to fix, not three.
 */

const STATUSES: { value: FeedbackStatus; label: string; color: string; bg: string }[] = [
  { value: 'new', label: 'New', color: '#1d4ed8', bg: '#eff6ff' },
  { value: 'in_progress', label: 'Working on it', color: '#b45309', bg: '#fffbeb' },
  { value: 'done', label: 'Done', color: '#15803d', bg: '#f0fdf4' },
  { value: 'declined', label: "Won't do", color: '#525252', bg: '#f5f5f5' },
];

const TYPE_LABEL: Record<string, string> = {
  bug: 'Bug',
  feature: 'Feature request',
  other: 'Other',
};

function when(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function FeedbackQueueClient({
  clusters,
  reporters,
}: {
  clusters: FeedbackCluster[];
  reporters: Record<string, string>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const setStatus = async (cluster: FeedbackCluster, status: FeedbackStatus) => {
    setBusy(cluster.key);
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: cluster.items.map((i) => i.id), status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (clusters.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {clusters.map((cluster) => {
        const current = STATUSES.find((s) => s.value === cluster.status) ?? STATUSES[0];
        const faded = cluster.status === 'done' || cluster.status === 'declined';
        const isOpen = expanded.has(cluster.key);

        return (
          <div
            key={cluster.key}
            style={{
              border: `1px solid ${cluster.status === 'in_progress' ? '#fcd34d' : '#e5e5e5'}`,
              borderRadius: '12px',
              padding: '20px',
              background: '#ffffff',
              opacity: faded ? 0.6 : 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: current.color,
                  background: current.bg,
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}
              >
                {current.label}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#404040' }}>
                {TYPE_LABEL[cluster.latest.type] ?? cluster.latest.type}
              </span>
              {cluster.reports > 1 && (
                <span style={{ fontSize: '13px', color: '#b45309', fontWeight: 600 }}>
                  reported {cluster.reports}&times;
                </span>
              )}
              {cluster.unread > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: '#dc2626',
                    padding: '2px 7px',
                    borderRadius: '999px',
                  }}
                >
                  {cluster.unread} unread
                </span>
              )}
              <span style={{ fontSize: '12px', color: '#a3a3a3', marginLeft: 'auto' }}>
                priority {cluster.score}
              </span>
            </div>

            <p
              style={{
                fontSize: '15px',
                color: '#171717',
                lineHeight: 1.6,
                margin: '0 0 12px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {cluster.latest.message}
            </p>

            <div style={{ fontSize: '13px', color: '#737373', marginBottom: '16px', lineHeight: 1.7 }}>
              <div>
                {reporters[cluster.latest.id] ?? 'Anonymous'} &middot; {when(cluster.latest.createdAt)}
                {cluster.latest.locale && cluster.latest.locale !== 'en' && ` · ${cluster.latest.locale}`}
              </div>
              {cluster.latest.pageUrl && (
                <div>
                  <a
                    href={cluster.latest.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'none', wordBreak: 'break-all' }}
                  >
                    {cluster.latest.pageUrl}
                  </a>
                </div>
              )}
            </div>

            {cluster.reports > 1 && (
              <div style={{ marginBottom: '16px' }}>
                <button
                  onClick={() => toggle(cluster.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '13px',
                    color: '#2563eb',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {isOpen ? 'Hide' : `Show the other ${cluster.reports - 1}`}
                </button>

                {isOpen && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {cluster.items.slice(1).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          borderLeft: '2px solid #e5e5e5',
                          paddingLeft: '12px',
                          fontSize: '14px',
                          color: '#404040',
                          lineHeight: 1.6,
                        }}
                      >
                        <div style={{ whiteSpace: 'pre-wrap' }}>{item.message}</div>
                        <div style={{ fontSize: '12px', color: '#a3a3a3', marginTop: '4px' }}>
                          {reporters[item.id] ?? 'Anonymous'} &middot; {when(item.createdAt)}
                          {item.pageUrl && ` · ${item.pageUrl}`}
                        </div>
                      </div>
                    ))}
                    {/* Why these were grouped. An opaque hash is impossible to
                        argue with when the grouping looks wrong. */}
                    <div style={{ fontSize: '12px', color: '#a3a3a3' }}>
                      grouped on: {cluster.tokens.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {STATUSES.filter((s) => s.value !== cluster.status).map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(cluster, s.value)}
                  disabled={busy === cluster.key}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#404040',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    padding: '7px 14px',
                    cursor: busy === cluster.key ? 'default' : 'pointer',
                    opacity: busy === cluster.key ? 0.5 : 1,
                  }}
                >
                  {s.value === 'in_progress' ? 'Start working on it' : `Mark ${s.label.toLowerCase()}`}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
