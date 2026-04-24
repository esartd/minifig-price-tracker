'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Thanks! Check your email to confirm subscription.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '48px 32px',
      color: '#ffffff',
      textAlign: 'center',
      margin: '48px 0',
    }}>
      <h3 style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: '700',
        marginBottom: '12px',
      }}>
        Get Monthly Market Reports
      </h3>
      <p style={{
        fontSize: 'var(--text-base)',
        marginBottom: '24px',
        opacity: 0.9,
      }}>
        Top 10 minifigs that increased in value, market trends, and pricing tips delivered monthly.
      </p>

      {status === 'success' ? (
        <div style={{
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          fontSize: 'var(--text-sm)',
        }}>
          ✓ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '12px',
          maxWidth: '500px',
          margin: '0 auto',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading'}
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '14px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: 'var(--text-base)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '14px 32px',
              background: '#ffffff',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: status === 'loading' ? 0.6 : 1,
            }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p style={{
          marginTop: '12px',
          fontSize: 'var(--text-sm)',
          color: '#ffcccc',
        }}>
          {message}
        </p>
      )}

      <p style={{
        marginTop: '16px',
        fontSize: 'var(--text-xs)',
        opacity: 0.7,
      }}>
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}
