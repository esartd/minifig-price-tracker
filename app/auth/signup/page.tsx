'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/auth/FormInput';
import PasswordInput from '@/components/auth/PasswordInput';
import MessageAlert from '@/components/auth/MessageAlert';
import { useTranslation } from '@/components/TranslationProvider';

export default function SignUp() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('auth.signup.errors.failed'));
        setLoading(false);
        return;
      }

      // Automatically sign in after signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('auth.signup.errors.accountCreatedSignInFailed'));
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError(t('auth.signup.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

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
          {t('auth.signup.title')}
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          lineHeight: '1.6',
          marginBottom: '16px'
        }}>
          {t('auth.signup.subtitle')}
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', color: '#3b82f6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ fontSize: 'var(--text-sm)', color: '#525252' }}>{t('auth.signup.features.trackUnlimited')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', color: '#3b82f6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ fontSize: 'var(--text-sm)', color: '#525252' }}>{t('auth.signup.features.realtimePrices')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', color: '#3b82f6' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ fontSize: 'var(--text-sm)', color: '#525252' }}>{t('auth.signup.features.totalValue')}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <MessageAlert type="error" message={error} />}

        <FormInput
          id="name"
          label={t('auth.signup.name')}
          type="text"
          value={name}
          onChange={setName}
          placeholder={t('auth.signup.placeholders.name')}
          autoComplete="name"
        />

        <FormInput
          id="email"
          label={t('auth.signup.email')}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={t('auth.signup.placeholders.email')}
          autoComplete="email"
        />

        <PasswordInput
          id="password"
          label={t('auth.signup.password')}
          value={password}
          onChange={setPassword}
          placeholder={t('auth.signup.placeholders.password')}
          autoComplete="new-password"
          minLength={6}
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
            transition: 'all 0.2s'
          }}
        >
          {loading ? t('auth.signup.buttonLoading') : t('auth.signup.button')}
        </button>
      </form>

      <div style={{
        marginTop: '32px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#737373'
        }}>
          {t('auth.signup.alreadyHaveAccount')}{' '}
          <Link
            href="/auth/signin"
            style={{
              color: '#3b82f6',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            {t('auth.signup.signInLink')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
