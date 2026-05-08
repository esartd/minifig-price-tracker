'use client';

import { useState } from 'react';

export default function AdminImagesPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const triggerEndpoint = async (endpoint: string) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
      });

      const data = await response.json();
      setResult({ success: response.ok, data });
    } catch (error) {
      setResult({ success: false, error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '32px' }}>Admin Tools</h1>

      <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Image Management</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        <button
          onClick={() => triggerEndpoint('/api/admin/add-adobe-images')}
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          Add Adobe Images to BrickEconomy Article
        </button>

        <button
          onClick={() => triggerEndpoint('/api/admin/add-bricklink-images')}
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          Add Images to BrickLink Article
        </button>
      </div>

      <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>SEO Articles</h2>
      <div style={{ marginBottom: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Run these scripts manually in your terminal with DATABASE_URL set:
        </p>
        <code style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: '#374151' }}>
          npx tsx scripts/create-pricing-guide.ts
        </code>
        <code style={{ display: 'block', marginTop: '4px', fontSize: '13px', color: '#374151' }}>
          npx tsx scripts/create-selling-guide.ts
        </code>
      </div>

      {loading && (
        <div style={{ padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
          Loading...
        </div>
      )}

      {result && (
        <div
          style={{
            padding: '20px',
            background: result.success ? '#d1fae5' : '#fee2e2',
            borderRadius: '8px',
            marginTop: '20px',
          }}
        >
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
