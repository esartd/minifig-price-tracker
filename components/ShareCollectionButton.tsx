'use client';

import { useState } from 'react';
import { ShareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useTranslation } from './TranslationProvider';
import Link from 'next/link';

type CollectionType = 'inventory' | 'collection' | 'sets-inventory' | 'sets-collection';

interface ShareCollectionButtonProps {
  type: CollectionType;
}

export default function ShareCollectionButton({ type }: ShareCollectionButtonProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  const username = session?.user?.username;
  const profilePublic = session?.user?.profilePublic;
  const profileUrl = username ? `${window.location.origin}/collectors/${username}` : '';

  const copyLink = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // No username or profile not public — show setup prompt
  if (!username || !profilePublic) {
    return (
      <Link
        href="/account"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: '#525252',
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <ShareIcon style={{ width: '18px', height: '18px' }} />
        <span>{t('common.share') || 'Share'}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={copyLink}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontSize: 'var(--text-sm)',
        fontWeight: '500',
        color: copied ? '#3b82f6' : '#525252',
        background: '#ffffff',
        border: '1px solid',
        borderColor: copied ? '#3b82f6' : '#e5e5e5',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.borderColor = '#d4d4d4';
          e.currentTarget.style.color = '#171717';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.borderColor = '#e5e5e5';
          e.currentTarget.style.color = '#525252';
        }
      }}
    >
      {copied ? (
        <>
          <CheckIcon style={{ width: '18px', height: '18px' }} />
          <span className="share-button-text">{t('common.copied') || 'Copied!'}</span>
        </>
      ) : (
        <>
          <ShareIcon style={{ width: '18px', height: '18px' }} />
          <span className="share-button-text">{t('common.share') || 'Share'}</span>
        </>
      )}
    </button>
  );
}
