'use client';

import { useState } from 'react';

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
  placeholder = 'Enter your password',
  required = true,
  autoComplete = 'current-password',
  minLength,
  showForgotLink = false,
  onForgotClick,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

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
            Forgot?
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
          placeholder={placeholder}
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
            <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="var(--icon-base)" height="var(--icon-base)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
