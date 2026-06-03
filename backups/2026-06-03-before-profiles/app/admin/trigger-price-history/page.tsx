'use client';

import { useState } from 'react';

export default function TriggerPriceHistory() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const triggerRecord = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/price-history/record', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Failed to trigger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>Manual Price History Trigger</h1>

      <button
        onClick={triggerRecord}
        disabled={loading}
        style={{
          padding: '12px 24px',
          background: loading ? '#d4d4d4' : '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        {loading ? 'Recording...' : 'Trigger Price History Recording'}
      </button>

      {result && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: result.success ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${result.success ? '#86efac' : '#fca5a5'}`,
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 12px 0' }}>
            {result.success ? '✅ Success' : '❌ Error'}
          </h3>
          <pre style={{
            background: '#ffffff',
            padding: '12px',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
