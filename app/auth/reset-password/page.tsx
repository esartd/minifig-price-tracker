'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError('An error occurred. Please try again.');
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
              Password Reset Successful
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#737373',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Your password has been changed. You can now sign in with your new password.
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
              Sign In
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
              Set New Password
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#737373',
              lineHeight: '1.6'
            }}>
              Enter your new password below.
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

            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#525252',
                marginBottom: '12px',
                letterSpacing: '0.01em'
              }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    padding: '16px 52px 16px 20px',
                    fontSize: '16px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    color: '#171717',
                    background: 'white',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="Enter new password"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#737373',
                    outline: 'none'
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label htmlFor="confirmPassword" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#525252',
                marginBottom: '12px',
                letterSpacing: '0.01em'
              }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    padding: '16px 52px 16px 20px',
                    fontSize: '16px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    color: '#171717',
                    background: 'white',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="Confirm new password"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#737373',
                    outline: 'none'
                  }}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: (loading || !token) ? '#a3a3a3' : '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                cursor: (loading || !token) ? 'not-allowed' : 'pointer',
                opacity: (loading || !token) ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px'
        }}>
          Loading...
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
