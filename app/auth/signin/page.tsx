'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        {/* Form Card */}
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
              Welcome Back
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#737373',
              lineHeight: '1.6'
            }}>
              Sign in to access your inventory
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

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <label htmlFor="password" style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#525252',
                  letterSpacing: '0.01em'
                }}>
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  style={{
                    fontSize: '14px',
                    color: '#3b82f6',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
                placeholder="Enter your password"
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: '32px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '15px',
              color: '#737373'
            }}>
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                style={{
                  color: '#3b82f6',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
              >
                Sign Up
              </Link>
            </p>
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
            Track LEGO minifig prices with real-time Bricklink data
          </p>
        </div>
      </div>
    </div>
  );
}
