'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

/**
 * Human Verification Page - Cloudflare Turnstile CAPTCHA
 *
 * UX Best Practices:
 * - Invisible by default (no interaction needed)
 * - Only shows challenge if suspicious behavior detected
 * - Mobile-friendly, accessible
 * - Preserves user's intended destination
 * - Graceful error recovery
 */

export default function VerifyHumanClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

  useEffect(() => {
    // Wait for Turnstile script to load
    const checkTurnstile = setInterval(() => {
      if (window.turnstile) {
        setTurnstileLoaded(true);
        clearInterval(checkTurnstile);
      }
    }, 100);

    return () => clearInterval(checkTurnstile);
  }, []);

  useEffect(() => {
    if (turnstileLoaded) {
      // Render visible Turnstile widget (managed mode for better bot detection)
      window.turnstile.render('#turnstile-widget', {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: async (token: string) => {
          // User passed CAPTCHA
          await handleVerificationSuccess(token);
        },
        'error-callback': () => {
          setError('Verification failed. Please refresh and try again.');
          setIsVerifying(false);
        },
        'expired-callback': () => {
          // Token expired, auto-retry
          window.turnstile.reset();
        },
        theme: 'light',
        size: 'normal',
        appearance: 'always', // Force interactive challenge (not invisible)
      });
    }
  }, [turnstileLoaded]);

  const handleVerificationSuccess = async (token: string) => {
    try {
      // Verify token on server
      const response = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        // Verification successful - cookie is set by server (httpOnly, secure)
        // Show success message briefly
        setIsVerifying(false);

        // Redirect to original destination
        setTimeout(() => {
          router.push(returnTo);
        }, 500);
      } else {
        setError('Verification failed. Please try again.');
        setIsVerifying(false);

        // Reset widget for retry
        if (window.turnstile) {
          window.turnstile.reset();
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      setIsVerifying(false);
    }
  };

  return (
    <>
      {/* Load Cloudflare Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={() => setTurnstileLoaded(true)}
      />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
        padding: '24px',
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e5e5',
          padding: '40px',
          textAlign: 'center',
        }}>
          {/* Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            background: '#eff6ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <ShieldCheckIcon style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#171717',
            marginBottom: '12px',
          }}>
            Quick Security Check
          </h1>

          {/* Explanation (Transparent UX) */}
          <p style={{
            fontSize: '15px',
            color: '#737373',
            lineHeight: '1.6',
            marginBottom: '32px',
          }}>
            We detected unusual traffic patterns. Please complete this quick test to verify you're human.
            This helps us prevent spam and keep the site fast for everyone.
          </p>

          {/* Turnstile Widget Container */}
          {isVerifying && !error && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div id="turnstile-widget"></div>
              <p style={{
                fontSize: '13px',
                color: '#a3a3a3',
                marginTop: '8px',
              }}>
                This usually takes just a few seconds...
              </p>
            </div>
          )}

          {/* Success State */}
          {!isVerifying && !error && (
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <svg style={{ width: '24px', height: '24px', color: '#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#16a34a' }}>
                Verified! Redirecting...
              </p>
            </div>
          )}

          {/* Error State (Graceful Recovery) */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <p style={{
                fontSize: '14px',
                color: '#dc2626',
                marginBottom: '12px',
              }}>
                {error}
              </p>
              <button
                onClick={() => {
                  setError('');
                  setIsVerifying(true);
                  if (window.turnstile) {
                    window.turnstile.reset();
                  }
                }}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Footer Info */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f5f5f5',
          }}>
            <p style={{
              fontSize: '13px',
              color: '#a3a3a3',
              lineHeight: '1.6',
            }}>
              Protected by Cloudflare Turnstile
              <br />
              <a href="https://www.cloudflare.com/products/turnstile/" target="_blank" rel="noopener" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Learn more
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Extend window type for Turnstile
declare global {
  interface Window {
    turnstile: {
      render: (container: string, options: any) => void;
      reset: (widgetId?: string) => void;
    };
  }
}
