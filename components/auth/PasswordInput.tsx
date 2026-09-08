'use client';

import { useState } from 'react';
import { useTranslation } from '@/components/TranslationProvider';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  showForgotLink?: boolean;
  onForgotClick?: () => void;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete = 'current-password',
  minLength,
  showForgotLink = false,
  onForgotClick,
}: PasswordInputProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  // Default is evaluated here (not as a prop default) so it can go through useTranslation.
  const resolvedPlaceholder = placeholder ?? (t('auth.signin.placeholders.password') || 'Enter your password');

  return (
    <div style={{ marginBottom: '32px' }}>
      {showForgotLink ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <label htmlFor={id} style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            color: '#525252',
            letterSpacing: '0.01em'
          }}>
            {label}
          </label>
          <button
            type="button"
            onClick={onForgotClick}
            style={{
              fontSize: 'var(--text-sm)',
              color: '#3b82f6',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.2s',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {t('auth.signin.forgotLink') || 'Forgot?'}
          </button>
        </div>
      ) : (
        <label htmlFor={id} style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: '#525252',
          marginBottom: '12px',
          letterSpacing: '0.01em'
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            padding: '16px 52px 16px 20px',
            fontSize: 'var(--text-base)',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            color: '#171717',
            background: 'white',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          placeholder={resolvedPlaceholder}
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
            <EyeIcon style={{ width: 'var(--icon-base)', height: 'var(--icon-base)' }} />
          ) : (
            <EyeSlashIcon style={{ width: 'var(--icon-base)', height: 'var(--icon-base)' }} />
          )}
        </button>
      </div>
    </div>
  );
}
