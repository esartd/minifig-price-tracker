'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/auth/FormInput';
import PasswordInput from '@/components/auth/PasswordInput';
import MessageAlert from '@/components/auth/MessageAlert';
import { useTranslation } from '@/components/TranslationProvider';

export default function SignIn() {
  const { t } = useTranslation();
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
        setError(t('auth.signin.errors.invalid'));
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError(t('auth.signin.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          {t('auth.signin.title')}
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          lineHeight: '1.6'
        }}>
          {t('auth.signin.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <MessageAlert type="error" message={error} />}

        <FormInput
          id="email"
          label={t('auth.signin.email')}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={t('auth.signin.placeholders.email')}
          autoComplete="email"
        />

        <PasswordInput
          id="password"
          label={t('auth.signin.password')}
          value={password}
          onChange={setPassword}
          placeholder={t('auth.signin.placeholders.password')}
          autoComplete="current-password"
          showForgotLink
          onForgotClick={() => router.push('/auth/forgot-password')}
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
          {loading ? t('auth.signin.buttonLoading') : t('auth.signin.button')}
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
          {t('auth.signin.dontHaveAccount')}{' '}
          <Link
            href="/auth/signup"
            style={{
              color: '#3b82f6',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            {t('auth.signin.signUpLink')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
