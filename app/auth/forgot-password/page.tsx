'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/auth/FormInput';
import MessageAlert from '@/components/auth/MessageAlert';
import SuccessCard from '@/components/auth/SuccessCard';

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
      <AuthLayout footerText="Price your inventory with real-time Bricklink data">
        <SuccessCard
          title="Check Your Email"
          message={
            <>
              We've sent a password reset link to <strong style={{ color: '#171717' }}>{email}</strong>
            </>
          }
          actionText="Back to Sign In"
          actionHref="/auth/signin"
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout footerText="Price your inventory with real-time Bricklink data">
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          Reset Password
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          lineHeight: '1.6'
        }}>
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <MessageAlert type="error" message={error} />}

        <FormInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="your@email.com"
          autoComplete="email"
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: 'white',
            background: loading ? '#a3a3a3' : '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            transition: 'all 0.2s',
            marginBottom: '0'
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
            fontSize: 'var(--text-sm)',
            color: '#737373',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
        >
          ← Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
