'use client';

import { useState } from 'react';

type Result = {
  sent: number;
  total: number;
  failed: number;
  testOnly: boolean;
  errors?: string[];
};

export default function AnnounceClient({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  // Sending to everyone stays behind a second click. The button reads "Send to
  // N people" only after a test has gone out, because the failure mode here is
  // not a bug -- it is 64 people receiving a half-finished draft.
  const [testSent, setTestSent] = useState(false);

  async function send(testOnly: boolean) {
    setError('');
    if (!subject.trim() || !body.trim()) {
      setError('Add a subject and a message first.');
      return;
    }
    if (!testOnly && !confirm(`Send this to ${subscriberCount} people? This cannot be undone.`)) {
      return;
    }

    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/send-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, testOnly }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setResult(data);
        if (testOnly) setTestSent(true);
      }
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setBusy(false);
    }
  }

  const label = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#171717', marginBottom: '6px' } as const;
  const field = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d4d4d4',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'inherit',
    color: '#171717',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={label} htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What the email is about"
          style={field}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={label} htmlFor="body">Message</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          placeholder={'Write it the way you would write to one person.\n\nLeave a blank line between paragraphs.'}
          style={{ ...field, resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>
      <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 24px' }}>
        Plain text. Blank lines become paragraphs. An unsubscribe link is added automatically.
      </p>

      {error && (
        <p style={{ fontSize: '14px', color: '#dc2626', margin: '0 0 16px' }}>{error}</p>
      )}

      {result && (
        <div
          style={{
            background: result.failed ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${result.failed ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#171717',
          }}
        >
          {result.testOnly ? 'Test sent to you' : 'Sent'}: {result.sent} of {result.total}
          {result.failed > 0 && ` — ${result.failed} failed`}
          {result.errors?.length ? (
            <div style={{ fontSize: '12px', color: '#737373', marginTop: '6px' }}>
              {result.errors.join(' · ')}
            </div>
          ) : null}
          {result.testOnly && (
            <div style={{ fontSize: '13px', color: '#525252', marginTop: '6px' }}>
              Check how it looks — and whether it landed in your inbox rather than Promotions.
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => send(true)}
          disabled={busy}
          style={{
            background: '#ffffff',
            color: '#171717',
            border: '1px solid #d4d4d4',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '15px',
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? 'Sending…' : 'Send test to myself'}
        </button>

        <button
          type="button"
          onClick={() => send(false)}
          disabled={busy || !testSent}
          title={testSent ? undefined : 'Send yourself a test first'}
          style={{
            background: testSent ? '#3b82f6' : '#e5e5e5',
            color: testSent ? '#ffffff' : '#a3a3a3',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '15px',
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: busy || !testSent ? 'default' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          Send to {subscriberCount} {subscriberCount === 1 ? 'person' : 'people'}
        </button>
      </div>

      {!testSent && (
        <p style={{ fontSize: '12px', color: '#737373', margin: '10px 0 0' }}>
          Send yourself a test before this unlocks.
        </p>
      )}
    </div>
  );
}
