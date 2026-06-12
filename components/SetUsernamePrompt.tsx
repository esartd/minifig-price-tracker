'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircleIcon, XCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { validateUsername, generateUsernameSuggestion, sanitizeUsername } from '@/lib/username';
import { useTranslation } from '@/components/TranslationProvider';

function tx(translations: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((obj, key) => obj?.[key], translations as any) as string | undefined;
}

interface SetUsernamePromptProps {
  onSaved?: (username: string) => void;
}

export default function SetUsernamePrompt({ onSaved }: SetUsernamePromptProps) {
  const { data: session, update } = useSession();
  const { translations } = useTranslation();
  const t = (path: string) => tx(translations, path);

  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const suggestion = generateUsernameSuggestion(session?.user?.name);

  const checkAvailability = useCallback(async (username: string) => {
    if (!username) { setAvailable(null); return; }
    const validation = validateUsername(username);
    if (!validation.valid) { setAvailable(null); return; }

    setChecking(true);
    try {
      const res = await fetch(`/api/auth/update-username?check=${encodeURIComponent(username)}`);
      const data = await res.json();
      setAvailable(data.available);
    } catch {
      setAvailable(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.length >= 3) checkAvailability(value);
    }, 400);
    return () => clearTimeout(timer);
  }, [value, checkAvailability]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeUsername(e.target.value);
    setValue(sanitized);
    setError('');
    setAvailable(null);

    const validation = validateUsername(sanitized);
    if (sanitized && !validation.valid) {
      setError(validation.error || '');
    }
  };

  const handleSuggest = () => {
    if (suggestion) {
      setValue(suggestion);
      setError('');
    }
  };

  const handleSave = async () => {
    const validation = validateUsername(value);
    if (!validation.valid) { setError(validation.error || ''); return; }
    if (available === false) { setError(t('collectors.username.taken') || 'This username is already taken'); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/update-username', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: value }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }

      setSaved(true);
      await update({ username: value });
      onSaved?.(value);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: '#ecfdf5',
          borderRadius: '10px',
          border: '1px solid #a7f3d0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#065f46' }}>
          {t('collectors.username.saved') || 'Username saved!'}{' '}
          <strong>@{value}</strong>
        </p>
      </div>
    );
  }

  const isValid = validateUsername(value).valid;
  const statusColor = error ? '#ef4444' : available === true ? '#10b981' : '#737373';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <p style={{ margin: '0 0 4px 0', fontSize: 'var(--text-sm)', fontWeight: 600, color: '#171717' }}>
          {t('collectors.username.title') || 'Username'}
        </p>
        <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-xs)', color: '#737373' }}>
          {t('collectors.username.rules') || '3–30 characters, lowercase letters, numbers, hyphens, and underscores'}
        </p>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: `1px solid ${error ? '#fca5a5' : available === true ? '#86efac' : '#e5e5e5'}`,
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                transition: 'border-color 0.15s',
              }}
            >
              <span
                style={{
                  padding: '10px 0 10px 12px',
                  fontSize: 'var(--text-sm)',
                  color: '#a3a3a3',
                  userSelect: 'none',
                }}
              >
                @
              </span>
              <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={t('collectors.username.placeholder') || 'choose-a-username'}
                maxLength={30}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '10px 12px 10px 4px',
                  fontSize: 'var(--text-sm)',
                  color: '#171717',
                  backgroundColor: 'transparent',
                }}
              />
              {value && !checking && (
                <span style={{ padding: '0 12px' }}>
                  {available === true && isValid ? (
                    <CheckCircleIcon style={{ width: '18px', height: '18px', color: '#10b981' }} />
                  ) : available === false ? (
                    <XCircleIcon style={{ width: '18px', height: '18px', color: '#ef4444' }} />
                  ) : null}
                </span>
              )}
              {checking && (
                <span
                  style={{
                    padding: '0 12px',
                    fontSize: 'var(--text-xs)',
                    color: '#a3a3a3',
                  }}
                >
                  ...
                </span>
              )}
            </div>

            {error && (
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)', color: '#ef4444' }}>
                {error}
              </p>
            )}
            {!error && available === true && (
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)', color: '#10b981' }}>
                Available
              </p>
            )}
            {!error && available === false && (
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)', color: '#ef4444' }}>
                {t('collectors.username.taken') || 'This username is already taken'}
              </p>
            )}

            {value && isValid && (
              <p style={{ margin: '6px 0 0 0', fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>
                {(t('collectors.username.profileUrl') || 'Your profile: {url}').replace('{url}', `/collectors/${value}`)}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {suggestion && !value && (
              <button
                onClick={handleSuggest}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  transition: 'background-color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <SparklesIcon style={{ width: '16px', height: '16px' }} />
                {(t('collectors.username.suggestion') || 'Use {suggestion}').replace('{suggestion}', suggestion)}
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !isValid || available === false}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isValid && available !== false ? '#171717' : '#e5e5e5',
                color: isValid && available !== false ? '#fff' : '#a3a3a3',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: isValid && available !== false ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
