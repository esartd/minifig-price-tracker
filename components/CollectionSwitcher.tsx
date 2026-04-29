'use client';

import { useRouter } from 'next/navigation';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';

interface CollectionSwitcherProps {
  currentPage: 'inventory' | 'collection';
}

export default function CollectionSwitcher({ currentPage }: CollectionSwitcherProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const displayName = currentPage === 'inventory' ? t('navigation.minifigsForSale') : t('navigation.minifigsToKeep');
  const targetPage = currentPage === 'inventory' ? '/collection' : '/inventory';

  const handleClick = () => {
    router.push(targetPage);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '700',
        lineHeight: '1',
        letterSpacing: '-0.02em',
        color: '#171717',
        margin: 0,
        padding: 0,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      {displayName}
      <ArrowsRightLeftIcon style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
    </button>
  );
}
