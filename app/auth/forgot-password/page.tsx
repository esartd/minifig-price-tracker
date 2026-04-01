'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send reset email');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '480px'
        }}>
          <div className="auth-card" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '64px',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#d1fae5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg style={{ width: '32px', height: '32px', color: '#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '12px',
              letterSpacing: '-0.01em'
            }}>
              Check Your Email
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#737373',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              We've sent a password reset link to <strong style={{ color: '#171717' }}>{email}</strong>
            </p>
            <Link
              href="/auth/signin"
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px'
      }}>
        <div className="auth-card" style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '64px',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Reset Password
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#737373',
              lineHeight: '1.6'
            }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                marginBottom: '32px',
                padding: '16px 20px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '12px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#991b1b',
                  fontWeight: '500'
                }}>
                  {error}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '32px' }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#525252',
                marginBottom: '12px',
                letterSpacing: '0.01em'
              }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  color: '#171717',
                  background: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                placeholder="your@email.com"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: loading ? '#a3a3a3' : '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div style={{
            marginTop: '32px',
            textAlign: 'center'
          }}>
            <Link
              href="/auth/signin"
              style={{
                fontSize: '15px',
                color: '#737373',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.6'
          }}>
            Price your inventory with real-time Bricklink data
          </p>
        </div>
      </div>
    </div>
  );
}
