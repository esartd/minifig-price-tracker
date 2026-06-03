'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import MessageAlert from '@/components/auth/MessageAlert';
import SuccessCard from '@/components/auth/SuccessCard';
import { useTranslation } from '@/components/TranslationProvider';

function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t('auth.resetPassword.invalidToken'));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.resetPassword.passwordsMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('auth.resetPassword.passwordTooShort'));
      return;
    }

    if (!token) {
      setError(t('auth.resetPassword.invalidToken'));
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
        setError(data.error || t('auth.resetPassword.resetFailed'));
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError(t('auth.resetPassword.errorOccurred'));
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout footerText={t('auth.footerText')}>
        <SuccessCard
          title={t('auth.resetPassword.successTitle')}
          message={t('auth.resetPassword.successMessage')}
          actionText={t('navigation.signIn')}
          actionHref="/auth/signin"
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout footerText={t('auth.footerText')}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          {t('auth.resetPassword.title')}
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          lineHeight: '1.6'
        }}>
          {t('auth.resetPassword.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <MessageAlert type="error" message={error} />}

        <PasswordInput
          id="password"
          label={t('auth.resetPassword.newPassword')}
          value={password}
          onChange={setPassword}
          placeholder={t('auth.resetPassword.placeholders.newPassword')}
          autoComplete="new-password"
          minLength={8}
        />

        <PasswordInput
          id="confirmPassword"
          label={t('auth.resetPassword.confirmPassword')}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder={t('auth.resetPassword.placeholders.confirmPassword')}
          autoComplete="new-password"
          minLength={8}
        />

        <button
          type="submit"
          disabled={loading || !token}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: 'white',
            background: (loading || !token) ? '#a3a3a3' : '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: (loading || !token) ? 'not-allowed' : 'pointer',
            opacity: (loading || !token) ? 0.5 : 1,
            transition: 'all 0.2s',
            marginBottom: '0'
          }}
        >
          {loading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.resetButton')}
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
          {t('auth.resetPassword.backToSignIn')}
        </Link>
      </div>
    </AuthLayout>
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
          fontSize: 'var(--text-base)'
        }}>
          {/* Loading text from context not available here */}
          Loading...
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
