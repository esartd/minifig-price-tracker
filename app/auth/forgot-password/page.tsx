'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/auth/FormInput';
import MessageAlert from '@/components/auth/MessageAlert';
import SuccessCard from '@/components/auth/SuccessCard';
import { useTranslation } from '@/components/TranslationProvider';

export default function ForgotPassword() {
  const { t } = useTranslation();
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
        setError(data.error || t('auth.forgotPassword.errors.failed'));
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError(t('auth.forgotPassword.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout footerText={t('auth.footer')}>
        <SuccessCard
          title={t('auth.forgotPassword.success.title')}
          message={
            <>
              {t('auth.forgotPassword.success.message')} <strong style={{ color: '#171717' }}>{email}</strong>
            </>
          }
          actionText={t('auth.forgotPassword.success.button')}
          actionHref="/auth/signin"
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout footerText={t('auth.footer')}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          {t('auth.forgotPassword.title')}
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          lineHeight: '1.6'
        }}>
          {t('auth.forgotPassword.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <MessageAlert type="error" message={error} />}

        <FormInput
          id="email"
          label={t('auth.forgotPassword.email')}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={t('auth.forgotPassword.placeholders.email')}
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
          {loading ? t('auth.forgotPassword.buttonLoading') : t('auth.forgotPassword.button')}
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
          ← {t('auth.forgotPassword.backToSignIn')}
        </Link>
      </div>
    </AuthLayout>
  );
}
