'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ConfirmPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [subscriber, setSubscriber] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No confirmation token provided');
      return;
    }

    // Confirm subscription
    fetch('/api/newsletter/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
          setSubscriber(data.subscriber);
        } else {
          setStatus('error');
          setMessage(data.error || 'Confirmation failed');
        }
      })
      .catch(error => {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
        console.error('Confirmation error:', error);
      });
  }, [searchParams]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#fafafa'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '48px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 24px',
              border: '3px solid rgba(0, 92, 151, 0.2)',
              borderTop: '3px solid #005C97',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '12px'
            }}>
              Confirming your subscription...
            </h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #005C97 0%, #363795 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              ✓
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '16px'
            }}>
              Subscription Confirmed!
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#525252',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              {message}
            </p>

            {subscriber && (
              <div style={{
                textAlign: 'left',
                background: '#fafafa',
                padding: '24px',
                borderRadius: '8px',
                marginBottom: '32px'
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '16px'
                }}>
                  Your notification preferences:
                </h2>
                <div style={{ fontSize: '14px', color: '#525252', lineHeight: '2' }}>
                  <div>📦 Product Updates: {subscriber.notifyProductUpdates ? '✓ On' : '✗ Off'}</div>
                  <div>💰 Deals & Sales: {subscriber.notifyDeals ? '✓ On' : '✗ Off'}</div>
                  <div>📈 Price Alerts: {subscriber.notifyPriceAlerts ? '✓ On' : '✗ Off (requires account)'}</div>
                  <div>📊 Weekly Digest: {subscriber.notifyDigest ? '✓ On' : '✗ Off'}</div>
                </div>
              </div>
            )}

            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #005C97 0%, #363795 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: '12px'
              }}
            >
              Go to FigTracker
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 24px',
              background: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#ffffff'
            }}>
              ✗
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '16px'
            }}>
              Confirmation Failed
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#525252',
              marginBottom: '32px'
            }}>
              {message}
            </p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 32px',
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function NewsletterConfirmPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e5e5',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    }>
      <ConfirmPageContent />
    </Suspense>
  );
}
